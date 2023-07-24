import express,{ Request,Response,NextFunction } from "express";
import  Jwt,{JwtPayload,Secret}  from "jsonwebtoken";
import userModel from "../models/userModel";
const secret :string |undefined=process.env.USER_JWT_SECRET ;

interface DecodedToken extends JwtPayload {
    email: string | null;
  }

const userAuth = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const token:string|undefined = req.headers.authorization
        if(token){
            const decoded:DecodedToken = Jwt.verify(token,secret as Secret)as DecodedToken

            if(decoded){
                const data = await userModel.findOne({email:decoded?.email})
                if(data){
                    next()
                }else{
                    return res.status(401).send("Unauthorized access");
                }
            }else{
                return res.status(401).send("Unauthorized access");
            }
        }
    } catch (error) {
        console.error(error);
    }
}

export default userAuth