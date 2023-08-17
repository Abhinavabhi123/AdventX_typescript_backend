import { Request, Response, NextFunction } from "express";
import userModel from "../models/userModel";
import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
import stripe from "stripe";
dotenv.config();
import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import eventModel from "../models/eventModel";

const secret_strip = <string>process.env.STRIPE_SECRET_KEY;

const stripes = new stripe(secret_strip, { apiVersion: "2022-11-15" });
const secretKey: string = process.env.USER_JWT_SECRET || "";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,

  auth: {
    user:process.env.SMTP_EMAIL ,
    pass:process.env.SMTP_PASSWORD,
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
          from: process.env.SMTP_EMAIL ,
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
    res.status(500).json({ error: 'Internal Server Error' });
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
    res.status(500).json({ error: 'Internal Server Error' });
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
    console.log(req.body,"useeee");
    if(email&&password){
      
    const userData: any = await userModel.findOne({ email: email });
    
    if (userData) {
      const grantAccess: boolean = await compareHash(
        password,
        userData.password
      );
      if (grantAccess) {
        console.log(userData[0]?.status, "userddd");
        if (userData?.status === true) {
          console.log("ivide");

          const jwtToken = jwt.sign(
            {
              _id: userData?._id,
              name: userData?.firstName,
              is_prime: userData?.primeMember,
              status: userData?.status,
              email: userData.email,
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
              httpOnly: false,
              sameSite: "strict",
            })
            .send(object);
        } else {
          object = {
            message: "",
            status: 404,
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
            status: 404,
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
        status: 404,
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
  }else{
    object={
      message:'',
      status:404,
      error:"something went wrong",
      loggedIn: false,
      userData: {
        firstName: undefined,
        lastName: undefined,
        email: undefined,
      },
    }
    res.status(object.status).send(object)
  }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
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
        from: process.env.SMTP_EMAIL ,
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
    res.status(500).json({ error: 'Internal Server Error' });
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
    res.status(500).json({ error: 'Internal Server Error' });
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
      const userData = await userModel.findOne({email:checkEmail})
      if(userData){

      
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
    }else{
      obj = {
        message: "Something went wrong",
        status: 404,
        error: "",
      };
      res.status(obj.status).send(obj);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
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
    if (paymentIntent)
      // console.log(paymentIntent.url,"ojojoj");

      res.send({
        clientSecret: paymentIntent.client_secret,
      });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
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
    res.status(500).json({ error: 'Internal Server Error' });
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
    res.status(500).json({ error: 'Internal Server Error' });
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
                message: "Profile changed successfully",
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
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
export const postAddress = async (req: Request, res: Response) => {
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
    const { id } = req.body.userId;
    const { houseName, locality, area, district, state, zip } = req.body;
    const zipCode = Number(zip);
    if (id) {
      const userData = await userModel.findOne({ _id: id });
      if (userData) {
        await userModel
          .updateOne(
            { _id: id },
            {
              $set: {
                address: {
                  houseName,
                  locality,
                  area,
                  district,
                  state,
                  zipCode,
                },
              },
            }
          )
          .then(() => {
            obj = {
              message: "Address added Successfully",
              status: 200,
              error: "",
            };
            res.status(obj.status).send(obj);
          });
      } else {
        obj = {
          message: "",
          status: 404,
          error: "User not found!",
        };
        res.status(obj.status).send(obj);
      }
    } else {
      obj = {
        message: "",
        status: 404,
        error: "User not found!",
      };
      res.status(obj.status).send(obj);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const userDetails = async (req: Request, res: Response) => {
  try {
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
    console.log(req.params, "params");
    const { id } = req.params;
    if (id) {
      const userData = await userModel.findOne({ _id: id });
      if (userData) {
        obj = {
          message: "data fetched successfully",
          status: 200,
          error: "",
          userData,
        };
        res.status(obj.status).send(obj);
      } else {
        obj = {
          message: "",
          status: 404,
          error: `user not found with this id ${id}`,
        };
        res.status(obj.status).send(obj);
      }
    } else {
      obj = {
        message: "",
        status: 404,
        error: "The id is not present",
      };
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const webhook = async (req: Request, res: Response) => {
  console.log("Success payment");

  const sig = req.headers["stripe-signature"];
  let event;
  try {
    if (typeof sig !== "string") {
      return;
    }

    const secret: string | undefined = process.env.END_POINT_SECRET;
    if (secret === undefined) {
      return;
    }

    const Stripe = new stripe(secret_strip, { apiVersion: "2022-11-15" });

    let payload: Buffer | string;

    if (typeof req.body === "string" || Buffer.isBuffer(req.body)) {
      payload = req.body;
    } else {
      payload = JSON.stringify(req.body);
    }

    console.log(sig, "oppppppooo");
    console.log(payload, "itgkjgakjdsg");

    event = stripes.webhooks.constructEvent(payload, sig, secret);

  } catch (error) {
   console.error(error);
  }
  if (event) {
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        console.log("kitti", paymentIntentSucceeded);

        res.status(200);

        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }
};
export const userLicense = async (req: Request, res: Response) => {
  try {
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
    const { id } = req.query;

    if (id) {
      const userData = await userModel.findOne(
        { _id: id },
        { license: 1, _id: 0 }
      );
      if (userData) {
        obj = {
          message: "User data fetched successfully",
          status: 200,
          error: "",
          userData,
        };
        res.status(obj.status).send(obj);
      } else {
        obj = {
          message: "",
          status: 404,
          error: "User Records not found",
        };
        res.status(obj.status).send(obj);
      }
    } else {
      obj = {
        message: "",
        status: 404,
        error: "User not found",
      };
      res.status(obj.status).send(obj);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
export const addLicense = async (req: Request, res: Response) => {
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
    console.log("Ethi");

    const { Number, lExpiry, userId } = req.body;
    const userData = await userModel.findOne({ _id: userId });
    if (!userData) {
      obj = {
        message: "",
        status: 404,
        error: "user records not found",
      };
      res.status(obj.status).send(obj);
    } else {
      if (req.body && req.file) {
        await userModel
          .updateOne(
            { _id: userId },
            {
              $set: {
                license: {
                  licenseNumber: Number,
                  ExpiryDate: lExpiry,
                  image: req.file.filename,
                },
              },
            }
          )
          .then(() => {
            obj = {
              message: "License added successfully",
              status: 200,
              error: "",
            };
            res.status(obj.status).send(obj);
          });
      }
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
export const editLicense = async (req: Request, res: Response) => {
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
    const { Number, lExpiry, userId } = req.body;
    const userData = await userModel.findOne({ _id: userId });
    if (!userData) {
      obj = {
        message: "",
        status: 404,
        error: "user records not found",
      };
      res.status(obj.status).send(obj);
    } else {
      if (req.body && req.file) {
        await userModel
          .updateOne(
            { _id: userId },
            {
              $set: {
                license: {
                  licenseNumber: Number,
                  ExpiryDate: lExpiry,
                  image: req.file.filename,
                },
              },
            }
          )
          .then(() => {
            if (userData?.license?.image) {
              const imageUrl: string = userData?.license?.image as string;
              const imagePath = path.join(__dirname, "../public/License");
              const delImagePath = path.join(imagePath, imageUrl);
              fs.unlink(delImagePath, (err) => {
                if (err) {
                  console.error(err);
                } else {
                  console.log(`LIcense image data removed successfully`);
                }
              });
            }
            obj = {
              message: "License added successfully",
              status: 200,
              error: "",
            };
            res.status(obj.status).send(obj);
          });
      }
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
export const create_checkout_session = async (req: Request, res: Response) => {
  try {
    const { userId, amount } = req.body;
    console.log(process.env.CLIENT_DOMAIN);

    //create checkout session with stripe api
    const Stripe = new stripe(secret_strip, { apiVersion: "2022-11-15" });
    
    console.log(userId, "oopopopkop");

    const session = await stripes.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Premium Plan",
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        userId,
      },
      success_url: `${process.env.CLIENT_DOMAIN}/subscribe/success?_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_DOMAIN}/subscribe/cancel`,
    });
    console.log(session, "seddddddd");

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
export const getUserEvent = async (req: Request, res: Response) => {
  try {
    interface Obj {
      message: string;
      status: number;
      error: string;
      eventData?: {};
    }
    let obj: Obj = {
      message: "",
      status: 0,
      error: "",
    };
    const { id } = req.query;
    if (id) {
      const eventData = await eventModel.findOne({ _id: id });
      if (eventData) {
        obj = {
          message: "Data fetched successfully",
          status: 200,
          error: "",
          eventData,
        };
        res.status(obj.status).send(obj);
      } else {
        obj = {
          message: "",
          status: 404,
          error: `No event data found at id${id}`,
        };
        res.status(obj.status).send(obj);
      }
    } else {
      obj = {
        message: "",
        status: 404,
        error: `can't find the event id`,
      };
      res.status(obj.status).send(obj);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const addPrimeUser = async (req: Request, res: Response) => {
  try {
    interface Obj {
      message: string;
      status: number;
      error: string;
      jwtToken?: string;
    }
    let obj: Obj = {
      message: "",
      status: 0,
      error: "",
    };
    console.log("bodyyy", req.body);
    const { _id, userId } = req.body;
    if (userId && _id) {
      const userData = await userModel.findOne({ _id: userId });
      if (userData) {
        await userModel
          .updateOne(
            { _id: userId },
            { $set: { paymentId: _id, primeMember: true } }
          )
          .then((data) => {
            console.log(data, "datataaa");
            (async () => {
              const user: any = await userModel.findOne({ _id: userId });
              if (user) {
                const jwtToken = jwt.sign(
                  {
                    _id: user?._id,
                    name: user?.firstName,
                    is_prime: user?.primeMember,
                    status: user?.status,
                    email: user.email,
                  },
                  secretKey,
                  { expiresIn: "30d" }
                );
                console.log(jwtToken,"llloooo");
                
                obj = {
                  message: "success",
                  status: 200,
                  error: "",
                  jwtToken
                };
                res.status(obj.status).send(obj);
              }
            })();
          });
      } else {  
        obj = {
          message: "",
          status: 404,
          error: `user with id ${userId} not found`,
        };
        res.status(obj.status).send(obj);
      }
    } else {
      obj = {
        message: "Please provide userId and payment Id in body.",
        status: 404,
        error: "Invalid Request",
      };
      res.status(obj.status).send(obj);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
