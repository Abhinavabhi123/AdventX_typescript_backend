import {Router} from "express"

const router =Router()
import {postUserSignup,userLogin,sendOpt} from  "../controllers/userController"


router.post("/postSignup",postUserSignup)
router.post("/userLogin",userLogin)
router.post("/sendOpt",sendOpt)

export default router