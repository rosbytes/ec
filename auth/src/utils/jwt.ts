import jwt, { Secret } from "jsonwebtoken"

interface JwtPayload {
  userId: string
}
export const generateTokens = (userId: string) => {
  const accessToken = jwt.sign(
    { userId } as JwtPayload,
    process.env.ACCESS_TOKEN_SECRET as Secret,
    {
      expiresIn: "15m",
    },
  )
  const refreshToken = jwt.sign(
    { userId },
    process.env.REFRESH_TOKEN_SECRET as Secret,
    { expiresIn: "7d" },
  )
  return { accessToken, refreshToken }
}

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET! as Secret)
  } catch {
    return null
  }
}
