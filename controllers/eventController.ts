import { Request, Response, NextFunction } from "express";
import eventModel from "../models/eventModel";
import { ObjectId } from "mongodb";
import cloudinary from "../utils/cloudnaryConfig"
import fs from "fs"
import path from "path";


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
      status,
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
      data?: { [key: string]: string | number | ObjectId | any };
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
        obj = {
          message: "Data fetched successfully",
          status: 200,
          error: "",
          data,
        };
        res.status(obj.status).send(obj);
      } else {
        obj = {
          message: "",
          status: 404,
          error: "Document not found",
        };
        res.status(obj.status).send(obj);
      }
    } else {
      obj = {
        message: "",
        status: 404,
        error: "Please provide an Event ID",
      };
      res.status(obj.status).send(obj);
    }
  } catch (error) {
    console.error(error);
  }
};
export const getEventData = async (req: Request, res: Response) => {
  try {
    interface Obj {
      message: string;
      status: number;
      error: string;
      eventData?: { [key: string]: string | number | ObjectId | any };
    }
    let obj: Obj = {
      message: "",
      status: 0,
      error: "",
    };
    const { id } = req.query;
    if (id) {
      const eventData = await eventModel.findOne({ _id: id });
      if (eventData) {
        obj = {
          message: `Event data fetched successfully`,
          status: 200,
          error: "",
          eventData,
        };
        res.status(obj.status).send(obj);
      } else {
        obj = {
          message: "",
          status: 404,
          error: "No such record found",
        };
        res.status(obj.status).send(obj);
      }
    } else {
      obj = {
        message: "",
        status: 404,
        error: "Please provide a valid id for fetching the events.",
      };
      res.status(obj.status).send(obj);
    }
  } catch (error) {
    console.error(error);
  }
};
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    interface Obj {
      message: string;
      status: number;
      error: string;
      image?: string;
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
        await eventModel.deleteOne({ _id: id });
        obj={
          message:"Event deleted successfully",
          status:200,
          error:"",
          image:data?.primaryImage
        }
        res.status(obj.status).send(obj)
      }
    } else {
      obj = {
        message: "",
        status: 404,
        error: "Please provide the event Id",
      };
      res.status(obj.status).send(obj);
    }
  } catch (error) {
    console.error(error);
  }
};
export const getAllUpEvents=async(req:Request,res:Response)=>{
  try {
    interface Obj{
      message:string;
      status:number;
      error:string;
      eventData?:{_id:ObjectId}[]
    }
    let obj:Obj={
      message:'',
      status:0,
      error:""
    }
    const eventData= await eventModel.find({$and:[{status:"Active"},{is_completed:false}]},{_id:1})
    if(eventData){
      obj={
        message:"Data fetched successfully",
        status:200,
        error:"",
        eventData
      }
      res.status(obj.status).send(obj)
    } else{
      obj={
        message:"",
        status:500,
        error:"Can't fetch the data"
      }
      res.status(obj.status).send(obj)
    }
  } catch (error) {
    console.error(error);
  }
}
export const getEvent=async(req:Request,res:Response)=>{
  try {
    const {id} = req.query
    interface Obj{
      message:string;
      status:number;
      error:string;
      data?:{}
    }
    if(id){
      let obj:Obj={
        message:"",
        status:0,
        error:""
      }
      const data = await eventModel.findOne({_id:id})
      if(data){
        obj={
          message:"Data fetched successfully",
          status:200,
          error:"",
          data
        }
        res.status(obj.status).send(obj)
      }else{
        obj={
          message:"",
          status:404,
          error:"Data not found"
        }
        res.status(obj.status).send(obj)
      }
    }

  } catch (error) {
    console.error(error);
  }
}
export const getAllEvents =async(req:Request,res:Response)=>{
  try {
      interface Obj{
        message: string;
        status:number;
        error:string;
        data?:{}
      }
      let obj:Obj={
        message:"",
        status:0,
        error:""
      }

      const data = await eventModel.find({is_completed:true})
      if(data){
        obj={
          message:"Data fetched successfully",
          status:200,
          error:'',
          data
        }
        res.status(obj.status).send(obj)
      }else{
        obj={
          message:"",
          status:404,
          error:"Data not found"
        }
        res.status(obj.status).send(obj)
      }
  } catch (error) {
    console.error(error);
  }
}
export const getUserAllEvents =async(req:Request,res:Response)=>{
  try {
    interface Obj{
      message:string;
      status:number;
      error:string;
      eventData?:{}
    }
    let obj:Obj={
      message:'',
      status:0,
      error:''
    }
    const eventData = await eventModel.find({status:"Active"})
    if(eventData){
      obj={
        message:"Event data fetched successfully",
        status:200,
        error:"",
        eventData
      }
      res.status(obj.status).send(obj)
    }else{
      obj={
        message:"",
        status:404,
        error:`No event data found`
      }
      res.status(obj.status).send(obj)
    }
  } catch (error) {
    console.error(error);
  }
}

export const editEvent=async(req:Request,res:Response)=>{
  try {
    interface Obj{
      message:string,
      status:number,
      error:string;
      eventData?:{}
    }
    let obj:Obj={
      message:"",
      status:0,
      error:""
    }
    const {id}=req.params
    
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
      status} =req.body
      if(id){
        const eventData = await eventModel.findOne({_id:id})
        if(eventData){
         if(req.body){
          await eventModel.updateOne({_id:id},{$set:{
            eventName:eventName,
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
            status
          }}).then(()=>{
            obj={
              message:`data changed successfully`,
              status:200,
              error:"",
              eventData
            }
            res.status(obj.status).send(obj)
          })
         }
          
        }else{
          obj={
            message:"",
            status:404,
            error:`The event is not present `
          }
          res.status(obj.status).send(obj)
        }
      }else{
        obj={
          message:"",
          status:404,
          error:"can't find the event"
        }
        res.status(obj.status).send(obj)
      }
    
  } catch (error) {
    console.error(error);
  }
}

