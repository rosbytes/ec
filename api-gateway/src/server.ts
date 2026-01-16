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
  ADDRESS_SERVICE_URL,
} from "./config/index.js";
import { verifyToken } from "./middleware/verifyToken.js";

if (!process.env.ACCESS_TOKEN_SECRET || !process.env.INTERNAL_GATEWAY_SECRET) {
  console.error("CRITICAL: Missing required environment variables (GATEWAY)");
  process.exit(1);
}

const app = express();

/*  GLOBAL MIDDLEWARE  */

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);


app.use((req, _res, next) => {
  delete req.headers["x-user-id"];
  delete req.headers["x-user-role"];
  delete req.headers["x-internal-token"];
  next();
});

app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

app.use(rateLimitMiddleware);

/*  WEBHOOKS (NO JSON PARSE)  */

app.use(
  "/v1/order/payment/webhook",
  createProxy(ORDER_SERVICE_URL, { parseReqBody: false })
);

/*  PRODUCTS (FILE UPLOAD / NO JSON)  */

app.use(
  "/v1/products",
  verifyToken,
  createProxy(PRODUCT_SERVICE_URL, { parseReqBody: false })
);

/*  JSON PARSER  */

app.use(express.json());

/*  AUTH ROUTES  */

//  Public (no JWT, no cookies)
app.use("/v1/auth/send-otp", createProxy(AUTH_SERVICE_URL));
app.use("/v1/auth/verify-otp", createProxy(AUTH_SERVICE_URL));

//  Cookie-based (refresh token)
app.use(
  "/v1/auth/refresh-token",
  createProxy(AUTH_SERVICE_URL, { forwardCookies: true })
);

//  Protected auth
app.use(
  "/v1/auth/logout",
  verifyToken,
  createProxy(AUTH_SERVICE_URL, { forwardCookies: true })
);

/*  USER / DOMAIN ROUTES  */

app.use("/v1/me/profile", verifyToken, createProxy(AUTH_SERVICE_URL));

app.use("/v1/addresses", verifyToken, createProxy(ADDRESS_SERVICE_URL));

app.use("/v1/cart", verifyToken, createProxy(CART_SERVICE_URL));

app.use("/v1/order", verifyToken, createProxy(ORDER_SERVICE_URL));

/*  HEALTH CHECK  */

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    services: {
      auth: AUTH_SERVICE_URL,
      products: PRODUCT_SERVICE_URL,
      cart: CART_SERVICE_URL,
      orders: ORDER_SERVICE_URL,
      addresses: ADDRESS_SERVICE_URL,
    },
  });
});

/*  START SERVER  */

app.listen(PORT, () => {
  logger.info(`API Gateway running on port: ${PORT}`);
});
