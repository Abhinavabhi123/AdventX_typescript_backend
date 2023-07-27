import { Request, Response, NextFunction } from "express";
import userModel from "../models/userModel";
import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
import stripe from "stripe";
dotenv.config();
import jwt, { Secret, JwtPayload } from "jsonwebtoken";

import bcrypt from "bcrypt";
import { log } from "console";

const secret_strip = <string>process.env.STRIPE_SECRET_KEY;

const stripes = new stripe(secret_strip, { apiVersion: "2022-11-15" });
const secretKey: string = process.env.USER_JWT_SECRET || "";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,

  auth: {
    user: "adventx.dev@gmail.com",
    pass: "lpfsewdiqwkpqdln",
  },
});
// const OTP: number = Math.floor(Math.random() * 1000000);
let otp = Math.random() * 1000000;
const OTP: number = Math.floor(otp);

// * Hashing the password
const hashPassword = async (password: string): Promise<string> => {
  const saltValue: number = 10;
  try {
    const hashedPassword = await bcrypt.hash(password, saltValue);
    return hashedPassword;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//* comparing the hashed password
const compareHash = async (
  password: string,
  hashPass: string
): Promise<boolean> => {
  try {
    const match: boolean = await bcrypt.compare(password, hashPass);
    return match;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const sendOpt = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (email) {
      const userData = await userModel.findOne({ email: email });
      console.log(userData);
      if (userData) {
        return res
          .status(401)
          .send({ message: "User already exists, try another email" });
      } else {
        var mailOptions = {
          from: "adventx.dev@gmail.com",
          to: email,
          subject: "OTP for Signup is: ",
          html:
            "<h3>OTP for account verification is </h3>" +
            "<h1 style='font-weight:bold;'>" +
            OTP +
            "</h1>", // html body
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          res.status(200).send({ message: "success" });
        });
      }
    } else {
      res.status(500).send({ message: "No email found" });
    }
  } catch (error) {
    console.error(error);
  }
};

export const postUserSignup = async (req: Request, res: Response) => {
  try {
    type userResponse = {
      message: string;
      status: number;
      error: string;
    };
    let object: userResponse = {
      message: "",
      status: 0,
      error: "",
    };
    console.log(req.body);
    const { fName, lName, Mobile, email, password, otp } = req.body;
    if (OTP === otp) {
      console.log("otp same");
    }
    const hashedPass = await hashPassword(password);

    const UserData = await userModel.findOne({ email: email });

    if (UserData) {
      object = {
        message: "",
        status: 500,
        error: "user Already exists",
      };
      res.send(object);
    } else {
      await new userModel({
        firstName: fName,
        lastName: lName,
        email: email,
        mobile: Mobile,
        password: hashedPass,
      })
        .save()
        .then(() => {
          object = {
            message: "Email Verified",
            status: 200,
            error: "",
          };
          console.log("success");

          res.status(object.status).send(object);
        });
    }
  } catch (error) {
    console.error(error);
  }
};

export const userLogin = async (req: Request, res: Response) => {
  try {
    type objResponse = {
      message: string;
      status: number;
      error: string;
      loggedIn: boolean;
      userData: {
        firstName?: string;
        lastName?: string;
        email?: string;
      };
      jwtToken?: string;
    };
    let object: objResponse = {
      message: "",
      status: 0,
      error: "",
      loggedIn: false,
      userData: {},
    };

    const { email, password } = req.body;
    const userData:any = await userModel.find({ email: email });

    if (userData) {
      const grantAccess: boolean = await compareHash(
        password,
        userData[0].password
      );
      if (grantAccess) {
        console.log(userData[0]?.status,"userddd");
        if(userData[0]?.status===true){

        
        console.log("ivide");
        
        const jwtToken = jwt.sign(
          {
            _id: userData[0]?._id,
            name: userData[0]?.firstName,
            is_prime: userData[0]?.primeMember,
            status: userData[0]?.status,
            email: userData[0].email,
          },
          secretKey,
          { expiresIn: "30d" }
        );

        console.log("Access granted and token created");

        object = {
          message: "Access granted",
          status: 200,
          error: "",
          loggedIn: true,
          userData: {
            firstName: userData[0]?.firstName,
            lastName: userData[0]?.lastName,
            email: userData[0]?.email,
          },
          jwtToken,
        };
        res
          .status(object.status)
          .cookie("user", jwtToken, {
            expires: new Date(Date.now() + 3600 * 1000),
            httpOnly: true,
            sameSite: "strict",
          })
          .send(object);
        }else{
          object = {
            message: "",
            status: 404 ,
            error: "You Are Blocked by Admin",
            loggedIn: false,
            userData: {
              firstName: undefined,
              lastName: undefined,
              email: undefined,
            },
          };
          res.status(object.status).send(object);
        }
      } else {
        {
          object = {
            message: "",
            status: 500 ,
            error: "Password not matching",
            loggedIn: false,
            userData: {
              firstName: undefined,
              lastName: undefined,
              email: undefined,
            },
          };
          res.status(object.status).send(object);
        }
      }
    } else {
      object = {
        message: "",
        status: 500,
        error: "email not matching",
        loggedIn: false,
        userData: {
          firstName: undefined,
          lastName: undefined,
          email: undefined,
        },
      };
      res.status(object.status).send(object);
    }
  } catch (error) {
    console.error(error);
  }
};

export const postForget = async (req: Request, res: Response) => {
  try {
    type Obj = {
      message: string;
      status: number;
      error: string;
      email?: string;
    };
    let obj: Obj = {
      message: "",
      status: 0,
      error: "",
      email: "",
    };
    console.log(req.body);

    const { email } = req.body;

    const userData = await userModel.findOne({ email: email });
    if (userData) {
      var mailOptions = {
        from: "adventx.dev@gmail.com",
        to: email,
        subject: "OTP for Signup is: ",
        html:
          "<h3>OTP for Reset password is </h3>" +
          "<h1 style='font-weight:bold;'>" +
          OTP +
          "</h1>", // html body
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log(OTP, "Sended Otp is");

        obj = {
          message: "Success",
          status: 200,
          error: "",
          email: userData.email,
        };
        res.status(obj.status).send(obj);
      });
    } else {
      obj = {
        message: "",
        status: 401,
        error: "Email Not match",
      };
      res.status(obj.status).send(obj);
    }
  } catch (error) {
    console.error(error);
  }
};

