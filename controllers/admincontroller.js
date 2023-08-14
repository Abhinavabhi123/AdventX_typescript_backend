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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.primeMembers = exports.dashboardCardValues = exports.accounts = exports.singleUser = exports.blockUser = exports.getAllUser = exports.postAdminLogin = void 0;
const adminModel_1 = __importDefault(require("../models/adminModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
const eventModel_1 = __importDefault(require("../models/eventModel"));
const communityModel_1 = __importDefault(require("../models/communityModel"));
dotenv.config();
const adminSecret = process.env.ADMIN_JWT_SECRET || "";
const postAdminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let object = {
            access: false,
            message: "",
            error: "",
            status: 0,
        };
        const { email, password } = req.body;
        const adminData = yield adminModel_1.default.findOne({ email: email });
        if (!adminData) {
            // Admin data not found
            let object = {
                access: false,
                message: "",
                error: "Email not matching",
                status: 404,
            };
            return res.status(object.status).send(object);
        }
        const hashPass = adminData.password;
        const adminPass = yield bcrypt_1.default.compare(password, hashPass);
        if (!adminPass) {
            object = {
                access: false,
                message: "",
                error: "Password is incorrect",
                status: 401,
                token: "",
            };
            return res.status(object.status).send(object);
        }
        else {
            const token = jsonwebtoken_1.default.sign({ email: adminData === null || adminData === void 0 ? void 0 : adminData.email }, adminSecret, {
                expiresIn: "5d",
            });
            object = {
                access: true,
                message: "Access Granted",
                error: "",
                status: 200,
                token: token,
            };
            // .cookie("AdminJwt", token, {
            //   httpOnly: true,
            //   domain: process.env.cookieDomain,
            //   path: "/",
            //   maxAge: 3600000,
            // })
            res
                .status(object.status)
                .cookie("AdminJwt", token, {
                expires: new Date(Date.now() + 3600 * 1000),
                httpOnly: true,
                sameSite: "strict",
                path: '/'
            })
                .send(object);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.postAdminLogin = postAdminLogin;
const getAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("ivide nd");
        const allUsers = yield userModel_1.default.find();
        console.log(allUsers);
        res.status(200).send(allUsers);
    }
    catch (error) {
        console.error(error);
    }
});
exports.getAllUser = getAllUser;
const blockUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.body;
        console.log(id);
        const userData = yield userModel_1.default.findOne({ _id: id });
        if (userData) {
            if ((userData === null || userData === void 0 ? void 0 : userData.status) == false) {
                userData.status = true;
            }
            else {
                userData.status = false;
            }
            yield userData.save();
            res.send(userData);
        }
        else {
            console.log("User not Found");
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.blockUser = blockUser;
const singleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.query.id;
        const userData = yield userModel_1.default.findOne({ _id: id });
        res.send(userData);
    }
    catch (error) {
        console.error(error);
    }
});
exports.singleUser = singleUser;
const accounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let obj = {
            message: "",
            status: 0,
            error: ''
        };
        const primeMembers = yield userModel_1.default.find({ primeMember: true }).count();
        const subscription = primeMembers * 2000;
        const eventData = yield eventModel_1.default.find();
        console.log(eventData, "event Data");
        const eventAmount = yield eventModel_1.default.aggregate([
            {
                $addFields: {
                    participantsCount: { $size: "$participants" }
                }
            },
            {
                $group: {
                    _id: null,
                    totalEarnings: { $sum: { $multiply: ["$fee", "$participantsCount"] } }
                }
            }
        ]);
        // const eventAmount = await eventModel.aggregate([{}])
        console.log(eventAmount, 'eventkkkkk');
        console.log(subscription, "kjkjkjj");
        obj = {
            message: "data fetched successfully",
            status: 200,
            error: "",
            subAmount: subscription,
            eventAmount: eventAmount[0].totalEarnings
        };
        res.status(obj.status).send(obj);
    }
    catch (error) {
        console.error(error);
    }
});
exports.accounts = accounts;
const dashboardCardValues = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let obj = {
            message: "",
            status: 0,
            error: ""
        };
        const userData = yield userModel_1.default.find().count();
        const blockedUsers = yield userModel_1.default.find({ status: false }).count();
        const primeMembers = yield userModel_1.default.find({ primeMember: true }).count();
        const events = yield eventModel_1.default.find().count();
        const completedEvents = yield eventModel_1.default.find({ is_completed: true }).count();
        const communityCount = yield communityModel_1.default.find().count();
        if (userData >= 0 && blockedUsers >= 0 && primeMembers >= 0 && events >= 0 && completedEvents >= 0 && communityCount >= 0) {
            obj = {
                message: "Data fetched successfully",
                status: 200,
                error: "",
                userData,
                blockedUsers,
                primeMembers,
                events,
                completedEvents,
                communityCount
            };
            res.status(obj.status).send(obj);
        }
        else {
            obj = {
                message: "",
                status: 404,
                error: `Something wen't wrong`
            };
            res.status(obj.status).send(obj);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.dashboardCardValues = dashboardCardValues;
const primeMembers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let obj = {
            message: '',
            status: 0,
            error: ''
        };
        const userData = yield userModel_1.default.find({ primeMember: true });
        if (userData) {
            obj = {
                message: `Data fetched successfully`,
                status: 200,
                error: '',
                userData
            };
            res.status(obj.status).send(obj);
        }
        else {
            obj = {
                message: "",
                status: 404,
                error: `Something wen't wrong`
            };
            res.status(obj.status).send(obj);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.primeMembers = primeMembers;
