import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

interface JwtPayloadCustom {
  userId: string;
  role: "USER" | "ADMIN";
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayloadCustom;
    }
  }
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Missing access token" });
  }
  const token = authHeader.split(" ")[1];

  if (!token || !process.env.ACCESS_TOKEN_SECRET) {
    return res.status(401).json({ message: "Invalid token or missing secret" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    ) as unknown as JwtPayloadCustom;

    // req.headers["x-user-id"] = decoded.userId;
    // req.headers["x-user-role"] = decoded.role;
    // req.headers["x-internal-token"] = process.env.INTERNAL_GATEWAY_SECRET!;

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired access token" });
  }
};
