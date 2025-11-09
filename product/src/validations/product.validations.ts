import { z } from "zod";

export const VariantSchema = z.object({
  label: z
    .string()
    .min(1, "Variant label is required")
    .max(50, "Variant label too long"),
  price: z
    .number()
    .nonnegative("Price must be >= 0")
    .max(1000000, "Price too high"),
  stock: z
    .number()
    .nonnegative()
    .max(100000, "Stock cannot exceed 100k")
    .default(0),
  isAvailable: z.boolean().default(true),
});

export const ImageSchema = z.object({
  public_id: z
    .string()
    .min(1, "Cloudinary public_id required")
    .max(200, "Public ID too long"),
  url: z.string().url("Image must be valid URL").max(500, "URL too long"),
  mimeType: z.string().max(100, "MIME type too long").optional(),
});

export const CreateProductSchema = z.object({
  name: z
    .string()
    .min(1, "Product name required")
    .max(100, "Product name too long"),
  localName: z.string().max(100, "Local name too long").optional(),
  category: z
    .string()
    .min(1, "Category required")
    .max(50, "Category name too long"),
  description: z.string().max(2000, "Description too long").optional(),
  image: z.array(ImageSchema).optional().default([]),
  variants: z
    .array(VariantSchema)
    .min(1, "At least one variant required")
    .max(50, "Too many variants"),
  tags: z.array(z.string().max(30, "Tag too long")).optional().default([]),
  isActive: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
});

export const ProductSchema = CreateProductSchema.partial();
