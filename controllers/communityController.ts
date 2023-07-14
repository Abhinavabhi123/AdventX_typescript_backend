import { Request, Response, NextFunction } from "express";
import { ObjectId } from "mongodb";
import userModel from "../models/userModel";
import communityModel  from "../models/communityModel";


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
    console.log(req.body,"Datrtttt");
    const {cName,status,cMembers} = req.body
    console.log(req.file,"file");
    

    const CommData = await communityModel.findOne({communityName:cName})
   console.log(CommData,"Dataaa");
   
    if(CommData){
        console.log("yes");
        
    }else{
      console.log(cMembers);
      const mData =cMembers;
      
      interface Value{
        userId: ObjectId;
        status: boolean;
      }

      let members:Value[]=[]
      interface Item{
        _id:ObjectId;
      }
    
      if(!req.body.cName ||!req.body.status ||!req.body.cMembers || !req.file || !req.file.path){
        console.error("error");
        obj={
          message:"",
          status:404,
          error:`Resource not found,Please try again later`
        }
        res.status(obj.status).send(obj)
      return
      }
      let fileName=""

      if(req.file){
        fileName =req.file.filename 
      }
      
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
        members:members,
        logo:fileName
      }).save().then((data)=>{
        console.log(data);

        mData.map(async(item:Item)=>{
          await userModel.updateOne({_id:item._id},{$push:{community:{communityId:data._id}}})
        })
        
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

export const getCommunityDetails=async(req:Request,res:Response)=>{
  try {
      interface Obj{
        message:string;
        status:number;
        error:string;
        commData?:object;
      }
      let obj:Obj={
        message:"",
        status:0,
        error:"",
      }
      const id:string = req.params.id
      const commData = await communityModel.findOne({_id:id})
      .populate({
        path: 'members.userId',
        model: 'User'
      });
      if(commData){
        // const data = commData?.members
        // console.log(data)
        // // let hello = data.populate({path:userId,model:"User"})
        // const array:string[]=[]
        
        // data.map((item)=>{
        //   console.log(item?.userId);
        //   const hello = item.populate('User')
        //   // array.push(item?.userId)
        // })
        
        obj={
          message:"Data fetched Successfully",
          status:200,
          error:"",
          commData
        }
        res.status(obj.status).send(obj)
        
      }else{
        console.log("Data not fetched");
        obj={
          message:"",
          status:404,
          error:"Data Not fetched"
        }
        res.status(obj.status).send(obj)
      }
      
  } catch (error) {
    console.error(error);
  }
}
export const changeComStatus=async(req:Request,res:Response)=>{
  try {
    interface Obj{
      message:string;
      status:number;
      error:string;
    }
    let obj={
      message:"",
      status:0,
      error:""
    }
    console.log(req.body);
    const {id,userId}:{id:string;userId:string}=req.body;
    const community = await communityModel.findOne({_id:id})
    if(community){
      const members = community.members
     const user = members.map((member)=>{
      if(member.userId === userId){
        member.access  =!member.access
      }
      return member
     })
     community.members=user as [{ userId: string; access: boolean; }];;
     await community.save().then(()=>{
      obj={
        message:"Status changed",
        status:201,
        error:""
      }
      res.status(obj.status).send(obj)
     })
      
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