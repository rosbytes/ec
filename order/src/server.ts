import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import orderRoutes from "./routes/order.routes.js";
import { paymentWebhook } from "./controller/order.controller.js";
import { errorHandler } from "./middleware/errorHandler.js";
import logger from "./config/logger.config.js";

dotenv.config();

if (!process.env.INTERNAL_SERVICE_KEY || !process.env.PRODUCT_SERVICE_URL || !process.env.RAZORPAY_KEY_SECRET) {
  console.error("CRITICAL: Missing required environment variables (ORDER_SERVICE)");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3004;

import rateLimit from "express-rate-limit";

// Middleware
app.use(helmet());
app.use(cors());

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many request from this IP,please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// Webhook (Specific Route before global body parsers)
app.post(
  "/api/order/payment/webhook",
  express.raw({ type: "application/json" }),
  paymentWebhook
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "order-service",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/order", orderRoutes);

// Global Error Handler
app.use(errorHandler);

// Start Server
const startServer = async () => {
  try {
    app.listen(PORT, () => {
      logger.info(`✅ Order Service running on port: ${PORT}`);
    });
  } catch (err) {
    logger.error("Failed to start server", err);
    process.exit(1);
  }
};

startServer();
