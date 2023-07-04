import {Router} from "express"

const router =Router()
import {postUserSignup,getAllUser,sendOpt} from  "../controllers/userController"


router.post("/postSignup",postUserSignup)
router.post("/getUsers",getAllUser)
router.post("/sendOpt",sendOpt)

export default router