import { Router } from "express";
import express from "express";
import { internalClearCart, internalGetCart } from "../controller/internal.controller.js";
import { internalAuth } from "../middleware/internalAuth.js";

const router: Router = express.Router();

// Protect internal routes - only callable by other services
router.use(internalAuth);

router.get("/cart", internalGetCart);
router.post("/clear", internalClearCart);

export default router;

