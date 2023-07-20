import { Request, Response, NextFunction } from "express";
import eventModel from "../models/eventModel";
import { ObjectId } from "mongodb";

export const addEvent = async (req: Request, res: Response) => {
  try {
    interface Obj {
      message: string;
      status: number;
      error: string;
      eventId?: ObjectId;
    }
    let obj: Obj = {
      message: "",
      status: 0,
      error: "",
    };
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
      imageUrl,
      status
    } = req.body;
    const eventData = await eventModel.findOne({ eventName: eventName });
    if (!eventData) {
      new eventModel({
        eventName,
        subName: subTitle,
        location,
        date,
        eventType: type,
        fee,
        firstPrice,
        secondPrice,
        thirdPrice,
        description,
        about,
        status,
        primaryImage: imageUrl,
      })
        .save()
        .then((data) => {
          obj = {
            message: "Data stored successfully",
            status: 200,
            error: "",
            eventId: data._id,
          };
          res.status(obj.status).send(obj);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      obj = {
        message: "",
        status: 409,
        error: "This event name is already in use",
      };
      res.status(obj.status).send(obj);
    }
  } catch (error) {
    console.error(error);
  }
};
export const getAllEvent = async (req: Request, res: Response) => {
  try {
    interface Obj {
      message: string;
      status: number;
      error: string;
      eventData?: string[];
    }
    let obj: Obj = {
      message: "",
      status: 0,
      error: "",
    };
    const eventData = await eventModel.find();
    if (eventData) {
      let array: string[] = [];
      eventData.map((item) => {
        array.push(item._id);
      });
      obj = {
        message: "Data Fetched Successfully",
        status: 200,
        error: "",
        eventData: array,
      };
      res.status(obj.status).send(obj);
    } else {
      obj = {
        message: "",
        status: 404,
        error: "No Data Found",
      };
      res.status(obj.status).send(obj);
    }
  } catch (error) {
    console.log(error);
  }
};
export const getEventDetails = async (req: Request, res: Response) => {
  try {
    interface Obj {
      message: string;
      status: number;
      error: string;
      data?:{[key:string]:string|number|ObjectId|any};
    }
    let obj: Obj = {
      message: "",
      status: 0,
      error: "",
    };
    const { id } = req.query;
    if (id) {
      const data = await eventModel.findOne({ _id: id });
      if (data) {
        obj={
            message:"Data fetched successfully",
            status:200,
            error:"",
            data
        }
        res.status(obj.status).send(obj)
      } else {
        obj={
            message:"",
            status:404,
            error:"Document not found"
        }
        res.status(obj.status).send(obj)
      }
    } else {
        obj={
            message:"",
            status:404,
            error:'Please provide an Event ID'
        }
        res.status(obj.status).send(obj)
    }
  } catch (error) {
    console.error(error);
  }
};
export const getEventData=async(req:Request,res:Response)=>{
  try {
    interface Obj{
      message:string;
      status: number;
      error:string;
      eventData?:{[key:string]:string|number|ObjectId|any}
    }
    let obj:Obj={
      message:"",
      status:0,
      error:""
    }
    const {id} = req.query
    if(id){
      const eventData = await eventModel.findOne({_id:id})
      if(eventData){
        obj={
          message:`Event data fetched successfully`,
          status:200,
          error:"",
          eventData
        }
        res.status(obj.status).send(obj)
      }else{
        obj={
          message:"",
          status:404,
          error:'No such record found',
        }
        res.status(obj.status).send(obj)
      }
    }else{
      obj={
        message:"",
        status:404,
        error:'Please provide a valid id for fetching the events.',
      }
      res.status(obj.status).send(obj)
    }
    
  } catch (error) {
    console.error(error);
  }
}
