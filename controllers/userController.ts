import { Request, Response, NextFunction } from "express";
import userModel from "../models/userModel";
import nodemailer from "nodemailer";

import bcrypt from "bcrypt";

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
    }else{
      res.status(500).send({message:"No email found"})
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

export const getAllUser = async (req: Request, res: Response) => {
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
    };
    let object: objResponse = {
      message: "",
      status: 0,
      error: "",
      loggedIn: false,
      userData: {},
    };

    const { email, password } = req.body;
    const users = await userModel.find();
    for (let user of users) {
      if (user.email === email) {
        const grantAccess: boolean = await compareHash(password, user.password);
        if (grantAccess) {
          object = {
            message: "Access granted",
            status: 200,
            error: "",
            loggedIn: true,
            userData: {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
            },
          };
          res.send(object);
        } else {
          {
            object = {
              message: "",
              status: 500,
              error: "password not matching",
              loggedIn: false,
              userData: {
                firstName: undefined,
                lastName: undefined,
                email: undefined,
              },
            };
            res.send(object);
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
        res.send(object);
      }
    }
  } catch (error) {
    console.error(error);
  }
};
