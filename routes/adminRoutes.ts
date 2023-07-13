import { Router,Request } from "express";
const router = Router()
import multer,{FileFilterCallback} from "multer"

export const storage =multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./public/uploads/");
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+file.originalname)
    }
});


export const fileFilter = (req: Request, file:Express.Multer.File, cb: FileFilterCallback)=>{
    if(file.mimetype ==="image/jpeg" || file.mimetype === 'image/jpg'|| file.mimetype === 'image/png'){
        cb(null,true)
    }else{
        cb(null,false)
    }
}

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 100,
  },
  fileFilter: fileFilter,
});
import {postAdminLogin,getAllUser,blockUser,singleUser} from "../controllers/admincontroller"
import {getCommunityUsers,getComUser,createCommunity,communities} from "../controllers/communityController"

router.post("/AdminLogin",postAdminLogin)
router.get("/getAllUser",getAllUser)
router.post("/blockUser",blockUser)
router.get("/singleUser",singleUser)
router.get("/communities",communities)
router.get("/getCommunityUsers",getCommunityUsers)
router.get("/getComUser",getComUser)


router.post("/createCommunity",upload.single("image"),createCommunity)

export default router