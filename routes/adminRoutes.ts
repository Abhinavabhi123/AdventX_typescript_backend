import { Router } from "express";
const router = Router()

import {postAdminLogin,getAllUser,blockUser} from "../controllers/admincontroller"

router.post("/AdminLogin",postAdminLogin)
router.get("/getAllUser",getAllUser)
router.post("/blockUser",blockUser)



export default router