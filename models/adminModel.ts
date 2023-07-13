import { Document, Schema, SchemaTypes, model } from "mongoose";

interface Admin extends Document{
    email:string;
    password:string;
}

const adminSchema = new Schema<Admin>({
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase: true
    },
    password:{
        type:String,
        required:true
    }
})

export default model<Admin>("Admin",adminSchema);