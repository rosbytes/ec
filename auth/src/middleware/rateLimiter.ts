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
      logger.warn({
        message: "Rate limit exceeded",

        path: req.path,
        ip: req.ip,
      })

      res.status(429).json({ success: false, message: "Too many requests" })
    }
  }
}

export const otpLimiter = limiterMiddleware(sensitiveLimiter, (req) => {
  let phone = req.body?.phone
  if (!phone) return req.ip
  if (!phone.startsWith("+")) phone = "+91" + phone
  return phone
})

export const defaultLimiter = limiterMiddleware(flexibleLimiter)

export const userLimiter = limiterMiddleware(
  flexibleLimiter,
  (req) => req.refreshAuth?.userId || req.ip,
)
