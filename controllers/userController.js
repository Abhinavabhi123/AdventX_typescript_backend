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
exports.userLogin = exports.postUserSignup = exports.sendOpt = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const secretKey = process.env.USER_JWT_SECRET || "";
const transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
        user: "adventx.dev@gmail.com",
        pass: "lpfsewdiqwkpqdln",
    },
});
// const OTP: number = Math.floor(Math.random() * 1000000);
let otp = Math.random() * 1000000;
const OTP = Math.floor(otp);
// * Hashing the password
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const saltValue = 10;
    try {
        const hashedPassword = yield bcrypt_1.default.hash(password, saltValue);
        return hashedPassword;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
});
//* comparing the hashed password
const compareHash = (password, hashPass) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const match = yield bcrypt_1.default.compare(password, hashPass);
        return match;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
});
const sendOpt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (email) {
            const userData = yield userModel_1.default.findOne({ email: email });
            console.log(userData);
            if (userData) {
                return res
                    .status(401)
                    .send({ message: "User already exists, try another email" });
            }
            else {
                var mailOptions = {
                    from: "adventx.dev@gmail.com",
                    to: email,
                    subject: "OTP for Signup is: ",
                    html: "<h3>OTP for account verification is </h3>" +
                        "<h1 style='font-weight:bold;'>" +
                        OTP +
                        "</h1>", // html body
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    res.status(200).send({ message: "success" });
                });
            }
        }
        else {
            res.status(500).send({ message: "No email found" });
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.sendOpt = sendOpt;
const postUserSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let object = {
            message: "",
            status: 0,
            error: "",
        };
        console.log(req.body);
        const { fName, lName, Mobile, email, password, otp } = req.body;
        if (OTP === otp) {
            console.log("otp same");
        }
        const hashedPass = yield hashPassword(password);
        const UserData = yield userModel_1.default.findOne({ email: email });
        if (UserData) {
            object = {
                message: "",
                status: 500,
                error: "user Already exists",
            };
            res.send(object);
        }
        else {
            yield new userModel_1.default({
                firstName: fName,
                lastName: lName,
                email: email,
                mobile: Mobile,
                password: hashedPass,
            })
                .save()
                .then(() => {
                object = {
                    message: "Email Verified",
                    status: 200,
                    error: "",
                };
                console.log("success");
                res.status(object.status).send(object);
            });
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.postUserSignup = postUserSignup;
const userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        let object = {
            message: "",
            status: 0,
            error: "",
            loggedIn: false,
            userData: {},
        };
        const { email, password } = req.body;
        const userData = yield userModel_1.default.find({ email: email });
        if (userData) {
            const grantAccess = yield compareHash(password, userData[0].password);
            if (grantAccess) {
                const jwtToken = jsonwebtoken_1.default.sign({ _id: (_a = userData[0]) === null || _a === void 0 ? void 0 : _a._id, name: (_b = userData[0]) === null || _b === void 0 ? void 0 : _b.firstName }, secretKey, { expiresIn: "30d" });
                console.log("Access granted and token created");
                object = {
                    message: "Access granted",
                    status: 200,
                    error: "",
                    loggedIn: true,
                    userData: {
                        firstName: (_c = userData[0]) === null || _c === void 0 ? void 0 : _c.firstName,
                        lastName: (_d = userData[0]) === null || _d === void 0 ? void 0 : _d.lastName,
                        email: (_e = userData[0]) === null || _e === void 0 ? void 0 : _e.email,
                    },
                    jwtToken
                };
                res.cookie('jwtToken', jwtToken, {
                    httpOnly: true,
                    maxAge: 3600000,
                }).send(object);
            }
            else {
                {
                    object = {
                        message: "",
                        status: 500,
                        error: "password not matching",
                        loggedIn: false,
                        userData: {
                            firstName: undefined,
                            lastName: undefined,
                            email: undefined,
                        },
                    };
                    res.send(object);
                }
            }
        }
        else {
            object = {
                message: "",
                status: 500,
                error: "email not matching",
                loggedIn: false,
                userData: {
                    firstName: undefined,
                    lastName: undefined,
                    email: undefined,
                },
            };
            res.send(object);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.userLogin = userLogin;
