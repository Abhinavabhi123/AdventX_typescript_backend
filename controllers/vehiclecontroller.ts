import { Request, Response, NextFunction } from "express";
import userModel from "../models/userModel";
import vehicleModel from "../models/vehicleModel";
import fs from "fs"
import path from "path";



export const addVehicle = async (req: Request, res: Response) => {
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
      const { vNumber,vType,fuelType,vName,vWheels,vOwner,id}=req.body;
      if(id){
        const userData = await userModel.findOne({_id:id})
        if(userData){
          const files:any = req.files;
          if(files){
            let vehicleImages :string[] =[]
            for (const i of Object.keys(files)) {
              const image:string = files[i].filename
              console.log(image);
              vehicleImages.push(image)
            }
            await new vehicleModel({
                userId:id,
                vehicleNumber:vNumber,
                vehicleName:vName,
                vehicleType:vType,
                wheelCount:vWheels,
                fuelType,
                ownerName:vOwner,
                images:vehicleImages
            }).save().then(async(data)=>{
                console.log(data,"dataaaaa");
               await userModel.updateOne({_id:id},{$push:{vehicles:{vehicleId:data?._id}}}).then(()=>{
                    obj={
                        message:"vehicle added successfully",
                        status:200,
                        error:''
                    }
                    res.status(obj.status).send(obj)
                })
                
            })
      }else{
        obj={
            message:"",
            status:404,
            error:"images not found"
        }
        res.status(obj.status).send(obj)
      }
        }else{
            obj={
                message:"",
                status:404,
                error:'User Not Found'
            }
            res.status(obj.status).send(obj)
        }
      }else{
        obj={
            message:"",
            status:404,
            error:"userId not found"
        }
        res.status(obj.status).send(obj)
      }
  
    } catch (error) {
      console.error(error);
    }
  };

  export const getAllVehicles=async(req:Request,res:Response)=>{
    try {
        interface Obj{
            message:string;
            status:number;
            error:string;
            vehicleData?:{}
        }
        let obj:Obj={
            message:'',
            status:0,
            error:""
        }
        const {id} = req.params
        if(id){
            const userData = await userModel.findOne({ _id: id }, { vehicles: 1, _id: 0 })
           
            if(userData){
             const vehicleData = await vehicleModel.find({userId:id})
             console.log(vehicleData,"kikgig");
             if(vehicleData){
                obj={
                    message:`Fetched vehicle data`,
                    status:200,
                    error:"",
                    vehicleData
                }
                res.status(obj.status).send(obj)
             }else{
                obj={
                    message:"",
                    status:404,
                    error:"No vehicle data"
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
        }else{ 
            obj={
                message:"",
                status:404,
                error:"vehicle not found"
            }
            res.status(obj.status).send(obj)
        }
        
    } catch (error) {
        console.error(error);
    }
  }

  export const deleteVehicle=async(req:Request,res:Response)=>{
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
        const {id}=req.params;
    if(id){
        const vehicleData = await vehicleModel.findOne({_id:id})
        if(vehicleData){
            await vehicleModel.deleteOne({_id:id}).then(async(data)=>{
                console.log(vehicleData?.userId,'kdkdkdd');
                const userData = await userModel.updateOne({_id:vehicleData?.userId},{$pull:{vehicles:{vehicleId:id}}}).then(()=>{
                    console.log(vehicleData.images);
                    for(let i=0;i<vehicleData.images.length;i++){
                       
                        const imagePath = path.join(__dirname, "../public/Vehicles");
                        const delImagePath = path.join(imagePath,vehicleData?.images[i]);
                        fs.unlink(delImagePath, (err) => {
                          if (err) {
                            console.error(err);
                          } else {
                            console.log(`LIcense image data removed successfully`);
                          }
                        });
                    }
                    console.log("deleted");
                    obj={
                        message:"vehicle deleted successfully",
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
                error:"vehicle data not found"
            }
            res.status(obj.status).send(obj)
        }
    }else{
        obj={
            message:"",
            status:404,
            error:'something went wrong'
        }
        res.status(obj.status).send(obj)
    }
        
    } catch (error) {
        console.error(error);
    }
  }