export const editEventImage=async(req:Request,res:Response)=>{
  try {
    interface Obj{
      message:string,
      status:number,
      error:string;
      eventData?:{}
    }
    let obj:Obj={
      message:"",
      status:0,
      error:""
    }
    const {id}=req.params
    
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
      status,
      imageUrl} =req.body
      if(id){
        const eventData = await eventModel.findOne({_id:id})
        if(eventData){
         if(req.body){
          await eventModel.updateOne({_id:id},{$set:{
            eventName:eventName,
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
            status,
            primaryImage:imageUrl
          }}).then(()=>{
            obj={
              message:`data changed successfully`,
              status:200,
              error:"",
              eventData
            }
            res.status(obj.status).send(obj)
          })
         }
          
        }else{
          obj={
            message:"",
            status:404,
            error:`The event is not present `
          }
          res.status(obj.status).send(obj)
        }
      }else{
        obj={
          message:"",
          status:404,
          error:"can't find the event"
        }
        res.status(obj.status).send(obj)
      }
    
  } catch (error) {
    console.error(error);
  }
}

export const addWinners=async(req:Request,res:Response)=>{
  try {
    interface Obj{
      message:string;
      status:number;
      error:string;
    }
    let obj={
      message:"",
      status:0,
      error:''
    }
    const {id}=req.params
    const {firstName,secondName,thirdName} = req.body
    if(id){
      const eventData = await eventModel.findOne({_id:id})
      if(eventData){
        if(req.files&&req.body){
          const array:string[]=[]
          const file = req.files as any
          const folder = path.join(__dirname,"../public/eventIMage");
          for(const img of file){
            const imageUrl =img?.filename
            const imagePath = path.join(folder, imageUrl);
            const options={
              folder:"winners",
              format: "webp"
          }
          await cloudinary.v2.uploader.upload(img.path,options).then((data)=>{
            array.push(data?.url)
            fs.unlink(imagePath,(err)=>{
              if (err) {
                console.error(err);
              } else {
                console.log("Event image deleted successfully");
              }
            })
          })
        }
          interface Data{
            name:string;
            image:string
          }
          const obj1:Data={
            name:firstName,
            image:array[0]
          }
          const obj2:Data={
            name:secondName,
            image:array[1]
          }
          const obj3:Data={
            name:thirdName,
            image:array[2]
          }
          await eventModel.updateOne({_id:id},{$set:{winners:[{first:obj1},{second:obj2},{third:obj3}]}}).then((data)=>{
            
            obj={
              message:"Data updated successfully",
              status:200,
              error:''
            }
            res.status(obj.status).send(obj)
          })
        }else{
          obj={
            message:"",
            status:404,
            error:`Data not found`
          }
          res.status(obj.status).send(obj)
        }
      }else{
        obj={
          message:"",
          status:404,
          error: `Can't fetch the event data`
        }
        res.status(obj.status).send(obj)
      }
    }else{
      obj={
        message:"",
        status:404,
        error:`Cant find the event data`
      }
      res.status(obj.status).send(obj)
    }


    
    
  } catch (error) {
    console.error(error);
  }
}

export const eventImages=async(req:Request,res:Response)=>{
  try {
    interface Obj{
      message:string;
      status:number;
      error:string
    }
    let obj:Obj={
      message:"",
      status:0,
      error:''    
    }
    const {id}=req.params
    const file = req.files as any
    const eventData = await eventModel.findOne({_id:id})
    if(eventData){

      if(file){
        const array:string[]=[]
        const folder = path.join(__dirname, "../public/eventIMage");
        for(const image in file){
        const data = file[image]
        const imageUrl =data?.filename
        const imagePath = path.join(folder, imageUrl);
        const options={
          folder:"events",
          format: "webp"
        }
       await cloudinary.v2.uploader.upload(data.path,options).then((data)=>{
          array.push(data?.url)
          fs.unlink(imagePath,(err)=>{
            if (err) {
              console.error(err);
            } else {
              console.log("Event image deleted successfully");
            }
          })
        })
        
      }
        await eventModel.updateOne({_id:id},{$set:{images:array}}).then(()=>{
          obj={
            message:"Image saved successfully",
            status:200,
            error:''
          }
          res.status(obj.status).send(obj)
        })
      }
    }else{
      obj={
        message:"",
        status:404,
        error:`Can't find the event`
      }
      res.status(obj.status).send(obj)
    }   
  } catch (error) {
    console.error(error);
  }
}

export const changeEventStatus=async(req:Request,res:Response)=>{
  try {
    interface Obj{
      message:string;
      status:number;
      error:string;
    }
    let obj:Obj={
      message:"",
      status:0,
      error:""
    }
    console.log(req.body);
    const {_id,selected}=req.body
    if(_id){
      const id = _id
      const eventData = await eventModel.findOne({_id:id})
      if(eventData){
       await eventModel.updateOne({_id:id},{$set:{
        is_completed:selected
       }}).then(()=>{
          obj={
            message:"Event status has been changed",
            status:200,
            error:''
          }
          res.status(obj.status).send(obj)
       })
      }else{
        obj={
          message:"",
          status:404,
          error:`Event data is not available`
        }
        res.status(obj.status).send(obj)
      }
    }else{
      obj={
        message:"",
        status:404,
        error:`Can't find the event data `
      }
      res.status(obj.status).send(obj)
    }
    
  } catch (error) {
    console.error(error);
  }
}