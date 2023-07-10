"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const admincontroller_1 = require("../controllers/admincontroller");
const communityController_1 = require("../controllers/communityController");
router.post("/AdminLogin", admincontroller_1.postAdminLogin);
router.get("/getAllUser", admincontroller_1.getAllUser);
router.post("/blockUser", admincontroller_1.blockUser);
router.get("/singleUser", admincontroller_1.singleUser);
router.get("/communities", communityController_1.communities);
router.get("/getCommunityUsers", communityController_1.getCommunityUsers);
router.get("/getComUser", communityController_1.getComUser);
// upload.single("formData")
router.post("/createCommunity", communityController_1.createCommunity);
exports.default = router;
