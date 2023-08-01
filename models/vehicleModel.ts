import { ObjectId } from "mongodb";
import { Document, Schema, SchemaTypes, model } from "mongoose";
interface Vehicles extends Document {
  userId: ObjectId;
  vehicleNumber: string;
  vehicleName: string;
  vehicleType: string;
  wheelCount: number;
  fuelType: string;
  ownerName: string;
  images: string[];
  checked: boolean;
  approved: boolean;
  createdAt: Date;
}

const vehicleScheme = new Schema<Vehicles>(
  {
    userId: {
      type: [SchemaTypes.ObjectId],
      ref: "User",
    },
    vehicleNumber: {
      type: String,
      required: true,
    },
    vehicleName: {
      type: String,
      required: true,
    },
    vehicleType: {
      type: String,
      required: true,
    },
    wheelCount: {
      type: Number,
      required: true,
    },
    fuelType: {
      type: String,
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    checked: {
      type: Boolean,
      default: false,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default model<Vehicles>("Vehicles",vehicleScheme)
