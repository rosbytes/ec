import { z } from "zod";

export const AddToCartSchema = z.object({
  body: z.object({
    productId: z.string().min(1),
    variantId: z.string().min(1),
  }),
});

export const DecrementCartSchema = z.object({
  body: z.object({
    itemId: z.string().min(1),
  }),
});
