import { z } from "zod"

export const ZCreateProductVariantImageSchema = z.object({
    url: z.string().url(),
    isPrimary: z.boolean().default(false),
})

export const ZCreateProductVariantSchema = z.object({
    label: z.string().min(1).max(100), // e.g., "500g", "1L"
    quantityValue: z.number().positive(),
    quantityUnit: z.enum([
        "mg",
        "g",
        "kg",
        "ml",
        "l",
        "pc",
        "pack",
        "box",
        "dozen",
        "pair",
        "bag",
        "bundle",
        "bottle",
        "can",
        "jar",
        "carton",
        "tub",
        "pouch",
        "sachet",
        "m",
        "sq_m",
        "tablet",
    ]),
    sku: z.string().min(1).max(100).optional(),
    images: z
        .array(ZCreateProductVariantImageSchema)
        .min(1, "At least one image is required for a variant"),
})

export const ZCreateProductSchema = z.object({
    name: z.string().min(1).max(255),
    brand: z.string().min(1).max(255),
    categoryId: z.uuid(),
    variants: z
        .array(ZCreateProductVariantSchema)
        .min(1, "At least one variant is required for a product"),
})

export type TCreateProductSchema = z.infer<typeof ZCreateProductSchema>
export type TCreateProductVariantSchema = z.infer<typeof ZCreateProductVariantSchema>
export type TCreateProductVariantImageSchema = z.infer<typeof ZCreateProductVariantImageSchema>
