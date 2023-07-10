import {Router} from "express"

const router =Router()
import {postUserSignup,userLogin,sendOpt,postForget,postOtp,changePass} from  "../controllers/userController"


router.post("/postSignup",postUserSignup)
router.post("/userLogin",userLogin)
router.post("/sendOpt",sendOpt)
router.post("/postForget",postForget)
router.post("/postOtp",postOtp)
router.post("/changePass",changePass);

export default router