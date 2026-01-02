import { Request, Response, NextFunction } from "express";
import { Product } from "../model/product.model";
import logger from "../config/logger.config";
import slugify from "slugify";
import {
  uploadMediaToCloudinary,
  deleteMediaFromCloudinary,
} from "../utils/cloudinary";



export const createProduct = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image provided",
      });
    }
    const uploadResult = await uploadMediaToCloudinary(req.file);

    const productData = {
      ...req.body,
      slug: slugify(req.body.name, { lower: true, strict: true }),
      image: [
        {
          public_id: uploadResult.public_id,
          url: uploadResult.secure_url,
          mimeType: req.file.mimetype,
        },
      ],
    };

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (err: any) {
    logger.error(`createProduct | controller | ${err.message}`);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await Product.findById(id);

    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (req.body.name) {
      req.body.slug = slugify(req.body.name, { lower: true, strict: true });
    }

    if (req.file) {
      for (const img of existing.image) {
        await deleteMediaFromCloudinary(img.public_id);
      }

      const uploadResult = await uploadMediaToCloudinary(req.file);
      req.body.image = [
        {
          public_id: uploadResult.public_id,
          url: uploadResult.secure_url,
          mimeType: req.file.mimetype,
        },
      ];
    }

    const updated = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updated,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    for (const img of product.image) {
      await deleteMediaFromCloudinary(img.public_id);
    }
    await product.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (err: any) {
    logger.error(`deleteProduct | controller | ${err.message}`);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllProduct = async (req: Request, res: Response) => {
  try {
    const query: any = {};

    if (req.query.category) query.category = req.query.category;
    if (req.query.isFeatured)
      query.isFeatured = req.query.isFeatured === "true";

    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({ success: true, data: product });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
