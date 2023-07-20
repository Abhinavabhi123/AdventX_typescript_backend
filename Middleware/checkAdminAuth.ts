import express, { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
const secret: string | undefined = process.env.ADMIN_JWT_SECRET;
import adminModel from "../models/adminModel";

interface DecodedToken extends JwtPayload {
  email: string | null;
}

const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token: string | undefined = req.headers.authorization;
    if (token) {
      const decoded: DecodedToken = jwt.verify(
        token,
        secret as Secret
      ) as DecodedToken;
      if (decoded) {
        const data = await adminModel.findOne({ email: decoded?.email });
        if (data) {
          next();
        } else {
          return res.status(401).send("Unauthorized access");
        }
      } else {
        return res.status(401).send("Unauthorized access");
      }
    }
  } catch (error) {}
};

export default isAuth;
