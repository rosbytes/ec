import express from "express"
import {
  sendOtpController,
  verifyOtpController,
  refreshTokenController,
  logoutController,
} from "../controller/auth-controller"
import { validate } from "../middleware/validate"
import {
  sendOtpSchema,
  verifyOtpSchema,
  refreshTokenSchema,
  logoutSchema,
} from "../validator/auth-validator"
import {
 
  verifyRefreshToken,
} from "@/middleware/authMiddleware"
// import { verifyRefreshToken } from "@utils/jwt"
import { defaultLimiter, otpLimiter } from "@/middleware/rateLimiter"

const router = express.Router()

router.post("/send-otp", otpLimiter, validate(sendOtpSchema), sendOtpController)
router.post(
  "/verify-otp",
  otpLimiter,
  validate(verifyOtpSchema),
  verifyOtpController,
)

router.post(
  "/refresh-token",
  defaultLimiter,
  validate(refreshTokenSchema),
  verifyRefreshToken,
  refreshTokenController,
)

router.post(
  "/logout",
  defaultLimiter,
  validate(logoutSchema),
  logoutController,
)

export default router
