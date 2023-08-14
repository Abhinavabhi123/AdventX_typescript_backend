import { Request, Response, NextFunction } from "express";
import adminModel from "../models/adminModel";
import userModel from "../models/userModel";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import Jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import eventModel from "../models/eventModel";
import communityModel from "../models/communityModel";
dotenv.config();

const adminSecret: string = process.env.ADMIN_JWT_SECRET || "";

export const postAdminLogin = async (req: Request, res: Response) => {
  try {
    type Admin = {
      _id: ObjectId;
      email: string;
      password: string;
    };

    type obj = {
      access: boolean;
      message: string;
      error: string;
      status: number;
      token?: string;
    };

    let object: obj = {
      access: false,
      message: "",
      error: "",
      status: 0,
    };
    const { email, password } = req.body;
    const adminData: Admin | null = await adminModel.findOne({ email: email });
    if (!adminData) {
      // Admin data not found
      let object: obj = {
        access: false,
        message: "",
        error: "Email not matching",
        status: 404,
      };
      return res.status(object.status).send(object);
    }
    const hashPass: string = adminData.password;
    const adminPass: boolean = await bcrypt.compare(password, hashPass);
    if (!adminPass) {
      object = {
        access: false,
        message: "",
        error: "Password is incorrect",
        status: 401,
        token: "",
      };
      return res.status(object.status).send(object);
    } else {
      const token = Jwt.sign({ email: adminData?.email }, adminSecret, {
        expiresIn: "5d",
      });
      object = {
        access: true,
        message: "Access Granted",
        error: "",
        status: 200,
        token: token,
      };
      
      // .cookie("AdminJwt", token, {
      //   httpOnly: true,
      //   domain: process.env.cookieDomain,
      //   path: "/",
      //   maxAge: 3600000,
      // })

      res
        .status(object.status)
        .cookie(
          "AdminJwt",
          token,{
            expires: new Date(Date.now() + 3600 * 1000),
            httpOnly: true,
            sameSite: "strict",
            path:'/'
        }
        )
        .send(object)
    }
  } catch (error) {
    console.error(error);
  }
};

export const getAllUser = async (req: Request, res: Response) => {
  try {
    console.log("ivide nd");

    const allUsers = await userModel.find();
    console.log(allUsers);
    res.status(200).send(allUsers);
  } catch (error) {
    console.error(error);
  }
};
export const blockUser = async (req: Request, res: Response) => {
  interface UserDocument {
    _id: string;
    status: boolean;
    save: () => void;
  }
  type UserData = UserDocument | null;
  try {
    const id = req.body;
    console.log(id);
    const userData: UserData = await userModel.findOne({ _id: id });

    if (userData) {
      if (userData?.status == false) {
        userData.status = true;
      } else {
        userData.status = false;
      }
      await userData.save();
      res.send(userData);

    } else {
      console.log("User not Found");
    }
  } catch (error) {
    console.error(error);
  }
};

export const singleUser = async (req: Request, res: Response) => {
  try {
    const id = req.query.id;
    const userData = await userModel.findOne({ _id: id });
    res.send(userData);
  } catch (error) {
    console.error(error);
  }
};
export const accounts=async(req:Request,res:Response)=>{
  try {
    interface Obj{
      message:string;
      status:number;
      error:string;
      subAmount?:number;
      eventAmount?:number;
    }
    let obj:Obj={
      message:"",
      status:0,
      error:''
    }
    const primeMembers = await userModel.find({primeMember:true}).count()
    const subscription=primeMembers*2000
    const eventData = await eventModel.find()
    console.log(eventData,"event Data");
  
    const eventAmount = await eventModel.aggregate([
      {
        $addFields: {
          participantsCount: { $size: "$participants" } 
        }
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: { $multiply: ["$fee", "$participantsCount"] } }
        }
      }
    ]);
    // const eventAmount = await eventModel.aggregate([{}])
    console.log(eventAmount,'eventkkkkk');
    

    console.log(subscription,"kjkjkjj");
    obj={
      message:"data fetched successfully",
      status:200,
      error:"",
      subAmount:subscription,
      eventAmount:eventAmount[0].totalEarnings
    
    }
    res.status(obj.status).send(obj)
    
    
  } catch (error) {
    console.error(error);
  }
}
export const dashboardCardValues=async(req:Request,res:Response)=>{
  try {
    interface Obj{
      message:string;
      status:number;
      error:string;
      userData?:number;
      blockedUsers?:number;
      primeMembers?:number;
      events?:number;
      completedEvents?:number;
      communityCount?:number;
    }
    let obj:Obj={
      message:"",
      status:0,
      error:""
    }
    
    const userData = await userModel.find().count()
    const blockedUsers= await userModel.find({status:false}).count()
    const primeMembers= await userModel.find({primeMember:true}).count()
    const events = await eventModel.find().count()
    const completedEvents = await eventModel.find({is_completed:true}).count()
    const communityCount = await communityModel.find().count() 
    if(userData>=0&&blockedUsers>=0&&primeMembers>=0&&events>=0&&completedEvents>=0&&communityCount>=0){
      obj={
        message:"Data fetched successfully",
        status:200,
        error:"",
        userData,
        blockedUsers,
        primeMembers,
        events,
        completedEvents,
        communityCount
      }
      res.status(obj.status).send(obj)
    }else{
      obj={
        message:"",
        status:404,
        error:`Something wen't wrong`
      }
      res.status(obj.status).send(obj)
    }

  } catch (error) {
    console.error(error);
  }
}
export const primeMembers=async(req:Request,res:Response)=>{
  try {
    interface Obj{
      message:string;
      status:number;
      error:string;
      userData?:any[]
    }
    let obj:Obj={
      message:'',
      status:0,
      error:''
    }
    const userData =await userModel.find({primeMember:true})
    if(userData){
      obj={
        message:`Data fetched successfully`,
        status:200,
        error:'',
        userData
      }
      res.status(obj.status).send(obj)
    }else{
      obj={
        message:"",
        status:404,
        error:`Something wen't wrong`
      }
      res.status(obj.status).send(obj)
    }
  } catch (error) {
    console.error(error);
  }
}