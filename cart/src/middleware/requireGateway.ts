import type { Request, Response, NextFunction } from "express";
import logger from "../config/logger.config.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role?: string;
      };
    }
  }
}

export const requireGateway = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const gatewayToken = req.headers["x-internal-token"];

  // 🔐 Trust check
  if (
    !gatewayToken ||
    typeof gatewayToken !== "string" ||
    gatewayToken !== process.env.INTERNAL_GATEWAY_SECRET
  ) {
    logger.warn(`Blocked direct access: ${req.method} ${req.path}`);
    return res.status(403).json({
      success: false,
      message: "Forbidden: Direct access not allowed",
    });
  }

  // 👤 User context (must exist for protected routes)
  const userId = req.headers["x-user-id"];
  const userRole = req.headers["x-user-role"];

  if (!userId || typeof userId !== "string") {
    logger.warn(`Missing user context: ${req.method} ${req.path}`);
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Missing user context",
    });
  }

  req.user = {
    userId,
    role: typeof userRole ,
  };

  next();
};
