declare module 'express';
import express, { Express, Request, Response } from "express";
import * as dotenv from 'dotenv';
import cors from "cors"

import connectDB from "./db";

dotenv.config();
const app: Express = express();

connectDB()
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    methods:process.env.CORS_METHODS,
    credentials:true
}))

const Port = process.env.PORT || 3000 ||5000;

app.get("/", (req, res) => {
  res.send(`Express + Typescript Server`);
});

app.listen(Port, () => console.log(`⚡️[Server] : Server is running at http://localhost:${Port}`));
