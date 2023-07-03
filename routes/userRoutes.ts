import {Router} from "express"

const router =Router()
import {postUserSignup,getAllUser} from  "../controllers/userController"


router.post("/postSignup",postUserSignup)
router.post("/getUsers",getAllUser)

export default router