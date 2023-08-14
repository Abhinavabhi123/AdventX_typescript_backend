import { Router, Request } from "express";
const router = Router();
import multer, { FileFilterCallback } from "multer";


export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
export const bannerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/banners/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
export const eventStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/eventIMage/");
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
export const bannerUploads = multer({
  storage: bannerStorage,
  limits: {
    fileSize: 1024 * 1024 * 100,
  },
  fileFilter: fileFilter,
});
export const eventUploads = multer({
  storage: eventStorage,
  limits: {
    fileSize: 1024 * 1024 * 100,
  },
  fileFilter: fileFilter,
});
import {
  postAdminLogin,
  getAllUser,
  blockUser,
  singleUser,
  accounts,
  dashboardCardValues,
  primeMembers
} from "../controllers/admincontroller";
import {
  getCommunityUsers,
  getComUser,
  createCommunity,
  communities,
  getCommunityDetails,
  changeComStatus,
  addUserECommunity,
  changeCommunity,
  deleteCommunity,
  changeCommunityWI
} from "../controllers/communityController";
import {
  addEvent,
  getAllEvent,
  getEventDetails,
  getEventData,
  deleteEvent,
  editEvent,
  editEventImage,
  addWinners,
  eventImages,
  changeEventStatus,
  eventEarnings,
  deleteEventImages,
  editWinner
} from "../controllers/eventController";
import { AddBanner,banners,deleteBanner,getBanner,postBannerEdit} from "../controllers/bannerController";
import isAuth from "../Middleware/checkAdminAuth";


router.get("/getAllUser", isAuth, getAllUser);
router.get("/singleUser", isAuth, singleUser);
router.get("/communities", isAuth, communities);
router.get("/getCommunityUsers", isAuth, getCommunityUsers);
router.get("/getComUser", isAuth, getComUser);
router.get("/getCommunityDetails/:id", isAuth, getCommunityDetails);
router.get("/addUserECommunity", isAuth, addUserECommunity);
router.get("/getAllEvent", isAuth, getAllEvent);
router.get("/getEventDetails", isAuth, getEventDetails);
router.get("/getEventData", isAuth, getEventData);
router.get("/banners",isAuth,banners)
router.get("/getBanner",getBanner)
router.get('/accounts',isAuth,accounts)
router.get("/eventEarnings",isAuth,eventEarnings)
router.get("/dashboardCardValues",isAuth,dashboardCardValues)
router.get("/primeMembers",isAuth,primeMembers)

router.post("/AdminLogin", postAdminLogin);
router.post("/blockUser", isAuth, blockUser);
router.post("/changeComStatus", isAuth, changeComStatus);
router.post("/changeCommunity/:id", isAuth, changeCommunity);
router.post("/addEvent", isAuth, addEvent);
router.post("/editEvent/:id",isAuth,editEvent)
router.post("/editEventImage/:id",isAuth,editEventImage)
router.post("/changeEventStatus",isAuth,changeEventStatus)


router.delete("/deleteCommunity/:id", isAuth, deleteCommunity);
router.delete("/deleteEvent", isAuth, deleteEvent);
router.delete("/deleteBanner",isAuth,deleteBanner)
router.delete("/deleteEventImages",isAuth,deleteEventImages)

router.post("/createCommunity",isAuth,upload.single("image"),createCommunity);
router.post("/addBanner", isAuth, bannerUploads.single("image"), AddBanner);
router.post("/postBannerEdit",isAuth,bannerUploads.single("image"),postBannerEdit)
router.post("/changeCommunityImage/:id",isAuth,upload.single("image"),changeCommunityWI)
router.post("/eventImages/:id",isAuth,eventUploads.array("image",9),eventImages)
router.post("/addWinners/:id",isAuth,eventUploads.array("file",3),addWinners)
router.post("/editWinner/:id",isAuth,eventUploads.fields(
  [
    {name:"first",maxCount:1},
    {name:"second",maxCount:1},
    {name:"third",maxCount:1}
  ]),editWinner)

export default router;
