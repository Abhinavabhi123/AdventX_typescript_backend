import { Router } from "express";
const router = Router()

import {postAdminLogin,getAllUser,blockUser,singleUser} from "../controllers/admincontroller"

router.post("/AdminLogin",postAdminLogin)
router.get("/getAllUser",getAllUser)
router.post("/blockUser",blockUser)
router.get("/singleUser",singleUser)



export default router