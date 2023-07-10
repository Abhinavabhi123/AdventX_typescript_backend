import { Request, Response, NextFunction } from "express";
import { ObjectId } from "mongodb";
import userModel from "../models/userModel";
import communityModel  from "../models/communityModel";
import mongoose from "mongoose"

export const getCommunityUsers = async (req: Request, res: Response) => {
  try {
    type Users = {
      _id: ObjectId;
    };
    const userData: (Users | null)[] = await userModel.find({
      $and: [{ status: true }, { primeMember: true }],
    });

    if (!userData) {
      res.status(401).send({ message: "No Prime Users" });
    } else {
      res.status(200).send(userData);
    }
  } catch (error) {
    console.error(error);
  }
};
export const getComUser = async (req: Request, res: Response) => {
  try {
    console.log("ethi");

    const id = req.query.id;
    console.log(id,"idddddd");

    const userData = await userModel.findOne({ _id:id });
    if (userData) {
      console.log("no data");
      res.status(200).send(userData)
    }
    
  } catch (error) {
    console.error();
  }
};

// * Creating community

export const createCommunity=async(req:Request,res:Response)=>{
  try {
    interface cName{
      message:string;
      status:number;
      error:string
    }

    let obj:cName={
      message:"",
      status:0,
      error:""
    }
    console.log("ethi");
    
    console.log(req.body);
    const {cName,status,cMembers} = req.body
    const CommData = await communityModel.findOne({communityName:cName})
   console.log(CommData,"Dataaa");
   
    if(CommData){
        console.log("yes");
        
    }else{
      console.log(cMembers);
      const mData =cMembers;
      // type Member=[
      //   {
      //     userId:string;
      //     status:boolean
      //   }
      // ]
      interface Value{
        userId: ObjectId;
        status: boolean;
      }

      let members:Value[]=[]
      interface Item{
        _id:ObjectId;
      }
      console.log(ObjectId);
      
      mData.map((item:Item)=>{
        const value={
          userId:item._id,
          status:true
        }
        members.push(value)
      })
      console.log(members,"userData");
      
      
      const data =new communityModel({
        communityName:cName,
        status:status,
        members:members
        
      }).save().then(()=>{
        obj={
          message:"Community Created Successfully",
          status:200,
          error:''
        }
        res.status(obj.status).send(obj)
      })
        console.log("no");
    }
    
  } catch (error) {
    console.error(error);
  }
}
export const communities=async(req:Request,res:Response)=>{
    try {
      interface Obj{
        message:string;
        status:number;  
        error:string
        community?:{}
      }
      let obj:Obj={
        message:"",
        status:0,
        error:"",
        community:{}
      }
      const commData = await communityModel.find();
      if(commData){
        obj={
          message:'Communities Fetched',
          status:200,
          error:'',
          community:commData
        }
        res.status(obj.status).send(obj)
      }else{
        obj={
          message:'No Community founded',
          status:200,
          error:'',
          community:commData
        }
        res.status(obj.status).send(obj)
      }
    } catch (error) {
      console.error(error);
    }
}