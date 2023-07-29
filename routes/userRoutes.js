"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.fileFilter = exports.LStorage = exports.vStorage = exports.storage = void 0;
const express_1 = __importStar(require("express"));
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
exports.LStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/License/");
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
        fileSize: 1024 * 1024 * 100,
    },
    fileFilter: exports.fileFilter,
});
const LUploads = (0, multer_1.default)({
    storage: exports.LStorage,
    limits: {
        fieldSize: 1024 * 1024 * 100
    },
});
const userController_1 = require("../controllers/userController");
const eventController_1 = require("../controllers/eventController");
const communityController_1 = require("../controllers/communityController");
const bannerController_1 = require("../controllers/bannerController");
const checkUserAuth_1 = __importDefault(require("../Middleware/checkUserAuth"));
router.get("/getAllUpEvents", eventController_1.getAllUpEvents);
router.get("/getEvent", eventController_1.getEvent);
router.get("/getAllEvents", eventController_1.getAllEvents);
router.get("/getUserProfile/:id", checkUserAuth_1.default, userController_1.getUserProfile);
router.get("/userDetails/:id", checkUserAuth_1.default, userController_1.userDetails);
router.get("/userCommunities/:id", checkUserAuth_1.default, communityController_1.userCommunities);
router.get("/userLicense", checkUserAuth_1.default, userController_1.userLicense);
router.get("/getUserEvent", userController_1.getUserEvent);
router.get("/getBanner", bannerController_1.getUserBanner);
router.post("/postSignup", userController_1.postUserSignup);
router.post("/userLogin", userController_1.userLogin);
router.post("/sendOpt", userController_1.sendOpt);
router.post("/postForget", userController_1.postForget);
router.post("/postOtp", userController_1.postOtp);
router.post("/changePass", userController_1.changePass);
router.post("/addPayment", userController_1.addPayment);
router.post("/postUserDetails", checkUserAuth_1.default, userController_1.postUserDetails);
router.post("/postAddress", checkUserAuth_1.default, userController_1.postAddress);
router.post("/webhook", express_1.default.raw({ type: 'application/json' }), userController_1.webhook);
// 
router.post("/create-checkout-session", checkUserAuth_1.default, userController_1.create_checkout_session);
// 
router.post("/addVehicle", checkUserAuth_1.default, vUploads.array("array", 3), userController_1.addVehicle);
router.post('/userImage', checkUserAuth_1.default, exports.upload.single("images"), userController_1.userImage);
router.post("/addLicense", checkUserAuth_1.default, LUploads.single("image"), userController_1.addLicense);
router.post("/editLicense", checkUserAuth_1.default, LUploads.single("image"), userController_1.editLicense);
exports.default = router;
