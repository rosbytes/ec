import { Router } from "express"
import {
  getProfileController,
  updateProfileController,
} from "../controller/profile-controller"

import { validate } from "../middleware/validate"
import { updateProfileSchema } from "../validator/profile-validator"
import { defaultLimiter } from "@/middleware/rateLimiter"

const profileRoutes = Router()

profileRoutes.get(
  "/",
  defaultLimiter,
  getProfileController,
)

profileRoutes.patch(
  "/",
  defaultLimiter,
  validate(updateProfileSchema),
  updateProfileController,
)

export default profileRoutes
