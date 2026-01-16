import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError.js";
import logger from "../config/logger.config.js";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Always log full error
  logger.error(err);

  // Application-level errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Invalid request data",
      errors: err.issues.map(issue => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  // Fallback for everything else
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
