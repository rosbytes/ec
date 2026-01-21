import { Router } from "express";
import {
  getProductDetails,
  decrementBulk,
  increaseBulk,
} from "../controller/internal.controller";
import { internalAuth } from "../middleware/internalAuth";

const internal = Router();

/**
 * INTERNAL APIs (service-to-service)
 * Protected by internalAuth
 */

// get product + variant details
internal.get(
  "/products/:productId/variants/:variantId",
  internalAuth,
  getProductDetails
);

// decrement stock in bulk (order placed)
internal.post(
  "/decrement-stock",
  internalAuth,
  decrementBulk
);

// increase stock in bulk (order cancelled / failed)
internal.post(
  "/increment-stock",
  internalAuth,
  increaseBulk
);

export default internal;
