import { prisma } from "../utils/prisma"
import { redisClient } from "../utils/redisClient"
import { sendOtp } from "../utils/twilio"
import { generateTokens, verifyRefreshToken } from "../utils/jwt"
import logger from "@configs/logger.config"
import { Request, Response } from "express"
import generateOtp from "@utils/generateOtp"

export const sendOtpController = async (req: Request, res: Response) => {
  try {
    let { phone } = req.body
    if (!phone) {
      return res.status(400).json({
        message: "phone required",
        success: false,
      })
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
  } catch (err) {
    console.error("Error sending OTP:", err)
    return res.status(500).json({ success: false, message: "Server error" })
  }
}

export const verifyOtpController = async (req: Request, res: Response) => {
  try {
    const { phone, otp } = req.body

    if (!phone || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "Phone and OTP required" })
    }

    const storedOtp = await redisClient.get(`otp:${phone}`)
    if (!storedOtp)
      return res
        .status(400)
        .json({ success: false, message: "OTP expired or not found" })

    if (storedOtp != String(otp))
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      })

    const user = await prisma.user.findUnique({
      where: { phone },
    })
    if (!user)
      return res.status(404).json({
        success: false,
        message: "user not found",
      })

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
  } catch (err) {
    console.error("Error verifying OTP:", err)
    return res.status(500).json({ success: false, message: "Server error" })
  }
}

export const refreshTokenController = async (req: Request, res: Response) => {
  try {
    // console.log("1st log")
    // const userId = req.headers["x-user-id"] as string | undefined
    // const role = req.headers["x-user-role"] as "USER" | "ADMIN" | undefined

    const { userId, role } = req.refreshAuth!
    if (!userId)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No user" })

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }
    // console.log("1st")

    const oldToken = req.cookies?.refreshToken
    // console.log(oldToken)
    if (!oldToken)
      return res
        .status(401)
        .json({ success: false, message: "Missing refresh token" })

    if (user.refreshToken !== oldToken) {
      await prisma.user.update({
        where: { id: userId },
        data: { refreshToken: null },
      })
      return res.status(403).json({
        success: false,
        message: "Token reuse detected",
      })
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
  } catch (err) {
    console.error("Error refreshing token:", err)
    return res.status(500).json({ success: false, message: "Server error" })
  }
}

export const logoutController = async (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string
  logger.info(`User ${userId} - logoutController called`)
  try {
    if (!userId) {
      logger.warn("logout called without userId")
      return res
        .status(400)
        .json({ success: false, message: "userId required" })
    }
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    })
    res.clearCookie("refreshToken")
    logger.info(`user logged out`)
    return res.json({ success: true, message: "Logged out successfully" })
  } catch (err) {
    logger.error(`error ${err} logging out`)
    return res.status(500).json({ success: false, message: "Server error" })
  }
}
