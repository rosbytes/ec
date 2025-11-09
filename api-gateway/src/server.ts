import cors from "cors";
import express from "express";
import helmet from "helmet";

import type { RequestOptions, IncomingMessage, ServerResponse } from "http";
import { logger } from "@utils/logger.js";
import { rateLimitMiddleware } from "./config/rateLimiter.js";
import { createProxy } from "./utils/proxy.js";
import {
  AUTH_SERVICE_URL,
  PORT,
  REDIS_URL,
  PRODUCT_SERVICE_URL,
} from "./config/index.js";
import { verifyToken } from "./middleware/verifyToken.js";

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(rateLimitMiddleware);

app.use((req, res, next) => {
  logger.info(`received ${req.method} request to ${req.url}`);
  logger.info(`Request body, ${JSON.stringify(req.body)}`);
  next();
});

app.use(
  "/v1/auth",
  createProxy(AUTH_SERVICE_URL, {
    proxyReqOptDecorator: (
      proxyReqOpts: RequestOptions,
      srcReq: express.Request
    ) => {
      const headers = (proxyReqOpts.headers ?? {}) as Record<string, string>;
      headers["Content-Type"] = "application/json";
      if (srcReq.headers.cookie) {
        headers["cookie"] = srcReq.headers.cookie;
      }
      if (srcReq.headers["x-user-id"])
        headers["x-user-id"] = srcReq.headers["x-user-id"] as string;
      if (srcReq.headers["x-user-role"])
        headers["x-user-role"] = srcReq.headers["x-user-role"] as string;
      proxyReqOpts.headers = headers;
      return proxyReqOpts;
    },
    userResDecorator: (proxyRes: IncomingMessage, proxyResData: Buffer) => {
      logger.info(`Response received from auth service:${proxyRes.statusCode}`);
      return proxyResData;
    },
  })
);

app.use(
  "/v1/products",
  verifyToken,
  createProxy(PRODUCT_SERVICE_URL, {
    proxyReqOptDecorator: (
      proxyReqOpts: RequestOptions,
      srcReq: express.Request
    ) => {
      const headers = (proxyReqOpts.headers ?? {}) as Record<string, string>;
      if (!srcReq.headers["content-type"]?.startsWith("multipart/form-data")) {
        headers["Content-Type"] = "application/json";
      }

      if (srcReq.headers.cookie) {
        headers["cookie"] = srcReq.headers.cookie;
      }
      if (srcReq.headers["x-user-id"])
        headers["x-user-id"] = srcReq.headers["x-user-id"] as string;
      if (srcReq.headers["x-user-role"])
        headers["x-user-role"] = srcReq.headers["x-user-role"] as string;
      proxyReqOpts.headers = headers;
      return proxyReqOpts;
    },
    userResDecorator: (proxyRes: IncomingMessage, proxyResData: Buffer) => {
      logger.info(`Response from Product Service: ${proxyRes.statusCode}`);
      return proxyResData;
    },
    parseReqBody: false,
  })
);

app.listen(PORT, () => {
  logger.info(`API gateway running on port:${PORT}`);
  logger.info(AUTH_SERVICE_URL);
  logger.info(`auth service is running on port ${AUTH_SERVICE_URL}`);
  logger.info(`product service is running on port ${PRODUCT_SERVICE_URL}`);
  logger.info(`Redis Url ${REDIS_URL}`);
});