export const postOtp = (req: Request, res: Response) => {
  try {
    interface Obj {
      message: string;
      status: number;
      error: string;
    }
    let obj: Obj = {
      message: "",
      status: 0,
      error: "",
    };
    console.log(req.body);

    const { enteredOtp } = req.body;
    console.log(enteredOtp);
    if (enteredOtp === OTP) {
      console.log("Otp Success");

      obj = {
        message: "Otp matching",
        status: 200,
        error: "",
      };
      res.status(obj.status).send(obj);
    } else {
      obj = {
        message: "",
        status: 401,
        error: "Invalid otp",
      };
      res.status(obj.status).send(obj);
    }
  } catch (error) {
    console.error(error);
  }
};

export const changePass = async (req: Request, res: Response) => {
  try {
    interface Obj {
      message: string;
      status: number;
      error: string;
    }
    let obj: Obj = {
      message: "",
      status: 0,
      error: "",
    };
    const { checkEmail, password }: { checkEmail: string; password: string } =
      req.body;
    const hashedPass = await hashPassword(password);
    console.log(hashedPass);

    await userModel
      .updateOne({ email: checkEmail }, { $set: { password: hashedPass } })
      .then((data) => {
        obj = {
          message: "Password Changed",
          status: 200,
          error: "",
        };
        res.status(obj.status).send(obj);
      });
  } catch (error) {
    console.error(error);
  }
};

