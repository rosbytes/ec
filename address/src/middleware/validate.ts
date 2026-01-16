import type { Request, Response, NextFunction } from "express";
import z from "zod";

export const validate =
  (schema: { parse: (input: any) => any }) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      req.body = parsed.body;
      req.params = parsed.params;
      req.query = parsed.query;

      next();
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: err.errors,
      });
    }
  };

// GET ADDRESS SCHEMA
export const GetAddressSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid address ID"),
  }),
});

// SET DEFAULT ADDRESS SCHEMA
export const SetDefaultAddressSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid address ID"),
  }),
});

// DELETE ADDRESS SCHEMA
export const DeleteAddressSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid address ID"),
  }),
});

// CHECK SERVICEABILITY SCHEMA
export const CheckServiceabilitySchema = z.object({
  body: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
});


