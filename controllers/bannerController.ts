import { Express,Request,Response } from "express";
import bannerModel from "../models/bannerModel";



export const AddBanner=async(req:Request,res:Response)=>{
    try {
        interface Obj{
            message:string,
            status:number;
            error:string;
        }
        let obj:Obj={
            message:"",
            status:0,
            error:""
        }
        console.log(req.body);
        console.log(req.file);
        if(req.body.title&&req.body.subTitle&&req.file){
             new bannerModel({
                title : req.body.title,
                subTitle : req.body.subTitle,
                image :req.file.filename
            }).save().then((data)=>{
                console.log(data);
                obj={
                    message:"Banner added successfully",
                    status:200,
                    error:""
                }
                res.status(obj.status).send(obj)
            })
        }else{
            obj={
                message:"",
                status:404,
                error:"Request data not found"
            }
            res.status(obj.status).send(obj)
        }
        
        
    } catch (error) {
        console.error(error);
    }
}
export const banners=async(req:Request,res:Response)=>{
    try {
        interface Obj{
            message:string;
            status:number;
            error:string;
            bannerData?:{}
        }
        let obj:Obj={
            message:"",
            status:0,
            error:""
        }
        const bannerData = await bannerModel.find()
        if(bannerData){
            obj={
                message:"Data fetched successfully",
                status:200,
                error:"",
                bannerData
            }
            res.status(obj.status).send(obj)
        }else{
            obj={
                message:"",
                status:501,
                error:"Banner data not found"
            }
            res.status(obj.status).send(obj)
        }
    } catch (error) {
        console.error(error);
    }
}