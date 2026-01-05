// server.ts
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { logger } from "@utils/logger.js";
import { rateLimitMiddleware } from "./config/rateLimiter.js";
import { createProxy } from "./utils/proxy.js";
import {
  AUTH_SERVICE_URL,
  PORT,
  PRODUCT_SERVICE_URL,
  CART_SERVICE_URL,
  ORDER_SERVICE_URL,
} from "./config/index.js";
import { verifyToken } from "./middleware/verifyToken.js";

const app = express();

app.use(helmet());
app.use(cors());
// app.use(cors({
//   origin: process.env.FRONTEND_URL || "http://localhost:5173",
//   credentials: true,
// }));

// Product routes (NO JSON parsing)
app.use(
  "/v1/products",
  verifyToken,
  createProxy(PRODUCT_SERVICE_URL, { parseReqBody: false })
);

app.use(
  "/v1/admin/products",
  verifyToken, // 👈 token required here,
  (req,_res,next)=>{
    req.url = req.url.replace("/admin","")
    next()
  },
  createProxy(PRODUCT_SERVICE_URL, { parseReqBody: false })
);

app.use(express.json());
app.use(rateLimitMiddleware);

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// ========================================
// 🔓 PUBLIC ROUTES (no authentication)
// ========================================

// Auth public routes
app.use("/v1/auth/send-otp", createProxy(AUTH_SERVICE_URL));
app.use("/v1/auth/verify-otp", createProxy(AUTH_SERVICE_URL));
app.use("/v1/auth/refresh-token", createProxy(AUTH_SERVICE_URL));

// Auth protected routes
app.use("/v1/auth/logout", verifyToken, createProxy(AUTH_SERVICE_URL));

// User profile & addresses
app.use("/v1/me/profile", verifyToken, createProxy(AUTH_SERVICE_URL));
app.use("/v1/me/addresses", verifyToken, createProxy(AUTH_SERVICE_URL));
app.use("/v1/me/addresses/:id", verifyToken, createProxy(AUTH_SERVICE_URL));

// Cart routes (all protected)
app.use("/v1/cart", verifyToken, createProxy(CART_SERVICE_URL));
app.use("/v1/cart/increment", verifyToken, createProxy(CART_SERVICE_URL));
app.use("/v1/cart/decrement", verifyToken, createProxy(CART_SERVICE_URL));
app.use("/v1/cart/item/:itemId", verifyToken, createProxy(CART_SERVICE_URL));
// app.use("/v1/cart", verifyToken, createProxy(CART_SERVICE_URL));

// Order routes (all protected)
app.use("/v1/order", verifyToken, createProxy(ORDER_SERVICE_URL));
app.use("/v1/order/:id", verifyToken, createProxy(ORDER_SERVICE_URL));
app.use("/v1/order/:id/pay", verifyToken, createProxy(ORDER_SERVICE_URL));
app.use(
  "/v1/order/payment/verify",
  verifyToken,
  createProxy(ORDER_SERVICE_URL)
);
app.use(
  "/v1/order/payment/webhook",
  createProxy(ORDER_SERVICE_URL, { parseReqBody: false })
);

// ========================================
// HEALTH CHECK
// ========================================
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ========================================
// START SERVER
// ========================================
app.listen(PORT, () => {
  logger.info(`✅ API Gateway running on port: ${PORT}`);
  logger.info(`📡 Auth Service: ${AUTH_SERVICE_URL}`);
  logger.info(`📦 Product Service: ${PRODUCT_SERVICE_URL}`);
  logger.info(`🛒 Cart Service: ${CART_SERVICE_URL}`);
  logger.info(`📋 Order Service: ${ORDER_SERVICE_URL}`);
});
