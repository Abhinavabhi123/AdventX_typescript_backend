"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.fileFilter = exports.storage = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
const multer_1 = __importDefault(require("multer"));
exports.storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
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
const admincontroller_1 = require("../controllers/admincontroller");
const communityController_1 = require("../controllers/communityController");
router.post("/AdminLogin", admincontroller_1.postAdminLogin);
router.get("/getAllUser", admincontroller_1.getAllUser);
router.post("/blockUser", admincontroller_1.blockUser);
router.get("/singleUser", admincontroller_1.singleUser);
router.get("/communities", communityController_1.communities);
router.get("/getCommunityUsers", communityController_1.getCommunityUsers);
router.get("/getComUser", communityController_1.getComUser);
router.get("/getCommunityDetails/:id", communityController_1.getCommunityDetails);
router.post("/changeComStatus", communityController_1.changeComStatus);
router.get("/addUserECommunity", communityController_1.addUserECommunity);
router.post("/changeCommunity", communityController_1.changeCommunity);
router.post("/createCommunity", exports.upload.single("image"), communityController_1.createCommunity);
exports.default = router;
