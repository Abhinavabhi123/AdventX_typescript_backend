"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const userController_1 = require("../controllers/userController");
router.post("/postSignup", userController_1.postUserSignup);
router.post("/userLogin", userController_1.userLogin);
router.post("/sendOpt", userController_1.sendOpt);
exports.default = router;
