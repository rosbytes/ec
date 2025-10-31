import cors from "cors";
import express from "express";
import helmet from "helmet";

import type { RequestOptions, IncomingMessage, ServerResponse } from "http";
import { logger } from "@utils/logger.js";
import { rateLimitMiddleware } from "./config/rateLimiter.js";
import { createProxy } from "./utils/proxy.js";
import { AUTH_SERVICE_URL, PORT, REDIS_URL } from "./config/index.js";

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
      scrReq: express.Request
    ) => {
      const headers = (proxyReqOpts.headers ?? {}) as Record<string, string>;
      headers["Content-Type"] = "application/json";
      if (scrReq.headers.cookie) {
        headers["cookie"] = scrReq.headers.cookie;
      }
      proxyReqOpts.headers = headers;
      return proxyReqOpts;
    },
    userResDecorator: (
      proxyRes: IncomingMessage,
      proxyResData: Buffer,
      userReq: Request,
      userRes: Response
    ) => {
      logger.info(`Response received from auth service:${proxyRes.statusCode}`);
      return proxyResData;
    },
  })
);

app.listen(PORT, () => {
  logger.info(`API gateway running on port:${PORT}`);
  logger.info(AUTH_SERVICE_URL);
  logger.info(`auth service is running on port ${AUTH_SERVICE_URL}`);

  logger.info(`Redis Url ${REDIS_URL}`);
});
