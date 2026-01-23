import { z } from "zod"

export const ZSignUpSchema = z.object({
    name: z.string(),
    phone: z.string(),
})

export type TSignUpSchema = z.infer<typeof ZSignUpSchema>

export const ZSignUpVerifySchema = z.object({
    phone: z.string(),
    otp: z.string().min(6),
})

export type TSignUpVerifySchema = z.infer<typeof ZSignUpVerifySchema>
