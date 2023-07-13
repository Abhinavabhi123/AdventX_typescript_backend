import { Request, Response, NextFunction } from "express";
import userModel from "../models/userModel";
import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();
import jwt, { Secret, JwtPayload } from "jsonwebtoken";

import bcrypt from "bcrypt";

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
    const userData = await userModel.find({ email: email });

    if (userData) {
      const grantAccess: boolean = await compareHash(
        password,
        userData[0].password
      );
      if (grantAccess) {
        const jwtToken = jwt.sign(
          { _id: userData[0]?._id, name: userData[0]?.firstName,is_prime:userData[0]?.primeMember,status:userData[0]?.status,email:userData[0].email},
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
        res.status(object.status)
        .cookie("user", jwtToken, {
          expires: new Date(Date.now() + 3600 * 1000),
          httpOnly: true,
          sameSite: "strict",
        })
        .send(object);

        
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
