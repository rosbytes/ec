import mongoose, { Schema, Document } from "mongoose";
import { boolean } from "zod";

export interface IAddress extends Document {
  userId: string;
  name: string;
  phone: string;
  apartmentName?: string;
  streetDetails?: string;
  landmark?: string;
  addressType: "Home" | "Office" | "Other";
  location: {
    type: string;
    coordinates: [number, number];
    address: string;
  };
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<IAddress>(
  {
    userId: {
      type: String,
      required: [true, "User Id is required"],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    apartmentName: String,
    streetDetails: String,
    landmark: String,
    addressType: {
      type: String,
      enum: ["Home", "Office", "Other"],
      default: "Home",
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
// Geo index (VERY IMPORTANT)
AddressSchema.index({ location: "2dsphere" });

// User address queries -> latest (-1)
AddressSchema.index({ userId: 1, isDefault: -1, createdAt: -1 });

export const Address = mongoose.model<IAddress>("Address", AddressSchema);