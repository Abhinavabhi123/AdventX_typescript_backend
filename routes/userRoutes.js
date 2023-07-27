"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.fileFilter = exports.vStorage = exports.storage = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
exports.storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/UserImage/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    },
});
exports.vStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/Vehicles/");
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
const vUploads = (0, multer_1.default)({
    storage: exports.vStorage,
    limits: {
        fieldSize: 1024 * 1024 * 100
    },
});
const userController_1 = require("../controllers/userController");
const eventController_1 = require("../controllers/eventController");
const communityController_1 = require("../controllers/communityController");
const checkUserAuth_1 = __importDefault(require("../Middleware/checkUserAuth"));
router.get("/getAllUpEvents", eventController_1.getAllUpEvents);
router.get("/getEvent", eventController_1.getEvent);
router.get("/getAllEvents", eventController_1.getAllEvents);
router.get("/getUserProfile/:id", checkUserAuth_1.default, userController_1.getUserProfile);
router.get("/userDetails/:id", checkUserAuth_1.default, userController_1.userDetails);
router.get("/userCommunities/:id", checkUserAuth_1.default, communityController_1.userCommunities);
router.post("/postSignup", userController_1.postUserSignup);
router.post("/userLogin", userController_1.userLogin);
router.post("/sendOpt", userController_1.sendOpt);
router.post("/postForget", userController_1.postForget);
router.post("/postOtp", userController_1.postOtp);
router.post("/changePass", userController_1.changePass);
router.post("/addPayment", userController_1.addPayment);
router.post("/postUserDetails", checkUserAuth_1.default, userController_1.postUserDetails);
router.post("/postAddress", checkUserAuth_1.default, userController_1.postAddress);
router.post("/addVehicle", checkUserAuth_1.default, vUploads.array("image"), userController_1.addVehicle);
router.post('/userImage', checkUserAuth_1.default, exports.upload.single("images"), userController_1.userImage);
exports.default = router;
