// utils/proxy.ts
import proxy from "express-http-proxy";
import type { RequestHandler } from "express";
import { logger } from "./logger.js";

export function createProxy(
  serviceUrl: string,
  options: {
    parseReqBody?: boolean;
    forwardCookies?: boolean;
  } = {}
): RequestHandler {
  return proxy(serviceUrl, {
    proxyReqPathResolver: (req) =>
      req.originalUrl.replace(/^\/v1/, "/api"),

    parseReqBody: options.parseReqBody ?? true,

    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      const headers = proxyReqOpts.headers || {};

      if (srcReq.headers["content-type"]) {
        headers["content-type"] = srcReq.headers["content-type"];
      }

      // 🔐 gateway trust
      headers["x-internal-token"] =
        process.env.INTERNAL_GATEWAY_SECRET!;

      // 👤 user context
      const user = (srcReq as any).user;
      if (user) {
        headers["x-user-id"] = user.userId;
        headers["x-user-role"] = user.role;
      }

      // 🍪 forward cookies ONLY when needed
      if (options.forwardCookies && srcReq.headers.cookie) {
        headers["cookie"] = srcReq.headers.cookie;
      }

      proxyReqOpts.headers = headers;
      return proxyReqOpts;
    },

    proxyErrorHandler: (err, res) => {
      logger.error(err);
      res.status(502).json({ message: "Service unavailable" });
    },
  });
}
