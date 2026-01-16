import express, { Router } from "express";
import {
  addToCart,
  decrementCartItem,
  removeCartItem,
  clearCart,
  getCart,
} from "../controller/cart.controller.js";
import { addToCartLimiter } from "../middleware/rateLimiter.js";

import {
  AddToCartSchema,
  DecrementCartSchema,
} from "../validations/cart.schema.js";

import { validate } from "../middleware/validate.js";
import { requireGateway } from "../middleware/requireGateway.js";

const router: Router = express.Router();

// Apply gateway validation to ALL routes
router.use(requireGateway);

router.get("/", getCart);

router.post("/increment", addToCartLimiter, validate(AddToCartSchema), addToCart); //pvt

router.post("/decrement", addToCartLimiter, validate(DecrementCartSchema), decrementCartItem);

router.delete("/item/:itemId", removeCartItem);

router.delete("/", clearCart);

export default router;

