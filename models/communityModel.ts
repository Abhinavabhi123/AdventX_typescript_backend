import { ObjectId } from "mongodb";
import mongoose, { Document, Schema, SchemaTypes, model } from "mongoose";

//  *creating interface for the community schema
interface Community extends Document {
  communityName: string;
  members: [
    {
      userId: string;
      access: boolean;
    }
  ];
  chat?: [
    {
      userId: mongoose.Schema.Types.ObjectId;
      message: string;
      createdAt: string;
    }
  ];
  logo: string;
  status: string;
  createdAt?: Date;
}

// * Creating community schema by obey the interface order
const communitySchema = new Schema<Community>(
  {
    communityName: {
      type: String,
      required: true,
      unique:true,
      uppercase: true
    },
    members: [
      {
        userId: {
          type: String,
          ref: "User",
          required: true,
        },
        access: {
          type: Boolean,
          default: true,
        },
        _id:false
      },
    ],
    chat: [
      {
        userId: {
          type: SchemaTypes.ObjectId,
          ref: "User",
          required: false,
        },
        message:{
          type :String,
          required:true
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    logo: {
      type: String,
      required: false,
    },
    status: {
      type: String,
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

export default model<Community>("Community",communitySchema)
