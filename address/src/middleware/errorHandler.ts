import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import logger from "../config/logger";
import { ZodError } from "zod";

export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
    // Extended logging
    logger.error(`${req.method} ${req.path} - ${err.message}`);

    // Check if error is instance of ApiError
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            stack: process.env.NODE_ENV === "development" ? err.stack : undefined
        });
    }

    // Handle authentication errors
    if (err.message === "unauthorised") {
        return res.status(401).json({
            success: false,
            message: "Please login to continue",
        });
    }

    // Handle Zod Validation Errors
    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: err.issues.map(e => ({ field: e.path.join('.'), message: e.message }))
        });
    }

    // Handle validation errors from Mongoose
    if (err.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: Object.values(err.errors).map((e: any) => e.message),
        });
    }

    // Handle MongoDB cast errors (invalid ObjectId)
    if (err.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: "Invalid ID format",
        });
    }

    // Handle Mongoose duplicate key
    if (err.code === 11000) {
        return res.status(400).json({
            success: false,
            message: "Duplicate key error",
            field: Object.keys(err.keyValue)
        });
    }

    // Generic error response
    res.status(500).json({
        success: false,
        message: err.message || "Internal server error",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};
