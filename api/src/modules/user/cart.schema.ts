import { z } from "zod"

export const ZCartItemSchema = z.object({
    productId: z.uuid(),
    variantId: z.uuid(),
    // TODO: apply validation that max quantity should always be less than vendor's available stock
    quantity: z
        .number()
        .int()
        .min(1)
        .max(99)
        .refine((quantity) => quantity <= 99, {
            message: "Quantity must be less than or equal to 99",
        }),
    vendorId: z.uuid(),
})

export const ZAddToCartSchema = z
    .array(ZCartItemSchema.omit({ quantity: true }))
    .min(1, "At least 1 item is required")
    .refine(
        (items) => {
            const vendorIds = new Set(items.map((item) => item.vendorId))
            return vendorIds.size === 1
        },
        {
            message: "All items must belong to the same vendor",
        },
    )
    .max(1, "Maximum 1 item can be added to cart in one go")

export const ZRemoveFromCartSchema = z
    .array(ZCartItemSchema.omit({ quantity: true }))
    .min(1, "At least 1 item is required")
    .refine(
        (items) => {
            const vendorIds = new Set(items.map((item) => item.vendorId))
            return vendorIds.size === 1
        },
        {
            message: "All items must belong to the same vendor",
        },
    )
    .max(1, "Maximum 1 item can be removed from cart in one go")

export const ZDeleteFromCartSchema = z.object({
    vendorId: z.uuid(),
    productId: z.uuid(),
    variantId: z.uuid(),
})

export type TCartItem = z.infer<typeof ZCartItemSchema>
// add item to cart with quantity 1
export type TAddToCartSchema = z.infer<typeof ZAddToCartSchema>
// decrease item quantity in cart by 1
export type TRemoveFromCartSchema = z.infer<typeof ZRemoveFromCartSchema>
// remove item from cart
export type TDeleteFromCartSchema = z.infer<typeof ZDeleteFromCartSchema>
