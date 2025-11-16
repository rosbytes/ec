import { z } from "zod";

export const AddToCartSchema = z.object({
  productId: z.string(),
  quantity: z.number().min(1),
  price: z.number().min(1),
});

export const UpdateQuantitySchema = z.object({
  quantity: z.number().min(1)
});