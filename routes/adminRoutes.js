"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const admincontroller_1 = require("../controllers/admincontroller");
router.post("/AdminLogin", admincontroller_1.postAdminLogin);
router.get("/getAllUser", admincontroller_1.getAllUser);
router.post("/blockUser", admincontroller_1.blockUser);
exports.default = router;
