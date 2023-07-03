import {Request ,Response ,NextFunction} from "express"
import userModel from "../models/userModel";

export const postUserSignup =async(req:Request,res:Response)=>{
    try {
        type userResponse={
            message:string;
            status:number;
            error:string;
            loggedIn:boolean
        }
        let object:userResponse={
            message:"",
            status:0,
            error:"",
            loggedIn:false
        }
        const {fName,lName,Mobile,email,password} =req.body;

        const UserData= await userModel.findOne({email:email})
        console.log(UserData);
        
        if(UserData){
            object={
                message:"",
                status:500 ,
                error:'user Already exists',
                loggedIn:false
            }
            res.send(object)
        }else{

            await new userModel({
                firstName:fName,
                lastName:lName,
                email:email,
            mobile:Mobile,
            password:password
        }).save().then(()=>{
            console.log("success");
            
            res.send({message:"Success"})
        })
    }
        
    } catch (error) {
        console.error(error);
    }
}


export const getAllUser=async(req:Request,res:Response)=>{
    try {
        const {} = req.body;
        
    } catch (error) {
        
    }
}