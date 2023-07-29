import express, { Router,Request } from "express";
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
  export const LStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/License/");
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
    limits: {
      fileSize: 1024 * 1024 * 100,
    },
    fileFilter: fileFilter,
  })
  const LUploads = multer({
    storage:LStorage,
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
  addVehicle,
  webhook,
  addLicense,
  userLicense,
  editLicense,
  create_checkout_session,
  getUserEvent
} from "../controllers/userController";
import {
  getAllUpEvents,
  getEvent,
  getAllEvents,
} from "../controllers/eventController";
import {userCommunities} from "../controllers/communityController"
import {getUserBanner}from "../controllers/bannerController"
import userAuth from "../Middleware/checkUserAuth";

router.get("/getAllUpEvents", getAllUpEvents);
router.get("/getEvent", getEvent);
router.get("/getAllEvents", getAllEvents);
router.get("/getUserProfile/:id",userAuth, getUserProfile);
router.get("/userDetails/:id",userAuth,userDetails)
router.get("/userCommunities/:id",userAuth,userCommunities)
router.get("/userLicense",userAuth,userLicense)
router.get("/getUserEvent",getUserEvent)
router.get("/getBanner",getUserBanner)

router.post("/postSignup", postUserSignup);
router.post("/userLogin", userLogin);
router.post("/sendOpt", sendOpt);
router.post("/postForget", postForget);
router.post("/postOtp", postOtp);
router.post("/changePass", changePass);
router.post("/addPayment", addPayment);
router.post("/postUserDetails",userAuth,postUserDetails)
router.post("/postAddress",userAuth,postAddress)
router.post("/webhook",express.raw({type:'application/json'}),webhook)
// 
router.post("/create-checkout-session",userAuth,create_checkout_session)
// 

router.post("/addVehicle",userAuth,vUploads.array("array",3),addVehicle)
router.post('/userImage',userAuth,upload.single("images"),userImage)
router.post("/addLicense",userAuth,LUploads.single("image"),addLicense)
router.post("/editLicense",userAuth,LUploads.single("image"),editLicense)

export default router;
