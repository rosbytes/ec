import type { Request, Response } from "express";
import { prisma } from "../utils/prisma.js";

export const internalGetCart = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;

    if (!userId) return res.status(400).json({ message: "userId required" });

    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: true },
    });

    if (!cart) return res.json({ items: [] });

    return res.json({
      items: cart.items,
    });
  } catch (err:any) {
    console.error("internalGetCart:", err);
    return res.status(500).json({ message: err.message });
  }
};


export const internalClearCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId)
      return res.status(400).json({ message: "userId required" });

    const cart = await prisma.cart.findFirst({
      where: { userId },
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    return res.json({ message: "Cart cleared" });
  } catch (err: any) {
    console.error("internalClearCart:", err);
    return res.status(500).json({ message: err.message });
  }
};