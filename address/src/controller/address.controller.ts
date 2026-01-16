import { Request, Response } from "express";
import { Address } from "../models/model.address";
import { asyncHandler } from "../config/asyncHandler";
import { ApiError } from "../utils/ApiError";

const getUserId = (req: Request): string => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) throw new ApiError(401, "Unauthorized");
  return userId;
};

// Haversine formula for distance calculation
const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const isLocationServiceable = (lat: number, lng: number): boolean => {
  const CENTRAL_LAT = 26.9124;
  const CENTRAL_LNG = 75.7873;
  const SERVICE_RADIUS_KM = 15;

  const distance = calculateDistance(lat, lng, CENTRAL_LAT, CENTRAL_LNG);
  return distance <= SERVICE_RADIUS_KM;
};

//  CHECK SERVICEABILITY 
export const checkServiceabilityController = asyncHandler(
  async (req: Request, res: Response) => {
    const { latitude, longitude } = req.body;

    const isServiceable = isLocationServiceable(latitude, longitude);

    res.json({
      success: true,
      isServiceable,
      message: isServiceable
        ? "Great! We deliver to this location"
        : "Sorry, we don't deliver to this area yet. We're expanding soon!",
      coordinates: { latitude, longitude },
    });
  }
);

//  CREATE ADDRESS 
export const createAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getUserId(req);

    // Extract coordinates - GeoJSON format is [longitude, latitude]
    const [lng, lat] = req.body.location.coordinates;

    // Check serviceability
    if (!isLocationServiceable(lat, lng)) {
      throw new ApiError(400, "Sorry, we don't deliver to this area yet");
    }

    // Check if this is user's first address
    const isFirstAddress = !(await Address.exists({ userId }));

    // If setting as default OR first address, unset other defaults
    if (req.body.isDefault || isFirstAddress) {
      await Address.updateMany(
        { userId, isDefault: true },
        { $set: { isDefault: false } }
      );
    }

    // Create address
    const address = await Address.create({
      userId,
      ...req.body,
      isDefault: req.body.isDefault || isFirstAddress,
    });

    res.status(201).json({
      success: true,
      message: "Address saved successfully",
      data: address,
    });
  }
);

//  GET ALL ADDRESSES 
export const getAddresses = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getUserId(req);

    const addresses = await Address.find({ userId })
      .sort({ isDefault: -1, createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: addresses.length,
      data: addresses,
    });
  }
);

//  GET SINGLE ADDRESS 
export const getAddress = asyncHandler(async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const id = req.params.id as string;

  const address = await Address.findOne({ _id: id, userId }).lean();

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  res.json({
    success: true,
    data: address,
  });
});

//  GET DEFAULT ADDRESS 
export const getDefaultAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getUserId(req);

    const address = await Address.findOne({
      userId,
      isDefault: true,
    }).lean();

    if (!address) {
      throw new ApiError(
        404,
        "No default address found. Please add an address."
      );
    }

    res.json({
      success: true,
      data: address,
    });
  }
);

//  UPDATE ADDRESS 
export const updateAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const id = req.params.id as string;

    // Check if address exists
    const existingAddress = await Address.findOne({ _id: id, userId });
    if (!existingAddress) {
      throw new ApiError(404, "Address not found");
    }

    // If updating location, check serviceability
    if (req.body.location?.coordinates) {
      const [lng, lat] = req.body.location.coordinates;

      if (!isLocationServiceable(lat, lng)) {
        throw new ApiError(400, "Sorry, we don't deliver to this area yet");
      }
    }

    // If setting as default, unset other defaults
    if (req.body.isDefault === true) {
      await Address.updateMany(
        { userId, isDefault: true, _id: { $ne: id } },
        { $set: { isDefault: false } }
      );
    }

    // Update the address
    const address = await Address.findOneAndUpdate(
      { _id: id, userId },
      { $set: req.body },
      { new: true }
    );

    res.json({
      success: true,
      message: "Address updated successfully",
      data: address,
    });
  }
);

//SET DEFAULT ADDRESS
export const setDefaultAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const id = req.params.id as string;

    // Check if address exists
    const existingAddress = await Address.findOne({ _id: id, userId });
    if (!existingAddress) {
      throw new ApiError(404, "Address not found");
    }

    // Unset all defaults and set new one
    await Address.updateMany(
      { userId, isDefault: true },
      { $set: { isDefault: false } }
    );

    const address = await Address.findOneAndUpdate(
      { _id: id, userId },
      { $set: { isDefault: true } },
      { new: true }
    );

    res.json({
      success: true,
      message: "Default address updated",
      data: address,
    });
  }
);

// DELETE ADDRESS
export const deleteAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const id = req.params.id as string;

    const address = await Address.findOneAndDelete({ _id: id, userId });

    if (!address) {
      throw new ApiError(404, "Address not found");
    }

    // If deleted address was default, set the most recent as default
    if (address.isDefault) {
      await Address.findOneAndUpdate(
        { userId },
        { $set: { isDefault: true } },
        { sort: { createdAt: -1 } }
      );
    }

    res.json({
      success: true,
      message: "Address deleted successfully",
    });
  }
);
