"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bannerUploads = exports.upload = exports.fileFilter = exports.bannerStorage = exports.storage = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
const multer_1 = __importDefault(require("multer"));
exports.storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    },
});
exports.bannerStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/banners/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    },
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/png") {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
exports.fileFilter = fileFilter;
exports.upload = (0, multer_1.default)({
    storage: exports.storage,
    limits: {
        fileSize: 1024 * 1024 * 100,
    },
    fileFilter: exports.fileFilter,
});
exports.bannerUploads = (0, multer_1.default)({
    storage: exports.bannerStorage,
    limits: {
        fileSize: 1024 * 1024 * 100,
    },
    fileFilter: exports.fileFilter,
});
const admincontroller_1 = require("../controllers/admincontroller");
const communityController_1 = require("../controllers/communityController");
const eventController_1 = require("../controllers/eventController");
const bannerController_1 = require("../controllers/bannerController");
const checkAdminAuth_1 = __importDefault(require("../Middleware/checkAdminAuth"));
router.get("/getAllUser", checkAdminAuth_1.default, admincontroller_1.getAllUser);
router.get("/singleUser", checkAdminAuth_1.default, admincontroller_1.singleUser);
router.get("/communities", checkAdminAuth_1.default, communityController_1.communities);
router.get("/getCommunityUsers", checkAdminAuth_1.default, communityController_1.getCommunityUsers);
router.get("/getComUser", checkAdminAuth_1.default, communityController_1.getComUser);
router.get("/getCommunityDetails/:id", checkAdminAuth_1.default, communityController_1.getCommunityDetails);
router.get("/addUserECommunity", checkAdminAuth_1.default, communityController_1.addUserECommunity);
router.get("/getAllEvent", checkAdminAuth_1.default, eventController_1.getAllEvent);
router.get("/getEventDetails", checkAdminAuth_1.default, eventController_1.getEventDetails);
router.get("/getEventData", checkAdminAuth_1.default, eventController_1.getEventData);
router.get("/banners", checkAdminAuth_1.default, bannerController_1.banners);
router.get("/getBanner", bannerController_1.getBanner);
router.post("/AdminLogin", admincontroller_1.postAdminLogin);
router.post("/blockUser", checkAdminAuth_1.default, admincontroller_1.blockUser);
router.post("/changeComStatus", checkAdminAuth_1.default, communityController_1.changeComStatus);
router.post("/changeCommunity/:id", checkAdminAuth_1.default, communityController_1.changeCommunity);
router.post("/addEvent", checkAdminAuth_1.default, eventController_1.addEvent);
router.delete("/deleteCommunity/:id", checkAdminAuth_1.default, communityController_1.deleteCommunity);
router.delete("/deleteEvent", checkAdminAuth_1.default, eventController_1.deleteEvent);
router.delete("/deleteBanner", checkAdminAuth_1.default, bannerController_1.deleteBanner);
router.post("/createCommunity", checkAdminAuth_1.default, exports.upload.single("image"), communityController_1.createCommunity);
router.post("/addBanner", checkAdminAuth_1.default, exports.bannerUploads.single("image"), bannerController_1.AddBanner);
router.post("/postBannerEdit", checkAdminAuth_1.default, exports.bannerUploads.single("image"), bannerController_1.postBannerEdit);
exports.default = router;
