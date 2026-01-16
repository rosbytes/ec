import { Router } from "express";
import {
    createOrder,
    getOrderById,
    getOrders,
    payOrder,
    paymentWebhook,
    verifyPayment,
} from "../controller/order.controller.js";
import { createOrderLimiter, paymentLimiter } from "../middleware/rateLimiter.js";
import { requireGateway } from "../middleware/requireGateway.js";
import { validate } from "../middleware/validate.js";
import {
    CreateOrderSchema,
    PayOrderSchema,
    VerifyPaymentSchema,
} from "../validations/order.schema.js";

const orderRoutes = Router();

// Apply gateway validation to ALL routes
orderRoutes.use(requireGateway);

// create order
orderRoutes.post("/", createOrderLimiter, validate(CreateOrderSchema), createOrder);

// get all orders for logged-in user
orderRoutes.get("/", getOrders);

// get single order
orderRoutes.get("/:id", getOrderById);

/**
 * Payments
 */

// pay an order (COD or Online)
orderRoutes.post("/:id/pay", paymentLimiter, validate(PayOrderSchema), payOrder);

// verify razorpay payment (client-side verification)
orderRoutes.post("/payment/verify", paymentLimiter, validate(VerifyPaymentSchema), verifyPayment);

export default orderRoutes;