export const addPayment = async (req: Request, res: Response) => {
  try {
    const { id, amount } = req.body;

    const paymentIntent = await stripes.paymentIntents.create({
      amount,
      currency: "inr",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: id,
      },
    });
    console.log(paymentIntent, "success payment");
    if(paymentIntent)
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error(error);
  }
};
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    interface Obj {
      message: string;
      status: number;
      error: string;
      userData?: {};
    }
    let obj: Obj = {
      message: "",
      status: 0,
      error: "",
    };
    if (id) {
      const userData = await userModel.findOne({ _id: id });
      if (userData) {
        obj = {
          message: "Data fetched successfully",
          status: 200,
          error: "",
          userData,
        };
        res.status(obj.status).send(obj);
      } else {
        obj = {
          message: "",
          status: 404,
          error: "User document not found",
        };
        res.status(obj.status).send(obj);
      }
    } else {
      obj = {
        message: "",
        status: 404,
        error: "Id not found",
      };
      res.status(obj.status).send(obj);
    }
  } catch (error) {
    console.error(error);
  }
};
export const userImage = async (req: Request, res: Response) => {
  try {
    interface Obj {
      message: string;
      status: number;
      error: string;
    }
    let obj: Obj = {
      message: "",
      status: 0,
      error: "",
    };
    const { id } = req.body;
    if (id) {
      const userData = await userModel.findOne({ _id: id });
      if (userData) {
        if (req.file) {
          const fileName = req.file.filename;
          await userModel
            .updateOne({ _id: id }, { $set: { image: fileName } })
            .then(() => {
              obj = {
                message: "Image Updated successfully",
                status: 200,
                error: "",
              };
              res.status(obj.status).send(obj);
            });
        } else {
          obj = {
            message: "",
            status: 404,
            error: "Image file not found",
          };
          res.status(obj.status).send(obj);
        }
      } else {
        obj = {
          message: "",
          status: 404,
          error: "User data not found",
        };
        res.status(obj.status).send(obj);
      }
    } else {
      obj = {
        message: "",
        status: 404,
        error: "User Id not found",
      };
      res.status(obj.status).send(obj);
    }
  } catch (error) {
    console.error(error);
  }
};
export const postUserDetails = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    interface Obj {
      message: string;
      status: number;
      error: string;
    }
    let obj: Obj = {
      message: "",
      status: 0,
      error: "",
    };

    if (req.body) {
      const { id } = req.body?.userId;
      const { firstName, lastName, number, about, height, weight, date } =
        req.body;
      const mobile = Number(number);
      const uHeight = Number(height);
      const uWeight = Number(weight);
      if (id) {
        const userData = await userModel.findOne({ _id: id });
        if (userData) {
          await userModel
            .updateOne(
              { _id: id },
              {
                $set: {
                  firstName,
                  lastName,
                  mobile,
                  about,
                  height: uHeight,
                  weight: uWeight,
                  date_of_birth: date,
                },
              }
            )
            .then(() => {
              obj = {
                message: "success",
                status: 200,
                error: "",
              };
              res.status(obj.status).send(obj);
            });
        } else {
          obj = {
            message: "",
            status: 404,
            error: "User Data not found",
          };
          res.status(obj.status).send(obj);
        }
      } else {
        obj = {
          message: "",
          status: 404,
          error: "Please Provide the userId",
        };
        res.status(obj.status).send(obj);
      }
    }
  } catch (error) {
    console.error(error);
  }
};
export const postAddress=async(req:Request,res:Response)=>{
  try {
    interface Obj{
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
      const{id}=req.body.userId
      const {houseName,locality,area,district,state,zip} =req.body
      const zipCode = Number(zip)
      if(id){
        const userData = await userModel.findOne({_id:id})
        if(userData){
            await userModel.updateOne({_id:id},{$set:{address:{
              houseName,
              locality,
              area,
              district,
              state,
              zipCode
            }}}).then(()=>{
              obj={
                message:"Address added Successfully",
                status:200,
                error:""
              }
              res.status(obj.status).send(obj)
            })
        }else{
          obj={
            message:"",
            status:404,
            error:"User not found!"
          }
          res.status(obj.status).send(obj)
        }
      }else{
        obj={
          message:"",
          status:404,
          error:"User not found!"
        }
        res.status(obj.status).send(obj)
      }
      
      
      
  } catch (error) {
    console.error(error);
  }
}

export const userDetails=async(req:Request,res:Response)=>{
  try {
    interface Obj{
      message:string;
      status:number;
      error:string;
      userData?:{}
    }
    let obj:Obj={
      message:"",
      status:0,
      error:""
    }
      console.log(req.params,'params');
      const {id} = req.params
      if(id){
        const userData = await userModel.findOne({_id:id})
        console.log(userData,"hhhh");
        if(userData){
          obj={
            message:"data fetched successfully",
            status:200,
            error:"",
            userData
          }
          res.status(obj.status).send(obj)
        }else{
          obj={
            message:"",
            status:404,
            error:`user not found with this id ${id}`
          }
          res.status(obj.status).send(obj)
        }
        
      }else{
        obj={
          message:"",
          status:404,
          error:"The id is not present"
        }
      }
  } catch (error) {
    console.error(error);
  }
}
export const addVehicle=async(req:Request,res:Response)=>{
  try {
    console.log(req.body);
    const array  = req.files
    console.log(array,'ooi');
    
    
  } catch (error) {
    console.error(error);
  }
}