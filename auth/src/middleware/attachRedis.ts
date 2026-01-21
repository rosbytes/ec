import { redisClient } from "../utils/redisClient"
import { Request, Response, NextFunction } from 'express'

declare global {
  namespace Express {
    interface Request {
      redisClient: typeof redisClient
    }
  }
}

export const attachRedis = (req: Request, res: Response, next: NextFunction) => {
  req.redisClient = redisClient
  next()
}
