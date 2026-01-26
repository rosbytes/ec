import { z } from "zod"
import { isValidPhoneNumber } from "libphonenumber-js"

// location schema
export const ZLocationSchema = z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
})

// create userAddress schema
export const ZCreateAddressSchema = z.object({
    label: z.string().trim().min(1).max(100),
    phone: z.string().refine((val) => isValidPhoneNumber(val), {
        message: "Invalid phone number",
    }),
    address: z.string().trim().min(5).max(500),
    location: ZLocationSchema,
})

// delete userAddress schema
export const ZDeleteAddressSchema = z.object({
    id: z.uuid(),
})

// update userAddress schema
export const ZUpdateAddressSchema = z.object({
    id: z.uuid(),
    label: z.string().trim().min(1).max(100),
    phone: z.string().refine((val) => isValidPhoneNumber(val), {
        message: "Invalid phone number",
    }),
    address: z.string().trim().min(5).max(500),
    location: ZLocationSchema,
})

// export types
export type TCreateAddressSchema = z.infer<typeof ZCreateAddressSchema>
export type TDeleteAddressSchema = z.infer<typeof ZDeleteAddressSchema>
export type TUpdateAddressSchema = z.infer<typeof ZUpdateAddressSchema>
export type TLocationSchema = z.infer<typeof ZLocationSchema>
