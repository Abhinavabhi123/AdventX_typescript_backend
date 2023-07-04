import { Request, Response, NextFunction } from "express";
import adminModel from "../models/adminModel";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";

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
        status: 401,
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
      };
      return res.status(object.status).send(object);
    }else{
        object = {
            access: true,
            message: "Access Granted",
            error: "",
            status: 200,
          };
        res.status(object.status).send(object)
    }
  } catch (error) {
    console.error(error);
  }
};
