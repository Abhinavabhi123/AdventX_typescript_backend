import { Request, Response, NextFunction } from "express";
import eventModel from "../models/eventModel";
import { ObjectId } from "mongodb";

export const addEvent = async (req: Request, res: Response) => {
  try {
    interface Obj{
        message:string;
        status:number;
        error:string;
        eventId?:ObjectId
    }
    let obj:Obj={
        message:"",
        status:0,
        error:""
    }
    console.log(req.body);
    const {
      eventName,
      subTitle,
      location,
      date,
      type,
      fee,
      firstPrice,
      secondPrice,
      thirdPrice,
      description,
      about,
      imageUrl
    } = req.body;
    const eventData = await eventModel.findOne({ eventName:eventName});
    if(!eventData){
         new eventModel({
            eventName,
            subName:subTitle,
            location,
            date,
            eventType:type,
            fee,
            firstPrice,
            secondPrice,
            thirdPrice,
            description,
            about,
            primaryImage:imageUrl
        }).save().then((data)=>{    
            obj={
                message:"Data stored successfully",
                status:200,
                error:"",
                eventId:data._id
            }
            res.status(obj.status).send(obj)
        }).catch((error)=>{
            console.log(error);
            
        })

    }else{
        obj={
            message:"",
            status:409,
            error:"This event name is already in use"
        }
        res.status(obj.status).send(obj)
    }
  } catch (error) {
    console.error(error);
  }
};
