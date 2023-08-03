declare module 'express';
import express, { Express } from "express";
import * as dotenv from 'dotenv';
import cors from "cors"
import morgan from "morgan"
import path from "path";
import cookieParser from "cookie-parser"
import { Server, Socket } from 'socket.io';

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

app.use(express.json({limit:'100mb'}));
app.use(express.urlencoded({limit:'100mb', extended:false }));
app.use('/uploads',express.static('uploads'))
app.use(express.static(path.join(__dirname,'public')))
app.use(cookieParser())
// app.use(express.raw({ type: 'application/json' }))




app.use(morgan("dev"))

app.use("/",userRoute)

app.use("/admin",adminRoute)

const server = app.listen(Port, () => console.log(`⚡️[Server] : Server is running at http://localhost:${Port}`));
const io = new Server(server)
io.on("connection",(socket:Socket)=>{
    console.log("user connected",socket.id);
    socket.on("communityChat",(community)=>{
        console.log("connected to the community",community);
        
    })

    socket.on("disconnect",()=>{
        console.log("user disconnected");
        
    })
})
