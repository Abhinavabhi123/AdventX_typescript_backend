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
import {
  postAdminLogin,
  getAllUser,
  blockUser,
  singleUser,
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
} from "../controllers/communityController";
import {
  addEvent,
  getAllEvent,
  getEventDetails,
  getEventData,
  deleteEvent,
} from "../controllers/eventController";
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


router.post("/AdminLogin", postAdminLogin);
router.post("/blockUser", isAuth, blockUser);
router.post("/changeComStatus", isAuth, changeComStatus);
router.post("/changeCommunity/:id", isAuth, changeCommunity);
router.post("/addEvent", isAuth, addEvent);

router.delete("/deleteCommunity/:id", isAuth, deleteCommunity);
router.delete("/deleteEvent", isAuth, deleteEvent);

router.post(
  "/createCommunity",
  isAuth,
  upload.single("image"),
  createCommunity
);

export default router;
