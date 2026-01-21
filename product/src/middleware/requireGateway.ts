import { Request, Response, NextFunction } from "express";
import logger from "../config/logger.config";

declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; role?: string };
    }
  }
}

export const requireGateway = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const gatewayToken = req.headers["x-internal-token"];

  if (gatewayToken !== process.env.INTERNAL_GATEWAY_SECRET) {
    logger.warn(`Unauthorized access attempt to ${req.path}`);
    return res.status(403).json({
      success: false,
      message: "Forbidden: Direct access not allowed",
    });
  }

  // Extract user context injected by gateway
  const userId = req.headers["x-user-id"] as string;
  const userRole = req.headers["x-user-role"] as string;

  if (userId) {
    req.user = { userId, role: userRole };
  }

  next();
};
