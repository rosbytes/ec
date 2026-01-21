import { z } from "zod"

export const updateProfileSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name too long")
        .optional(),

      phone: z
        .string()
        .regex(/^[6-9]\d{9}$/, "Invalid Indian phone number")
        .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be updated",
    }),
})
