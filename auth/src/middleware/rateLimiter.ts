import { RateLimiterRedis } from "rate-limiter-flexible"
import { Request, Response, NextFunction } from "express"
import { redisClient } from "../utils/redisClient"
import logger from "../configs/logger.config"

export const sensitiveLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "sensitive",
  points: 5,
  duration: 60,
})

export const flexibleLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "flexible",
  points: 30,
  duration: 60,
})

export const limiterMiddleware = (
  limiter: RateLimiterRedis,
  keyExtractor: (req: any) => string = (req) => req.ip,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("req received in limiter")
      const key = keyExtractor(req)
      await limiter.consume(key)
      next()
    } catch (err) {
      logger?.warn?.(`Rate limit exceeded for key: ${req.ip}`)
      res.status(429).json({ success: false, message: "Too many requests" })
    }
  }
}

export const otpLimiter = limiterMiddleware(
  sensitiveLimiter,
  (req) => req.body?.phone || req.ip,
)

export const defaultLimiter = limiterMiddleware(flexibleLimiter)
