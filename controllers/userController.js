"use strict";
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
exports.getAllUser = exports.postUserSignup = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const postUserSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let object = {
            message: "",
            status: 0,
            error: "",
            loggedIn: false
        };
        const { fName, lName, Mobile, email, password } = req.body;
        const UserData = yield userModel_1.default.findOne({ email: email });
        console.log(UserData);
        if (UserData) {
            object = {
                message: "",
                status: 500,
                error: 'user Already exists',
                loggedIn: false
            };
            res.send(object);
        }
        else {
            yield new userModel_1.default({
                firstName: fName,
                lastName: lName,
                email: email,
                mobile: Mobile,
                password: password
            }).save().then(() => {
                console.log("success");
                res.send({ message: "Success" });
            });
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.postUserSignup = postUserSignup;
const getAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const {} = req.body;
    }
    catch (error) {
    }
});
exports.getAllUser = getAllUser;
