import { Router } from "express";
const router = Router()

import {postAdminLogin} from "../controllers/admincontroller"

router.post("/AdminLogin",postAdminLogin)



export default router