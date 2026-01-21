import logger from "../config/logger.config";
import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("received schema");
      schema.parse({
        body: req.body,
      });
      next();
    } catch (error: any) {
      logger.error(`${JSON.stringify(error)}`);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }
  };
