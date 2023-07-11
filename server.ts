declare module 'express';
import express, { Express, Request, Response } from "express";
import * as dotenv from 'dotenv';
import cors from "cors"
import morgan from "morgan"
import path from "path";

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

app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({limit:'50mb', extended: false }));
app.use('/uploads',express.static('uploads'))
app.use(express.static(path.join(__dirname,'public')))


app.use(morgan("dev"))

app.use("/",userRoute)

app.use("/admin",adminRoute)

app.listen(Port, () => console.log(`⚡️[Server] : Server is running at http://localhost:${Port}`));
