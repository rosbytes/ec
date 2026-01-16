import type { Request, Response } from "express";
import { prisma } from "../utils/prisma.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const internalGetCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.query.userId as string;

  if (!userId) {
    throw new ApiError(400, "userId required");
  }

  const cart = await prisma.cart.findFirst({
    where: { userId },
    include: { items: true },
  });

  if (!cart) return res.json({ items: [] });

  return res.json({
    items: cart.items,
  });
});


export const internalClearCart = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.body;

  if (!userId) {
    throw new ApiError(400, "userId required");
  }

  const cart = await prisma.cart.findFirst({
    where: { userId },
  });

  if (cart) {
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  }

  return res.json({ message: "Cart cleared" });
});
