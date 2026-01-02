import { Router, type Request, type Response } from "express";
import { prisma } from "../utils/prisma.js";
import { OrderStatus } from "../generated/prisma/index.js";
import { razorpay } from "../utils/razorpay.js";
import crypto from "crypto";
import { internalGet, internalPost } from "../utils/helper.js";
import orders from "razorpay/dist/types/orders.js";

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
  const cart = await internalGet(
    `$process.env.CART_SERVICE_URL/internal/cart`,
    { userId }
  );
  if (!cart?.items?.length) throw new Error("cart empty");
  return cart;
};

const validateCartAndTotal = async (cart: any) => {
  let total = 0;
  for (const item of cart.items) {
    // cart items
    //product fetch
    const prod = await internalGet(
      `${process.env.PRODUCT_SERVICE_URL}/internal/${item.productId}/${item.variantId}`
    );
    const p = prod.data ?? prod;
    if (!p.isActive || !p.isAvailable)
      throw new Error(`${item.name} unavailable`);

    if (item.quantity > p.stock) {
      throw new Error(`${p.stock} left for ${item.name}`);
    }

    total += item.price * item.quantity;
  }
  return total;
};
/**
 * create order
 */
export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    const { shippingAddress } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({
        message: "shipping address required",
      });
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
      orderId: order.id,
      orderNumber: order.orderNumber,
      totalAmount: grandTotal,
    });

    //   if (paymentMode === "COD") {
    //    await prisma.order.update({
    // where:{id:}
    //    })
    //   }

    //   const rOrder = await razorpay.orders.create({
    //     amount: grandTotal * 100,
    //     currency: "INR",
    //     receipt: order.orderNumber,
    //   });

    //   await prisma.order.update({
    //     where: { id: order.id },
    //     data: {
    //       paymentProvider: "razorpay",
    //       paymentOrderId: rOrder.id,
    //     },
    //   });

    //   return res.json({
    //     message: "Order created",
    //     orderId: order.id,
    //     orderNumber: order.orderNumber,
    //     razorpayOrderId: rOrder.id,
    //     amount: grandTotal * 100,
    //     currency: "INR",
    //     keyId: process.env.RAZORPAY_KEY_ID,
    //   });
  } catch (err: any) {
    console.error("createOrder:", err);
    return res.status(500).json({ message: err.message });
  }
};

export const payOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    const { id } = req.params;
    const { paymentMode } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Order id is required" });
    }
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order || order.userId !== userId) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== OrderStatus.PENDING_PAYMENT)
      return res.status(400).json({ message: "Order not payable" });

    /* cod */
    if (paymentMode === "COD") {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: OrderStatus.PAID,
          paymentMethod: "COD",
        },
      });
      return res.json({ status: "PAID", paymentMode: "COD" });
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
      orderId: order.id,
      orderNumber: order.orderNumber,
      razorpayOrderId: rOrder.id,
      amount: order.totalAmount * 100,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

/* verify stock */

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature)
      return res.status(400).json({ message: "Invalid signature" });

    // just return success for ui
    return res.json({ status: "PAYMENT_SUCCESS" });
  } catch (err: any) {
    console.log(err.stack);
    return res.sendStatus(500).json({ message: "Verification failed" });
  }
};

export const paymentWebhook = async (req: Request, res: Response) => {
  try {
    const signature = req.headers["x-razorpay-signature"] as string;
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(req.body)
      .digest("hex");

    if (expected !== signature) return res.sendStatus(400);
    if (req.body.event !== "payment.captured") return res.sendStatus(200);
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
      for (const it of order.items) {
        await internalPost(
          `${process.env.PRODUCT_SERVICE_URL}/internal/decrement-stock`,
          { productId: it.productId, variantId: it.variantId, qty: it.quantity }
        );
      }
      // cart clear
      await internalPost(`${process.env.CART_SERVICE_URL}/internal/clear`, {
        userId: order.userId,
      });
    });
  } catch (err: any) {
    return res.sendStatus(500).json({
      message: err.stack,
    });
  }
};

/* get order */

export const getOrders = async (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;

  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return res.json(orders);
};

export const getOrderById = async (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Order id is required" });
  }

  const order = await prisma.order.findFirst({
    where: { id },
    include: { items: true },
  });

  if (!order || order.userId !== userId)
    return res.status(404).json({ message: "Order not found" });
  return res.json(order);
};
