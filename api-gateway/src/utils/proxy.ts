import proxy from "express-http-proxy";
import type { Request, Response, RequestHandler } from "express";
import { logger } from "./logger.js";
import type { IncomingMessage, RequestOptions } from "http";

// type ProxyOptions = Record<string, any>;
interface ProxyOptions {
  proxyReqPathResolver?: (req: Request) => string;
  proxyErrorHandler?: (err: Error, res: Response) => void;
  proxyReqOptDecorator?: (
    proxyReqOpts: RequestOptions,
    srcReq: Request
  ) => RequestOptions | Promise<RequestOptions>;
  userResDecorator?: (
    proxyRes: IncomingMessage,
    proxyResData: Buffer,
    userReq: Request,
    userRes: Response
  ) => Buffer | string | Promise<Buffer | string>;
  parseReqBody?: boolean;
}

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
