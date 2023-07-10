import { ObjectId } from "mongodb";
import { Document, Schema, SchemaTypes, model } from "mongoose";

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
      userId: ObjectId;
      text: string;
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
      },
    ],
    chat: [
      {
        userId: {
          type: SchemaTypes.ObjectId,
          ref: "User",
          required: false,
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
