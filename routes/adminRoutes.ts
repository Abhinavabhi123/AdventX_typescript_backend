import { Router } from "express";
const router = Router()

import {postAdminLogin,getAllUser,blockUser,singleUser} from "../controllers/admincontroller"
import {getCommunityUsers,getComUser} from "../controllers/communityController"

router.post("/AdminLogin",postAdminLogin)
router.get("/getAllUser",getAllUser)
router.post("/blockUser",blockUser)
router.get("/singleUser",singleUser)
router.get("/getCommunityUsers",getCommunityUsers)
router.get("/getComUser",getComUser)

export default router