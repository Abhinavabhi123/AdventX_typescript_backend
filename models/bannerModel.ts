import { Document, Schema,SchemaType,model} from "mongoose";

interface Banner extends Document{
    title: string;
    subTitle:string;
    image : string ;
    status:boolean;
}

const bannerSchema = new Schema<Banner>({
    title:{
        type: String,
        required:true
    },
    subTitle:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default: true
    }
},{
    timestamps:true
})

export default model<Banner>("Banner",bannerSchema)