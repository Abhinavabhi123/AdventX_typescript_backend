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
exports.postAddress = exports.postUserDetails = exports.userImage = exports.getUserProfile = exports.addPayment = exports.changePass = exports.postOtp = exports.postForget = exports.userLogin = exports.postUserSignup = exports.sendOpt = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv = __importStar(require("dotenv"));
const stripe_1 = __importDefault(require("stripe"));
dotenv.config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const secret_strip = process.env.STRIPE_SECRET_KEY;
const stripes = new stripe_1.default(secret_strip, { apiVersion: "2022-11-15" });
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
    var _a, _b, _c, _d, _e, _f, _g, _h;
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
                console.log((_a = userData[0]) === null || _a === void 0 ? void 0 : _a.status, "userddd");
                if ((userData === null || userData === void 0 ? void 0 : userData.status) === true) {
                    const jwtToken = jsonwebtoken_1.default.sign({
                        _id: (_b = userData[0]) === null || _b === void 0 ? void 0 : _b._id,
                        name: (_c = userData[0]) === null || _c === void 0 ? void 0 : _c.firstName,
                        is_prime: (_d = userData[0]) === null || _d === void 0 ? void 0 : _d.primeMember,
                        status: (_e = userData[0]) === null || _e === void 0 ? void 0 : _e.status,
                        email: userData[0].email,
                    }, secretKey, { expiresIn: "30d" });
                    console.log("Access granted and token created");
                    object = {
                        message: "Access granted",
                        status: 200,
                        error: "",
                        loggedIn: true,
                        userData: {
                            firstName: (_f = userData[0]) === null || _f === void 0 ? void 0 : _f.firstName,
                            lastName: (_g = userData[0]) === null || _g === void 0 ? void 0 : _g.lastName,
                            email: (_h = userData[0]) === null || _h === void 0 ? void 0 : _h.email,
                        },
                        jwtToken,
                    };
                    res
                        .status(object.status)
                        .cookie("user", jwtToken, {
                        expires: new Date(Date.now() + 3600 * 1000),
                        httpOnly: true,
                        sameSite: "strict",
                    })
                        .send(object);
                }
                else {
                }
            }
            else {
                {
                    object = {
                        message: "You Are Blocked",
                        status: 403,
                        error: "",
                        loggedIn: false,
                        userData: {
                            firstName: undefined,
                            lastName: undefined,
                            email: undefined,
                        },
                    };
                    res.status(object.status).send(object);
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
            res.status(object.status).send(object);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.userLogin = userLogin;
const postForget = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let obj = {
            message: "",
            status: 0,
            error: "",
            email: "",
        };
        console.log(req.body);
        const { email } = req.body;
        const userData = yield userModel_1.default.findOne({ email: email });
        if (userData) {
            var mailOptions = {
                from: "adventx.dev@gmail.com",
                to: email,
                subject: "OTP for Signup is: ",
                html: "<h3>OTP for Reset password is </h3>" +
                    "<h1 style='font-weight:bold;'>" +
                    OTP +
                    "</h1>", // html body
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log(OTP, "Sended Otp is");
                obj = {
                    message: "Success",
                    status: 200,
                    error: "",
                    email: userData.email,
                };
                res.status(obj.status).send(obj);
            });
        }
        else {
            obj = {
                message: "",
                status: 401,
                error: "Email Not match",
            };
            res.status(obj.status).send(obj);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.postForget = postForget;
const postOtp = (req, res) => {
    try {
        let obj = {
            message: "",
            status: 0,
            error: "",
        };
        console.log(req.body);
        const { enteredOtp } = req.body;
        console.log(enteredOtp);
        if (enteredOtp === OTP) {
            console.log("Otp Success");
            obj = {
                message: "Otp matching",
                status: 200,
                error: "",
            };
            res.status(obj.status).send(obj);
        }
        else {
            obj = {
                message: "",
                status: 401,
                error: "Invalid otp",
            };
            res.status(obj.status).send(obj);
        }
    }
    catch (error) {
        console.error(error);
    }
};
exports.postOtp = postOtp;
const changePass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let obj = {
            message: "",
            status: 0,
            error: "",
        };
        const { checkEmail, password } = req.body;
        const hashedPass = yield hashPassword(password);
        console.log(hashedPass);
        yield userModel_1.default
            .updateOne({ email: checkEmail }, { $set: { password: hashedPass } })
            .then((data) => {
            obj = {
                message: "Password Changed",
                status: 200,
                error: "",
            };
            res.status(obj.status).send(obj);
        });
    }
    catch (error) {
        console.error(error);
    }
});
exports.changePass = changePass;
const addPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, amount } = req.body;
        const paymentIntent = yield stripes.paymentIntents.create({
            amount,
            currency: "inr",
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                userId: id,
            },
        });
        console.log(paymentIntent, "success payment");
        if (paymentIntent)
            res.send({
                clientSecret: paymentIntent.client_secret,
            });
    }
    catch (error) {
        console.error(error);
    }
});
exports.addPayment = addPayment;
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        let obj = {
            message: "",
            status: 0,
            error: "",
        };
        if (id) {
            const userData = yield userModel_1.default.findOne({ _id: id });
            if (userData) {
                obj = {
                    message: "Data fetched successfully",
                    status: 200,
                    error: "",
                    userData,
                };
                res.status(obj.status).send(obj);
            }
            else {
                obj = {
                    message: "",
                    status: 404,
                    error: "User document not found",
                };
                res.status(obj.status).send(obj);
            }
        }
        else {
            obj = {
                message: "",
                status: 404,
                error: "Id not found",
            };
            res.status(obj.status).send(obj);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.getUserProfile = getUserProfile;
const userImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let obj = {
            message: "",
            status: 0,
            error: "",
        };
        const { id } = req.body;
        if (id) {
            const userData = yield userModel_1.default.findOne({ _id: id });
            if (userData) {
                if (req.file) {
                    const fileName = req.file.filename;
                    yield userModel_1.default
                        .updateOne({ _id: id }, { $set: { image: fileName } })
                        .then(() => {
                        obj = {
                            message: "Image Updated successfully",
                            status: 200,
                            error: "",
                        };
                        res.status(obj.status).send(obj);
                    });
                }
                else {
                    obj = {
                        message: "",
                        status: 404,
                        error: "Image file not found",
                    };
                    res.status(obj.status).send(obj);
                }
            }
            else {
                obj = {
                    message: "",
                    status: 404,
                    error: "User data not found",
                };
                res.status(obj.status).send(obj);
            }
        }
        else {
            obj = {
                message: "",
                status: 404,
                error: "User Id not found",
            };
            res.status(obj.status).send(obj);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.userImage = userImage;
const postUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _j;
    try {
        console.log(req.body);
        let obj = {
            message: "",
            status: 0,
            error: "",
        };
        if (req.body) {
            const { id } = (_j = req.body) === null || _j === void 0 ? void 0 : _j.userId;
            const { firstName, lastName, number, about, height, weight, date } = req.body;
            const mobile = Number(number);
            const uHeight = Number(height);
            const uWeight = Number(weight);
            if (id) {
                const userData = yield userModel_1.default.findOne({ _id: id });
                if (userData) {
                    yield userModel_1.default
                        .updateOne({ _id: id }, {
                        $set: {
                            firstName,
                            lastName,
                            mobile,
                            about,
                            height: uHeight,
                            weight: uWeight,
                            date_of_birth: date,
                        },
                    })
                        .then(() => {
                        obj = {
                            message: "success",
                            status: 200,
                            error: "",
                        };
                        res.status(obj.status).send(obj);
                    });
                }
                else {
                    obj = {
                        message: "",
                        status: 404,
                        error: "User Data not found",
                    };
                    res.status(obj.status).send(obj);
                }
            }
            else {
                obj = {
                    message: "",
                    status: 404,
                    error: "Please Provide the userId",
                };
                res.status(obj.status).send(obj);
            }
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.postUserDetails = postUserDetails;
const postAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let obj = {
            message: "",
            status: 0,
            error: ""
        };
        console.log(req.body);
        const { id } = req.body.userId;
        const { houseName, locality, area, district, state, zip } = req.body;
        const zipCode = Number(zip);
        if (id) {
            const userData = yield userModel_1.default.findOne({ _id: id });
            if (userData) {
                yield userModel_1.default.updateOne({ _id: id }, { $set: { address: {
                            houseName,
                            locality,
                            area,
                            district,
                            state,
                            zipCode
                        } } }).then(() => {
                    obj = {
                        message: "Address added Successfully",
                        status: 200,
                        error: ""
                    };
                    res.status(obj.status).send(obj);
                });
            }
            else {
                obj = {
                    message: "",
                    status: 404,
                    error: "User not found!"
                };
                res.status(obj.status).send(obj);
            }
        }
        else {
            obj = {
                message: "",
                status: 404,
                error: "User not found!"
            };
            res.status(obj.status).send(obj);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.postAddress = postAddress;
