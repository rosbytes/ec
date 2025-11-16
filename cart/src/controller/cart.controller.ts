import type { NextFunction, Request, Response } from "express";
import { internalGet } from "../utils/helper.js";

export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    const { productId, variantId } = req.body;
    let { quantity } = req.body;

    if (!productId || !variantId) {
      return res.json({
        success: true,
        message: "productId & variantId are required",
      });
    }
    if (!quantity || quantity < 1) {
      quantity = 1;
    }

    const producRes = await internalGet(
      `${process.env.PRODUCT_SERVICE_URL}/internal/products/${productId}/${variantId}`
    );
    const product = producRes.data;

    if(!product.st)
    
  } catch (err) {}
};
