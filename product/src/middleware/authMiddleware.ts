import { Request, Response, NextFunction } from "express";
import logger from "../config/logger.config";

export const verifyAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userRole = req.headers["x-user-role"];

    if (userRole === "ADMIN") {
      return next();
    }
    logger.warn(`Access:denied: non-admin tried to access the admin route`, {
      role: userRole,
      path: req.originalUrl,
      method: req.method,
    });
    return res.status(403).json({ message: "Access denied: Admins only" });
  } catch (err: any) {
    logger.error(`verify-admin | middleware error | ${err.message}`);
    return res.status(500).json({
      message: "Internal server error in admin check",
    });
  }
};
