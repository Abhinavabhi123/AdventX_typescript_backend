declare module 'express';
import express, { Express, Request, Response } from "express";
import * as dotenv from 'dotenv';
import cors from "cors"
import multer,{FileFilterCallback} from "multer"
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

export const storage =multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./uploads/");
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+file.originalname)
    }
});


export const fileFilter = (req: Request, file:Express.Multer.File, cb: FileFilterCallback)=>{
    if(file.mimetype ==="image/jpeg" || file.mimetype === 'image/jpg'){
        cb(null,true)
    }else{
        cb(null,false)
    }
}

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

app.use("/",userRoute)

app.use("/admin",adminRoute)

app.listen(Port, () => console.log(`⚡️[Server] : Server is running at http://localhost:${Port}`));
