import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import Redis from "ioredis";
import { logger } from "../utils/logger.js"; 
import { REDIS_URL } from "../config/index.js"; 
import type { Request, Response } from "express";

const redisClient = new Redis(REDIS_URL);

export const rateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req: Request, res: Response) => {
    logger.warn(`Sensitive endpoint rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({ success: false, message: "Too many requests" });
  },

  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.call(...args),
  }),
});
