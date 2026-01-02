import logger from "@configs/logger.config"
import { Request, Response, NextFunction } from "express"
import { ZodSchema, ZodTypeAny } from "zod"
import { extend } from "zod/v4/core/util.cjs"

export const validate =
  <T extends ZodTypeAny>(schema: T) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("received schema")
      const parsed = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      }) as any
      if (parsed.body) req.body = parsed.body
      if (parsed.params) req.params = parsed.params
      if (parsed.query) req.query = parsed.query
      next()
    } catch (error: any) {
      logger.error(`${JSON.stringify(error)}`)
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      })
    }
  }
