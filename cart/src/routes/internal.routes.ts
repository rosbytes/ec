import { Router } from "express";
import express from "express";
import { internalClearCart, internalGetCart } from "../controller/internal.controller.js";

const router: Router = express.Router();

router.get("/cart", internalGetCart);
router.post("/clear", internalClearCart);

export default router;
