import { z } from "zod"

export const sendOtpSchema = z.object({
  body: z.object({
    phone: z
      .string()
      .trim()
      .regex(/^\d{10}$/, "Phone must be 10 digits (without +91)"),
      
  }),
})

export const verifyOtpSchema = z.object({
  body: z.object({
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number too long"),
    otp: z
      .string()
      .length(6, "OTP must be 6 digits")
      .regex(/^\d+$/, "OTP must be numeric"),
  }),
})

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().optional(),
  }),
  cookies: z.object({
    refreshToken: z.string().optional(),
  }).optional(),
})

export const logoutSchema = z.object({
  body: z.object({
    userId: z.string().min(1, "User ID is required").optional()
  }),
})
