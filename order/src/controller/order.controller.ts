import { Router, type Request, type Response } from "express";
import { prisma } from "../utils/prisma.js";
import { OrderStatus } from "../generated/prisma/index.js";
import { razorpay } from "../utils/razorpay.js";
import crypto from "crypto";
import { internalGet, internalPost } from "../utils/internalHttp.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";


const generateOrderId = () => {
  const t = Date.now().toString(36).toUpperCase();
  const r = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ORD${t}${r}`;
};

const getTimeSlot = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(7, 0, 0, 0);
  return {
    slot: "07:00 AM - 10:00 AM",
    expectedDelivery: tomorrow,
  };
};

const fetchCart = async (userId: string) => {
  const response = await internalGet(
    `${process.env.CART_SERVICE_URL}/api/internal/cart`,
    { userId }
  );
  // Internal API now returns { success: true, data: cart }
  const cart = response?.data;
  if (!cart?.items?.length) throw new ApiError(400, "cart empty");
  return cart;
};

const validateCartAndTotal = async (cart: any) => {
  let total = 0;
  for (const item of cart.items) {
    // cart items
    //product fetch
    const prod = await internalGet(
      `${process.env.PRODUCT_SERVICE_URL}/api/internal/products/${item.productId}/variants/${item.variantId}`
    );
    const p = prod.data ?? prod;
    if (!p.isActive || !p.isAvailable)
      throw new ApiError(400, `${item.name} unavailable`);

    if (item.quantity > p.stock) {
      throw new ApiError(400, `${p.stock} left for ${item.name}`);
    }

    total += item.price * item.quantity;
  }
  return total;
};
/**
 * create order
 */
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  const { shippingAddress } = req.body;

  if (!shippingAddress) {
    throw new ApiError(400, "shipping address required");
  }
  // fetch cart
  const cart = await fetchCart(userId);
  const itemsTotal = await validateCartAndTotal(cart);

  const deliveryCharge = 30;
  const grandTotal = itemsTotal + deliveryCharge;
  const { slot, expectedDelivery } = getTimeSlot();

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        orderNumber: generateOrderId(),
        userId,
        status: OrderStatus.PENDING_PAYMENT,
        totalAmount: grandTotal,
        itemsTotal,
        deliveryCharge,
        shippingAddress,
        slot,
        expectedDelivery,
      },
    });

    await tx.orderItem.createMany({
      data: cart.items.map((i: any) => ({
        orderId: created.id,
        productId: i.productId,
        variantId: i.variantId,
        name: i.name,
        localName: i.localName,
        image: i.image,
        label: i.label,
        price: i.price,
        quantity: i.quantity,
      })),
    });
    return created;
  });
  return res.json({
    success: true,
    data: {
      orderId: order.id,
      orderNumber: order.orderNumber,
      totalAmount: grandTotal,
    }
  });
});

export const payOrder = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  const { id } = req.params;
  const { paymentMode } = req.body;

  if (!id) {
    throw new ApiError(400, "Order id is required");
  }
  const order = await prisma.order.findUnique({
    where: { id },
  });

  if (!order || order.userId !== userId) {
    throw new ApiError(404, "Order not found");
  }

  if (order.status !== OrderStatus.PENDING_PAYMENT) {
    throw new ApiError(400, "Order not payable");
  }

  /* cod */
  if (paymentMode === "COD") {
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: OrderStatus.PAID,
        paymentMethod: "COD",
      },
    });
    return res.json({
      success: true,
      data: { status: "PAID", paymentMode: "COD" }
    });
  }

  /* online payment */
  const rOrder = await razorpay.orders.create({
    amount: order.totalAmount * 100,
    currency: "INR",
    receipt: order.orderNumber,
    notes: {
      orderId: order.id,
      userId: order.userId,
    },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentProvider: "razorpay",
      paymentOrderId: rOrder.id,
    },
  });

  return res.json({
    success: true,
    data: {
      orderId: order.id,
      orderNumber: order.orderNumber,
      razorpayOrderId: rOrder.id,
      amount: order.totalAmount * 100,
      keyId: process.env.RAZORPAY_KEY_ID,
    }
  });
});

/* verify stock */

export const verifyPayment = asyncHandler(async (req: Request, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");

  if (expected !== razorpay_signature) {
    throw new ApiError(400, "Invalid signature");
  }

  // just return success for ui
  return res.json({ success: true, data: { status: "PAYMENT_SUCCESS" } });
});

export const paymentWebhook = async (req: Request, res: Response) => {
  try {
    const signature = req.headers["x-razorpay-signature"] as string;

    const rawBody = req.body as Buffer;

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(rawBody)
      .digest("hex");

    if (expected !== signature) return res.sendStatus(400);

    //parse JSON AFTER verification
    const payload = JSON.parse(rawBody.toString("utf8"));

    if (payload.event !== "payment.captured") {
      return res.sendStatus(200);
    }

    const razorpayOrderId = req.body.payload.payment.entity.order_id;
    const paymentId = req.body.payload.payment.entity.id;
    const method = req.body.payload.payment.entity.method;

    const order = await prisma.order.findFirst({
      where: { paymentOrderId: razorpayOrderId },
      include: { items: true },
    });

    if (!order || order.status === OrderStatus.PAID) return res.sendStatus(200);

    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: OrderStatus.PAID,
          paymentMethod: method,
          paymentRef: paymentId,
        },
      });
      // stock decrement
      // bad approach -> 5 https calls
      // for (const it of order.items) {
      //   await internalPost(
      //     `${process.env.PRODUCT_SERVICE_URL}/api/internal/decrement-stock`,
      //     { productId: it.productId, variantId: it.variantId, qty: it.quantity }
      //   );
      // }

      await internalPost(
        `${process.env.PRODUCT_SERVICE_URL}/api/internal/decrement-stock`,
        {
          items: order.items.map((it) => ({
            productId: it.productId,
            variantId: it.variantId,
            qty: it.quantity
          })),
        }
      );

      // cart clear
      await internalPost(`${process.env.CART_SERVICE_URL}/api/internal/clear`, {
        userId: order.userId,
      });
    });
    return res.sendStatus(200);
  } catch (err: any) {
    console.error("Webhook Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* get order */

export const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;

  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return res.json({ success: true, data: orders });
});

export const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Order id is required");
  }

  const order = await prisma.order.findFirst({
    where: { id },
    include: { items: true },
  });

  if (!order || order.userId !== userId) {
    throw new ApiError(404, "Order not found");
  }
  return res.json({ success: true, data: order });
});



