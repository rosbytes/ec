import { prisma } from "../utils/prisma"
import { redisClient } from "../utils/redisClient"
import { sendOtp } from "../utils/twilio"
import { generateTokens } from "../utils/jwt"
import logger from "@configs/logger.config"
import { Request, Response } from "express"
import generateOtp from "@utils/generateOtp"
import { ApiError } from "../utils/ApiError"
import { asyncHandler } from "../middleware/asyncHandler"

export const sendOtpController = asyncHandler(
  async (req: Request, res: Response) => {
    let { phone } = req.body
    if (!phone) {
      throw new ApiError(400, "phone required")
    }
    if (!phone.startsWith("+")) {
      phone = "+91" + phone
    }

    let user = await prisma.user.findUnique({
      where: { phone },
    })
    if (!user) {
      user = await prisma.user.create({
        data: { phone },
      })
    }

    const otp = generateOtp()
    console.log("1:")
    await redisClient.set(`otp:${phone}`, otp, "EX", 180)
    console.log("2:")
    await sendOtp(phone, otp)
    console.log("3:")

    return res.json({ success: true, message: "OTP sent successfully" })
  },
)

export const verifyOtpController = asyncHandler(
  async (req: Request, res: Response) => {
    const { phone, otp } = req.body

    if (!phone || !otp) {
      throw new ApiError(400, "Phone and OTP required")
    }

    const storedOtp = await redisClient.get(`otp:${phone}`)
    if (!storedOtp) {
      throw new ApiError(400, "OTP expired or not found")
    }

    if (storedOtp != String(otp)) {
      throw new ApiError(400, "Invalid OTP")
    }

    const user = await prisma.user.findUnique({
      where: { phone },
    })
    if (!user) {
      throw new ApiError(404, "user not found")
    }

    const { refreshToken, accessToken } = generateTokens(user.id, user.role)
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: refreshToken },
    })

    await redisClient.del(`otp:${phone}`)

    res.cookie("refreshToken", refreshToken, {
      sameSite: "strict",
      httpOnly: true,
      // secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    return res.header({ Authorization: `Bearer ${accessToken}` }).json({
      success: true,
      accessToken,

      message: "OTP verified",
      user: { id: user.id, phone: user.phone },
    })
  },
)

export const refreshTokenController = asyncHandler(
  async (req: Request, res: Response) => {
    // console.log("1st log")
    // const userId = req.headers["x-user-id"] as string | undefined
    // const role = req.headers["x-user-role"] as "USER" | "ADMIN" | undefined

    const { userId, role } = req.refreshAuth!
    if (!userId) {
      throw new ApiError(401, "Unauthorized: No user")
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new ApiError(404, "User not found")
    }
    // console.log("1st")

    const oldToken = req.cookies?.refreshToken
    // console.log(oldToken)
    if (!oldToken) {
      throw new ApiError(401, "Missing refresh token")
    }

    if (user.refreshToken !== oldToken) {
      await prisma.user.update({
        where: { id: userId },
        data: { refreshToken: null },
      })
      throw new ApiError(403, "Token reuse detected")
    }
    const userRole = role
    const { refreshToken, accessToken } = generateTokens(userId, userRole)

    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: refreshToken },
    })

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    })

    return res.json({
      success: true,
      message: "Access token refreshed",
      accessToken,
    })
  },
)

export const logoutController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId
    logger.info(`User ${userId} - logoutController called`)

    if (!userId) {
      logger.warn("logout called without userId")
      throw new ApiError(400, "userId required")
    }
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    })
    res.clearCookie("refreshToken")
    logger.info(`user logged out`)
    return res.json({ success: true, message: "Logged out successfully" })
  },
)
