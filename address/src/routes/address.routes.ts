import { Router, type Router as ExpressRouter } from "express";
import {
  createAddress,
  getAddresses,
  getAddress,
  getDefaultAddress,
  updateAddress,
  setDefaultAddress,
  deleteAddress,
  checkServiceabilityController,
} from "../controller/address.controller";
import { validate } from "../middleware/validate";
import {
  CreateAddressSchema,
  GetAddressSchema,
  UpdateAddressSchema,
  SetDefaultAddressSchema,
  DeleteAddressSchema,
  CheckServiceabilitySchema,
} from "../validations/address.schema";
import { requireGateway } from "../middleware/requireGateway";

const router: ExpressRouter = Router();

// Apply gateway validation to ALL routes
router.use(requireGateway);

//  PUBLIC: CHECK SERVICEABILITY 
router.post(
  "/check-serviceability",
  validate(CheckServiceabilitySchema),
  checkServiceabilityController
);

//  CREATE ADDRESS 
router.post("/", validate(CreateAddressSchema), createAddress);

//  READ OPERATIONS 
router.get("/", getAddresses);
router.get("/default", getDefaultAddress);
router.get("/:id", validate(GetAddressSchema), getAddress);

//  UPDATE OPERATIONS 
router.put("/:id", validate(UpdateAddressSchema), updateAddress);
router.patch(
  "/:id/default",
  validate(SetDefaultAddressSchema),
  setDefaultAddress
);

// DELETE OPERATION 
router.delete("/:id", validate(DeleteAddressSchema), deleteAddress);

export default router;

