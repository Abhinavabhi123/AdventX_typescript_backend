import { ObjectId } from "mongodb";
import { Document, Schema, SchemaTypes, model } from "mongoose";

interface User extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobile: number;
  status: boolean;
  date_of_birth?: Date;
  image: string;
  about: string;
  community: [
    {
      communityId: ObjectId;
      _id: boolean;
    }
  ];
  address: { [key: string]: number | string };
  primeMember: boolean;
  paymentId:string;
  height?: number;
  weight?: number;
  vehicles: ObjectId[];
  eventParticipation: ObjectId[];
  license: { [key: string]: string | number };
  createdAt: Date;
}

const userSchema = new Schema<User>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    date_of_birth: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    community: [
      {
        communityId: ObjectId,
        _id: false,
      },
    ],
    about: {
      type: String,
      required: false,
    },
    address: {
      houseName: String,
      locality: String,
      area: String,
      district: String,
      state: String,
      zipCode: Number,
    },
    primeMember: {
      type: Boolean,
      default: false,
    },
    paymentId:{
      type:String,
      required:false
    },
    height: {
      type: Number,
      required: false,
    },
    weight: {
      type: Number,
      required: false,
    },
    vehicles: [
      {
        vehicleId: {
          type: [SchemaTypes.ObjectId],
          ref: "Vehicles",
          required: false,
          
        },
        _id:false
      },
    ],
    eventParticipation: [
      {
        eventId: {
          type: SchemaTypes.ObjectId,
          ref:"Event"
        },
        _id:false
      },
    ],
    license: {
      licenseNumber: String,
      ExpiryDate: String,
      image: String,
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

export default model<User>("User", userSchema);
