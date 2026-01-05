import { Router } from "express"
import { prisma } from "../utils/prisma"
import {
  getAddress,
  postAddress,
  deleteAddress,
} from "@/controller/address-controller"

import { validate } from "@/middleware/validate"
import {
  createAddressSchema,
  deleteAddressSchema,
} from "@/validator/address-validator"
import { defaultLimiter } from "@/middleware/rateLimiter"
const addressRoutes = Router()


addressRoutes.get("/", defaultLimiter, getAddress)


addressRoutes.post(
  "/",
  defaultLimiter,
  validate(createAddressSchema),
  postAddress,
)


addressRoutes.delete(
  "/:id",
  defaultLimiter,

  validate(deleteAddressSchema),
  deleteAddress,
)

export default addressRoutes
