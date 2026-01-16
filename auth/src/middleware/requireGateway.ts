import { Request, Response, NextFunction } from "express"

declare global {
  namespace Express {
    interface Request {
      user?: { userId: string }
    }
  }
}

export const requireGateway = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const gatewayToken = req.headers["x-internal-token"]
  const userId = req.headers["x-user-id"]

  if (gatewayToken !== process.env.INTERNAL_GATEWAY_SECRET) {
    return res.status(403).json({
      success: false,
      message: "Forbidden:invalid gateway",
    })
  }

  if (!userId || typeof userId !== "string") {
    return res.status(401).json({
      success: false,
      message: "Missing user identity",
    })
  }
  req.user = { userId }
  next()
}
