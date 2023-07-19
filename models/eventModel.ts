import { ObjectId } from "mongodb";
import { Document, Schema, model } from "mongoose";

interface Event extends Document {
  eventName: string;
  subName: string;
  location: string;
  date: Date;
  eventType: string;
  fee: number;
  firstPrice: number;
  secondPrice: number;
  thirdPrice: number;
  description: string;
  about: string;
  status: string;
  primaryImage: string;
  earnings: number;
  subTotal: number;
  participants: {
    userId: ObjectId;
    vehicleId: ObjectId;
  }[];
  createdAt: Date;
}

const eventSchema = new Schema<Event>({
    eventName:{
        type:String,
        required:true,
        unique:true
    },
    subName:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    eventType:{
        type:String,
        required:true
    },
    fee:{
        type:Number,
        required:true
    },
    firstPrice:{
        type:Number,
        required:true
    },
    secondPrice:{
        type:Number,
        required:true
    },
    thirdPrice:{
        type:Number,
        required:true
    },
    description:{
        type: String,
        required:true
    },
    about:{
        type: String,
        required:true
    },
    primaryImage:{
        type:String,
        required:true
    },
    earnings:{
        type:Number,
        required:false
    },
    subTotal:{
        type: Number,
        required:false
    },
    participants:[
        {
            userId:{
                type:ObjectId,
                ref:"User"
            },
            vehicleId:{
                type:ObjectId,
                ref:"Vehicles"
            }

        }
    ],
    createdAt:{
        type:Date,
        default:Date.now
    }
},{
    timestamps:true
});

export default model<Event>("Event",eventSchema);