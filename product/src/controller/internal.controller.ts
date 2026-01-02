import { Request, Response, NextFunction } from "express";
import { Product } from "../model/product.model";
import logger from "../config/logger.config";

export const getProductDetails = async (req: Request, res: Response) => {
  try {
    const { productId, variantId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const variant = product.variants.find(
      (v) => v._id.toString() === variantId
    );

    if (!variant) {
      return res.status(404).json({ message: "Variant not found" });
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
  } catch (err: any) {
    logger.error(`getProductDetails | controller | ${err.message}`);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const decrementBulk = async (req: Request, res: Response) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0)
      return res.status(400).json({ message: "invalid items array" });

    for (const it of items) {
      const product = await Product.findOne({
        _id: it.productId,
        // for nested array ele
        "variants._id": it.variantId,
      });

      if (!product)
        throw new Error(`Product or variant not found: ${it.productId}`);

      const variant = product.variants.find(
        (v) => v._id.toString() === it.variantId
      );

      if (!variant) throw new Error(`Variant not found: ${it.variantId}`);

      if (variant.stock < it.qty)
        throw new Error(
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
        throw new Error(`Product or variant not found: ${it.productId}`);

      const variant = product.variants.find(
        (v) => v._id.toString() === it.variantId
      );

      if (!variant) throw new Error(`Variant not found: ${it.variantId}`);

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
  } catch (err: any) {
    console.error("decrementBulk:", err);
    return res.status(400).json({ message: err.message });
  }
};

export const increaseBulk = async (req: Request, res: Response) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0)
      return res.status(400).json({ message: "Invalid items array" });

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
  } catch (err: any) {
    console.error("increaseBulk:", err);
    return res.status(500).json({ message: err.message });
  }
};