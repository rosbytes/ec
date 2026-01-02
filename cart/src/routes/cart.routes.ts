import express, { Router } from "express";
import {
  addToCart,
  decrementCartItem,
  removeCartItem,
  clearCart,
  getCart,
} from "../controller/cart.controller.js";

import {
  AddToCartSchema,
  DecrementCartSchema,
} from "../validations/cart.schema.js";

import { validate } from "../middleware/validate.js";

const router: Router = express.Router();

router.get("/", getCart);

router.post("/increment", validate(AddToCartSchema), addToCart);

router.post("/decrement", validate(DecrementCartSchema), decrementCartItem);

router.delete("/item/:itemId", removeCartItem);

router.delete("/", clearCart);

export default router;
