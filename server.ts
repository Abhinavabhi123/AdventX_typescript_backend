declare module 'express';
import express, { Express, Request, Response } from "express";
import * as dotenv from 'dotenv';
import cors from "cors"

import userRoute from "./routes/userRoutes"
import adminRoute from "./routes/adminRoutes"

import connectDB from "./db";

dotenv.config();
const app: Express = express();
const Port = process.env.PORT || 3000 ||5000;

connectDB()
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    methods:process.env.CORS_METHODS,
    credentials:true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/",userRoute)
app.use("/admin",adminRoute)

app.listen(Port, () => console.log(`⚡️[Server] : Server is running at http://localhost:${Port}`));
