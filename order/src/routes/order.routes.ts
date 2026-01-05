import { Router } from "express";
import { createOrder, getOrderById, getOrders, paymentWebhook, payOrder, verifyPayment } from "../controller/order.controller.js";

const orderRoutes= Router()

orderRoutes.post("/", createOrder);

// get all orders for logged-in user
orderRoutes.get("/", getOrders);

// get single order
orderRoutes.get("/:id", getOrderById);

/**
 * Payments
 */

// pay an order (COD or Online)
orderRoutes.post("/:id/pay", payOrder);

// verify razorpay payment (client-side verification)
orderRoutes.post("/payment/verify", verifyPayment);

// razorpay webhook (server-to-server)
// orderRoutes.post("/payment/webhook", paymentWebhook);


export default orderRoutes