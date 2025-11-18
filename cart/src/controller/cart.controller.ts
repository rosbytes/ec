import type { NextFunction, Request, Response } from "express";
import { internalGet } from "../utils/helper.js";
import { prisma } from "../config/prisma.js";
import { email } from "zod";

export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
      `${process.env.PRODUCT_SERVICE_URL}/internal/products/${productId}/${variantId}`
    );

    const product = producRes.data;

    if (!product.isActive || !product.isAvailable) {
      return res.status(400).json({
        message: "Product/variant is not available",
      });
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

      return res.json({ message: "Quantity increased", item: updated });
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
    return res.json({ message: "Item added", item: newItem });
  } catch (err: any) {
    console.error("incrementCartItem:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};

export const decrementCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { itemId } = req.body;

    if (!itemId) {
      return res.status(400).json({ message: "itemId is required" });
    }

    const existing = await prisma.cartItem.findUnique({
      where: { id: itemId },
    });

    if (!existing) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (existing.quantity <= 1) {
      await prisma.cartItem.delete({ where: { id: itemId } });
      return res.json({ message: "Item removed" });
    }
    // else
    const updated = await prisma.cartItem.update({
      where: { id: itemId },
      data: {
        quantity: existing.quantity - 1,
      },
    });

    return res.json({ message: "Quantity decreased", item: updated });
  } catch (err: any) {
    console.error("error during decrementCartItem:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};

export const removeCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { itemId } = req.params;

    await prisma.cartItem.delete({ where: { id: itemId } });

    return res.json({ message: "Item removed" });
  } catch (err: any) {
    console.error("error during decrementCartItem:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};

export const getCart = async (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;

  const cart = await prisma.cart.findFirst({
    where: { userId },
    include: { items: true },
  });

  if (!cart) {
    return res.json({
      items: [],
      itemsTotal: 0,
      deliveryCharge: 30,
      grandTotal: 30,
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
    items: cart.items,
    itemsTotal,
    deliveryCharge,
    grandTotal,
  });
};

export const clearCart = async (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;

  const cart = await prisma.cart.findFirst({ where: { userId } });

  if (!cart) return res.json({ message: "Nothing to clear" });

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

  return res.json({
    message: "Cart cleared",
    items: [],
    itemsTotal: 0,
    deliveryCharge: 30,
    grandTotal: 30,
  });
};
