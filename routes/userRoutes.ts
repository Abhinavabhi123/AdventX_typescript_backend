import {Router} from "express"

const router =Router()
import {postUserSignup,userLogin,sendOpt,postForget,postOtp,changePass,addPayment} from  "../controllers/userController"
import {getAllUpEvents,getEvent,getAllEvents} from "../controllers/eventController"


router.get("/getAllUpEvents",getAllUpEvents)
router.get("/getEvent",getEvent)
router.get("/getAllEvents",getAllEvents)


router.post("/postSignup",postUserSignup)
router.post("/userLogin",userLogin)
router.post("/sendOpt",sendOpt)
router.post("/postForget",postForget)
router.post("/postOtp",postOtp)
router.post("/changePass",changePass);
router.post ("/addPayment",addPayment)

export default router