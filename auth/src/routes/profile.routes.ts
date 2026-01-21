import { Router } from "express"
import {
  getProfileController,
  updateProfileController,
} from "../controller/profile-controller"

import { validate } from "../middleware/validate"
import { updateProfileSchema } from "../validator/profile-validator"
import { defaultLimiter } from "@/middleware/rateLimiter"
import { requireGateway } from "@/middleware/requireGateway"

const profileRoutes = Router()

profileRoutes.get(
  "/",
  requireGateway,
  defaultLimiter,
  getProfileController,
)

profileRoutes.patch(
  "/",
  requireGateway,
  defaultLimiter,
  validate(updateProfileSchema),
  updateProfileController,
)

export default profileRoutes
