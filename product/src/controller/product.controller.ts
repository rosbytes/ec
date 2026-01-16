import { Request, Response, NextFunction } from "express";
import { Product } from "../model/product.model";
import slugify from "slugify";
import {
  uploadMediaToCloudinary,
  deleteMediaFromCloudinary,
} from "../utils/cloudinary";
import { asyncHandler } from "../middleware/asyncHandler";
import { ApiError } from "../utils/ApiError";

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new ApiError(400, "No image provided");
  }
  const uploadResult = await uploadMediaToCloudinary(req.file);

  const productData = {
    name: req.body.name,
  localName: req.body.localName,
  category: req.body.category,
  description: req.body.description,
  variants: req.body.variants, 
  tags: req.body.tags,
  isFeatured: req.body.isFeatured ?? false,
  
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
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const existing = await Product.findById(id);

  if (!existing) {
    throw new ApiError(404, "Product not found");
  }

  if (req.body.name) {
    req.body.slug = slugify(req.body.name, { lower: true, strict: true });
  }

  if (req.file) {
  const uploadResult = await uploadMediaToCloudinary(req.file);

  for (const img of existing.image) {
    await deleteMediaFromCloudinary(img.public_id);
  }

  req.body.image = [{
    public_id: uploadResult.public_id,
    url: uploadResult.secure_url,
    mimeType: req.file.mimetype,
  }];
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
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  for (const img of product.image) {
    await deleteMediaFromCloudinary(img.public_id);
  }
  await product.deleteOne();

  res
    .status(200)
    .json({ success: true, message: "Product deleted successfully" });
});

export const getAllProduct = asyncHandler(async (req: Request, res: Response) => {
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
});

export const getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const product = await Product.findOne({ slug });
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  res.status(200).json({ success: true, data: product });
});




