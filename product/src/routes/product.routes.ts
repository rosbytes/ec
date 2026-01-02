import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getProductBySlug,
  
 
  
  updateProduct,
} from "../controller/product.controller";
import { validate } from "../middleware/validate";
import {
  CreateProductSchema,
  ProductSchema,
} from "../validations/product.validations";
import { verifyAdmin } from "../middleware/authMiddleware";
import { createMulterUpload } from "../config/multer.config";
import { getProductDetails } from "../controller/internal.controller";

const router = express.Router();

const upload = createMulterUpload(10);


router.get("/internal/:productId/:variantId",getProductDetails)
// admin
router.post(
  "/",
  verifyAdmin,
  upload.single("image"),
  validate(CreateProductSchema),
  createProduct
);
router.put(
  "/:id",
  verifyAdmin,
  upload.single("image"),
  validate(ProductSchema),
  updateProduct
);
router.delete("/:id", verifyAdmin, deleteProduct);

//user
router.get("/", getAllProduct);
router.get("/:slug", getProductBySlug);

export default router;
