import { z } from "zod"
import { isValidPhoneNumber } from "libphonenumber-js"

/*
 *
 * SignUp Schema
 *
 * */
export const ZSignUpSchema = z.object({
    firstName: z.string().trim().max(100),
    lastName: z.string().trim().max(100).optional(),
    phone: z.string().refine((val) => isValidPhoneNumber(val), {
        message: "Invalid phone number",
    }),
})

export type TSignUpSchema = z.infer<typeof ZSignUpSchema>

export const ZSignUpVerifySchema = z.object({
    phone: z.string().refine((val) => isValidPhoneNumber(val), {
        message: "Invalid phone number",
    }),
    otp: z.string().min(6),
})

export type TSignUpVerifySchema = z.infer<typeof ZSignUpVerifySchema>

/*
 *
 * Login Schema
 *
 * */
export const ZLoginSchema = z.object({
    phone: z.string().refine((val) => isValidPhoneNumber(val), {
        message: "Invalid phone number",
    }),
})

export type TLoginSchema = z.infer<typeof ZLoginSchema>

export const ZLoginVerifySchema = z.object({
    phone: z.string().refine((val) => isValidPhoneNumber(val), {
        message: "Invalid phone number",
    }),
    otp: z.string().min(6),
})

export type TLoginVerifySchema = z.infer<typeof ZLoginVerifySchema>

/*
 *
 * RefreshToken Schema
 *
 * */
export const ZRefreshTokenSchema = z.object({
    refreshToken: z.string().nonempty(),
})

export type TRefreshTokenSchema = z.infer<typeof ZRefreshTokenSchema>
