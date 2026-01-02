import { Router } from "express";
import {
  getProfileController,
  updateProfileController,
} from "../controller/profile-controller";
import { verifyAccessToken } from "@/middleware/authMiddleware";
import { validate } from "../middleware/validate";
import { updateProfileSchema } from "../validator/profile-validator";
import { defaultLimiter } from "@/middleware/rateLimiter";

const profileRoutes = Router();


profileRoutes.get(
  "/",
  defaultLimiter,
  verifyAccessToken,
  getProfileController
);


profileRoutes.patch(
  "/",
  defaultLimiter,
  verifyAccessToken,
  validate(updateProfileSchema),
  updateProfileController
);

export default profileRoutes;
