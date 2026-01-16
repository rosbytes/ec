import type { NextFunction, Request, Response } from "express";
import { internalGet } from "../utils/internalHttp.js"
import { prisma } from "../utils/prisma.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const addToCart = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.headers["x-user-id"] as string;
  const { productId, variantId } = req.body;

  if (!productId || !variantId) {
    return res.json({
      success: true,
      message: "productId & variantId are required",
    });
  }

  // product details fetch
  const producRes = await internalGet(
    `${process.env.PRODUCT_SERVICE_URL}/api/internal/products/${productId}/variants/${variantId}`
  );

  const product = producRes.data;

  if (!product.isActive || !product.isAvailable) {
    throw new ApiError(400, "Product/variant is not available");
  }

  // find user cart

  let cart = await prisma.cart.findFirst({ where: { userId } });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
    });
  }
  // item exist?
  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId, variantId },
  });

  if (existingItem) {
    let newQty = existingItem.quantity + 1;

    if (newQty > product.stock) {
      newQty = product.stock;
    }

    const updated = await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQty },
    });

    return res.json({ success: true, message: "Quantity increased", data: updated });
  }

  // first time creation

  const newItem = await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      variantId,
      name: product.name,
      localName: product.localName,
      image: product.image,
      label: product.label,
      price: product.price,
      quantity: 1,
    },
  });
  return res.json({ success: true, message: "Item added", data: newItem });
});

export const decrementCartItem = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { itemId } = req.body;

  if (!itemId) {
    return res.status(400).json({ message: "itemId is required" });
  }

  const existing = await prisma.cartItem.findUnique({
    where: { id: itemId },
  });

  if (!existing) {
    throw new ApiError(404, "Item not found");
  }

  if (existing.quantity <= 1) {
    await prisma.cartItem.delete({ where: { id: itemId } });
    return res.json({ success: true, message: "Item removed" });
  }
  // else
  const updated = await prisma.cartItem.update({
    where: { id: itemId },
    data: {
      quantity: existing.quantity - 1,
    },
  });

  return res.json({ success: true, message: "Quantity decreased", data: updated });
});

export const removeCartItem = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { itemId } = req.params;

  if (!itemId) {
    return res.status(400).json({ message: "itemId is required" });
  }

  await prisma.cartItem.delete({ where: { id: itemId } });

  return res.json({ success: true, message: "Item removed" });
});

export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;

  const cart = await prisma.cart.findFirst({
    where: { userId },
    include: { items: true },
  });

  if (!cart) {
    return res.json({
      success: true,
      data: {
        items: [],
        itemsTotal: 0,
        deliveryCharge: 30,
        grandTotal: 30,
      }
    });
  }

  const itemsTotal = cart.items.reduce(
    (sum: number, item: { price: number; quantity: number }) =>
      sum + item.price * item.quantity,
    0
  );

  const deliveryCharge = 30;
  const grandTotal = itemsTotal + deliveryCharge;

  return res.json({
    success: true,
    data: {
      items: cart.items,
      itemsTotal,
      deliveryCharge,
      grandTotal,
    }
  });
});

export const clearCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;

  const cart = await prisma.cart.findFirst({ where: { userId } });

  if (!cart) return res.json({ message: "Nothing to clear" });

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

  return res.json({
    success: true,
    message: "Cart cleared",
    data: {
      items: [],
      itemsTotal: 0,
      deliveryCharge: 30,
      grandTotal: 30,
    }
  });
});

