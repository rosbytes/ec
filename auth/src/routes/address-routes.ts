import { Router } from "express"
import { prisma } from "../utils/prisma"
import {
  getAddress,
  postAddress,
  deleteAddress,
} from "@/controller/address-controller"
import { verifyAccessToken } from "@/middleware/authMiddleware"
import { validate } from "@/middleware/validate"
import {
  createAddressSchema,
  deleteAddressSchema,
} from "@/validator/address-validator"
import { defaultLimiter } from "@/middleware/rateLimiter"
const addressRoutes = Router()

addressRoutes.get("/", defaultLimiter, verifyAccessToken, getAddress)

addressRoutes.post(
  "/",
  defaultLimiter,
  verifyAccessToken,
  validate(createAddressSchema),
  postAddress,
)

addressRoutes.delete(
  "/:id",
  defaultLimiter,
  verifyAccessToken,
  validate(deleteAddressSchema),
  deleteAddress,
)

export default addressRoutes
