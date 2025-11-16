import express, { Router } from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
 
} from "../controller/cart.controller.js";


const router: Router = express.Router();


// user routes
router.post("/",  addToCart);
router.get("/",getCart);
router.patch("/:itemId", updateCartItem);
router.delete("/:itemId",  removeCartItem);
router.delete("/",  clearCart);

export default router;
