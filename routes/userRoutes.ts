import { Router,Request } from "express";
import multer, { FileFilterCallback } from "multer";

const router = Router();

export const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/UserImage/");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  });
  export const vStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/Vehicles/");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  });
  export const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  export const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 100,
    },
    fileFilter: fileFilter,
  });
  const vUploads = multer({
    storage:vStorage,
    limits:{
      fieldSize:1024*1024*100
    },
  })
import {
  postUserSignup,
  userLogin,
  sendOpt,
  postForget,
  postOtp,
  changePass,
  addPayment,
  getUserProfile,
  userImage,
  postUserDetails,
  postAddress,
  userDetails,
  addVehicle
} from "../controllers/userController";
import {
  getAllUpEvents,
  getEvent,
  getAllEvents,
} from "../controllers/eventController";
import {userCommunities} from "../controllers/communityController"
import userAuth from "../Middleware/checkUserAuth";

router.get("/getAllUpEvents", getAllUpEvents);
router.get("/getEvent", getEvent);
router.get("/getAllEvents", getAllEvents);
router.get("/getUserProfile/:id",userAuth, getUserProfile);
router.get("/userDetails/:id",userAuth,userDetails)
router.get("/userCommunities/:id",userAuth,userCommunities)

router.post("/postSignup", postUserSignup);
router.post("/userLogin", userLogin);
router.post("/sendOpt", sendOpt);
router.post("/postForget", postForget);
router.post("/postOtp", postOtp);
router.post("/changePass", changePass);
router.post("/addPayment", addPayment);
router.post("/postUserDetails",userAuth,postUserDetails)
router.post("/postAddress",userAuth,postAddress)

router.post("/addVehicle",userAuth,vUploads.array("image"),addVehicle)
router.post('/userImage',userAuth,upload.single("images"),userImage)

export default router;
