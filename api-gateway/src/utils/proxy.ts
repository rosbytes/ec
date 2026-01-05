// utils/proxy.ts
import proxy from "express-http-proxy";
import type { RequestHandler } from "express";
import { logger } from "./logger.js";

export function createProxy(
  serviceUrl: string,
  options: { parseReqBody?: boolean } = {}
): RequestHandler {
  return proxy(serviceUrl, {
    proxyReqPathResolver: (req) => req.originalUrl.replace(/^\/v1/, "/api"),

    parseReqBody: options.parseReqBody ?? true,

    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      const headers = proxyReqOpts.headers || {};

      // Preserve original content-type
      if (srcReq.headers["content-type"]) {
        headers["content-type"] = srcReq.headers["content-type"];
      }
      if (srcReq.headers.cookie) {
        headers["cookie"] = srcReq.headers.cookie;
      }

      // Forward identity injected by gateway ONLY
      if (srcReq.headers["x-user-id"])
        headers["x-user-id"] = srcReq.headers["x-user-id"];

      if (srcReq.headers["x-user-role"])
        headers["x-user-role"] = srcReq.headers["x-user-role"];

      proxyReqOpts.headers = headers;
      return proxyReqOpts;
    },

    proxyErrorHandler: (err, res) => {
      logger.error(err);
      res.status(502).json({ message: "Service unavailable" });
    },
  });
}
