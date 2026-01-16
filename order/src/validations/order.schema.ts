import { z } from "zod";

export const CreateOrderSchema = z.object({
    body: z.object({
        shippingAddress: z.object({
            addressId: z.string().optional(),
            street: z.string().min(1, "Street is required"),
            city: z.string().min(1, "City is required"),
            state: z.string().min(1, "State is required"),
            pincode: z.string().min(6, "Invalid pincode").max(6, "Invalid pincode"),
            country: z.string().min(1, "Country is required"),
            mobile: z.string().min(10, "Invalid mobile number"),
        }),
    }),
});

export const PayOrderSchema = z.object({
    params: z.object({
        id: z.string().min(1, "Order ID is required"),
    }),
    body: z.object({
        paymentMode: z.enum(["COD", "ONLINE"]),
    }),
});

export const VerifyPaymentSchema = z.object({
    body: z.object({
        razorpay_order_id: z.string().min(1),
        razorpay_payment_id: z.string().min(1),
        razorpay_signature: z.string().min(1),
    }),
});
