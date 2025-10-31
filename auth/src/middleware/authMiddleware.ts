import jwt, { JwtPayload } from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"
import "express"

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string
      }
    }
  }
}

export const verifyAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let headers = req.headers
    // console.log(JSON.stringify(headers))
    const token = headers.authorization?.split(" ")[1]
    if (!token)
      return res.status(402).json({
        message: "access token missing",
      })
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!,
    ) as JwtPayload

    req.user = { userId: decoded.userId }
    next()
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired access token" })
  }
}

export const verifyRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.refreshToken || req.body.refreshToken
    console.log("cookies received",req.cookies.refreshToken)
    if (!token)
      return res.status(401).json({
        success: false,
        message: "Missing refresh token",
      })

    const decoded = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET!,
    ) as JwtPayload
    
    if (!decoded || typeof decoded === "string" || !decoded.userId) {
      return res.status(403).json({
        success: false,
        message: "Invalid token payload",
      })
    }
    req.user = { userId: decoded.userId }
    next()
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired refresh token" })
  }
}
