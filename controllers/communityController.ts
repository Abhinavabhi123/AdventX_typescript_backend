import { Request, Response, NextFunction } from "express";
import { ObjectId } from "mongodb";
import userModel from "../models/userModel";

export const getCommunityUsers = async (req: Request, res: Response) => {
  try {
    type Users = {
      _id: ObjectId;
    };
    const userData: (Users | null)[] = await userModel.find({
      $and: [{ status: true }, { primeMember: true }],
    });
    console.log(userData);

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

    const id = req.query;
    console.log(id);

    const userData = await userModel.findOne({ _id: id });
    if (!userData) {
      console.log("no data");
    } else {
      console.log(userData, "this is the data");
    }
  } catch (error) {
    console.error();
  }
};
