import proxy from "express-http-proxy";
import type { Request, Response, RequestHandler } from "express";
import { logger } from "./logger.js";

type ProxyOptions = Record<string, any>;


const baseProxyOptions: ProxyOptions = {
  proxyReqPathResolver: (req: Request) =>
    req.originalUrl.replace(/^\/v1/, "/api"),

  proxyErrorHandler: (err: Error, res: Response) => {
    logger.error(`Proxy error: ${err.message}`);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  },
};

export function createProxy(
  serviceUrl: string,
  extraOptions: ProxyOptions = {}
): RequestHandler {
  return proxy(serviceUrl, {
    ...baseProxyOptions,
    ...extraOptions,
  }) as unknown as RequestHandler;
}
