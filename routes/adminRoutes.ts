import { Router } from "express";
const router = Router()
import {upload} from "../server.js"


import {postAdminLogin,getAllUser,blockUser,singleUser} from "../controllers/admincontroller"
import {getCommunityUsers,getComUser,createCommunity,communities} from "../controllers/communityController"

router.post("/AdminLogin",postAdminLogin)
router.get("/getAllUser",getAllUser)
router.post("/blockUser",blockUser)
router.get("/singleUser",singleUser)
router.get("/communities",communities)
router.get("/getCommunityUsers",getCommunityUsers)
router.get("/getComUser",getComUser)


// upload.single("formData")
router.post("/createCommunity",createCommunity)

export default router