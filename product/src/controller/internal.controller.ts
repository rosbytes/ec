import { Request, Response, NextFunction } from "express";
import { Product } from "../model/product.model";
import { asyncHandler } from "../middleware/asyncHandler";
import { ApiError } from "../utils/ApiError";

export const getProductDetails = asyncHandler(async (req: Request, res: Response) => {
  const { productId, variantId } = req.params;
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const variant = product.variants.find(
    (v) => v._id.toString() === variantId
  );

  if (!variant) {
    throw new ApiError(404, "Variant not found");
  }

  return res.json({
    productId: product._id,
    variantId: variant._id,
    name: product.name,
    localName: product.localName,
    category: product.category,
    label: variant.label,
    price: variant.price,
    stock: variant.stock,
    isAvailable: variant.isAvailable,
    image: product.image,
    isActive: product.isActive,
  });
});

export const decrementBulk = asyncHandler(async (req: Request, res: Response) => {
  const { items } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "invalid items array");
  }

  for (const it of items) {
    const product = await Product.findOne({
      _id: it.productId,
      // for nested array ele
      "variants._id": it.variantId,
    });

    if (!product)
      throw new ApiError(404, `Product or variant not found: ${it.productId}`);

    const variant = product.variants.find(
      (v) => v._id.toString() === it.variantId
    );

    if (!variant) throw new ApiError(404, `Variant not found: ${it.variantId}`);

    if (variant.stock < it.qty)
      throw new ApiError(
        400,
        `Stock insufficient for ${variant.label}. Available: ${variant.stock}`
      );
  }

  // all valid -> apply stock updates
  for (const it of items) {
    const product = await Product.findOne({
      _id: it.productId,
      "variants._id": it.variantId,
    });

    if (!product)
      throw new ApiError(404, `Product or variant not found: ${it.productId}`);

    const variant = product.variants.find(
      (v) => v._id.toString() === it.variantId
    );

    if (!variant) throw new ApiError(404, `Variant not found: ${it.variantId}`);

    await Product.updateOne(
      { _id: it.productId, "variants._id": it.variantId },
      {
        $inc: { "variants.$.stock": -it.qty },
        $set: {
          "variants.$.isAvailable": variant.stock - it.qty > 0,
        },
      }
    );
  }
  res.json({ message: "Stock decremented" });
});

export const increaseBulk = asyncHandler(async (req: Request, res: Response) => {
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "Invalid items array");
  }

  for (const it of items) {
    const product = await Product.findOne({
      _id: it.productId,
      "variants._id": it.variantId,
    });

    if (!product) continue;

    const variant = product.variants.find(
      (v) => v._id.toString() === it.variantId
    );

    if (!variant) continue;

    await Product.updateOne(
      { _id: it.productId, "variants._id": it.variantId },
      {
        $inc: { "variants.$.stock": it.qty },
        $set: {
          "variants.$.isAvailable": true,
        },
      }
    );
  }

  return res.json({ success: true, message: "Stock increased" });
});
