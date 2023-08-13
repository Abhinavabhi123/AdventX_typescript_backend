import { Request, Response, NextFunction } from "express";
import eventModel from "../models/eventModel";
import { ObjectId } from "mongodb";
import cloudinary from "../utils/cloudnaryConfig"
import fs from "fs"
import path from "path";import stripe from "stripe";
import * as dotenv from "dotenv";
import userModel from "../models/userModel";
import { error, log } from "console";
dotenv.config();

const secret_strip = <string>process.env.STRIPE_SECRET_KEY;
const stripes = new stripe(secret_strip, { apiVersion: "2022-11-15" });


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
        await eventModel.updateOne({_id:id},{$push:{images:array}}).then(()=>{
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
export const eventEarnings=async(req:Request,res:Response)=>{
    try {
      interface Obj{
        message:string;
        status:number;
        error:string;
        eventData?:any[]
      }
      let obj:Obj={
        message:"",
        status:0,
        error:''
      }
       const eventData = await eventModel.find({},{_id:0,fee:1,participants:1,eventName:1})
       if(eventData){
        obj={
          message:`Event data fetched successfully`,
          status:200,
          error:"",
          eventData
        }
        res.status(obj.status).send(obj)
       }
       else{
        obj={
          message:"",
          status:404,
          error:"Something went wrong"
        }
        res.status(obj.status).send(obj)
       }
    } catch (error) {
      console.error(error);
    }
}

export const eventPayment=async(req:Request,res:Response)=>{
  try {
    interface Obj{
      message:string;
      status:number;
      error:string;
      url?:string|null
    }
    let obj:Obj={
      message:"",
      status:0,
      error:""
    }
    console.log(req.body);
    console.log("Ethiiii");
    const {userId,amount,eventName,eventId,license,vehicle} = req.body;
    const userData = await userModel.findOne({_id:userId})
    if(userId){
      const eventData = await eventModel.findOne({_id:eventId})
      if(eventData){

      
      const session = await stripes.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: eventName,
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        metadata: {
          userId,
          eventId
        },
        success_url: `${process.env.CLIENT_DOMAIN}/eventPayment/success?eveId=${eventId}&_id={CHECKOUT_SESSION_ID}&li=${license}&veh=${vehicle}`,
        cancel_url: `${process.env.CLIENT_DOMAIN}/eventPayment/cancel`,
      });
      console.log(session,"session");
      
      obj={
        message:"success",
        status:200,
        error:"",
        url: session.url 
      }
      res.status(obj.status).send(obj)
    }else{
      obj={
        message:"",
        status:404,
        error:"Event data not found"
      }
      res.status(obj.status).send(obj)

    }
    }else{
      obj={
        message:"",
        status:404,
        error:"User not found"
      }
      res.status(obj.status).send(obj)
    }
    
    
  } catch (error) {
    console.error(error);
  }
}

export const addParticipation=async(req:Request,res:Response)=>{
  try {interface Obj{
    message:string;
    status:number;
    error:string
  }
  let obj:Obj={
    message:"",
    status:0,
    error:""
  }
    console.log(req.body);
    const {_id,eventId,userId,vehicle,license}=req.body
    if(_id&&eventId&&userId&&vehicle&&license){
      const eventData = await eventModel.findOne({_id:eventId})
      if(eventData){
        await eventModel.updateOne({_id:eventId},{$push:{
          participants:{
            userId:userId,
            vehicleId:vehicle,
            licenseId:license,
            paymentId:_id
          }
        }}).then(async()=>{
          await userModel.updateOne({_id:userId},{$push:{eventParticipation:{eventId:eventData?._id}}}).then(()=>{
            obj={
              message:"Event participation successful",
              status:200,
              error:""
            }
            res.status(obj.status).send(obj)
          })
          
        })
      }else{
        obj={
          message:"",
          status:404,
          error:"Event data not found"
        }
        res.status(obj.status).send(obj)
      }

    }
  } catch (error) {
    console.error(error);
  }
}

export const userEvents=async(req:Request,res:Response)=>{
  try {
      interface Obj{
        message:string;
        status:number;
        error:string
        eventList?:any[]
      }  
      let obj:Obj={
        message:"",
        status:0,
        error:""
      }
      const {id}=req.params
      if(id){
        const userData:any = await userModel.findOne({_id:id})
        if(userData){ 
          const array=[]
          for(const data of userData.eventParticipation){
          const event = await eventModel.findOne({_id:data.eventId})
          array.push(event)
          }
          obj={
            message:"Data fetched successfully",
            status:200,
            error:"",
            eventList:array
          }
          res.status(obj.status).send(obj)
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
          error:"Something wen't wrong"
        }
        res.status(obj.status).send(obj)
      }  
  } catch (error) {
    console.error(error);
  }
}

export const deleteEventImages=async(req:Request,res:Response)=>{
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
      console.log(req.query);
      console.log(req.body.selectedValues);
      const {selectedValues}=req.body
      const {id}=req.query
      const eventData = await eventModel.findOne({_id:id})
      if(eventData){
        for(const image of selectedValues){
          try {
            console.log(image.value,"popoo");
            const images = image?.value.split("/")
            const data = images[images.length-1]
            const img = data.split(".")[0]

            const destroyResult = await cloudinary.v2.uploader.destroy( `events/${img}`);
            if (destroyResult.result === 'ok') {
              await eventModel.updateOne({ _id: id }, { $pull: { 
                images:image?.value
              } }).then(()=>{
                console.log("Image removed from database");
                
              })
            } else {
              console.log('Cloudinary error:', destroyResult.result);
            }
          } catch (error) {
            console.log('Error deleting image:', error);
          }
        }
        obj={
          message:"Images removed successfully",
          status:200,
          error:""
        }
        res.status(obj.status).send(obj)
      }else{
        obj={
          message:'',
          status:404,
          error:`Can't find the event data`
        }
        res.status(obj.status).send(obj)
      }
  } catch (error) {
    console.error(error);
  }
}