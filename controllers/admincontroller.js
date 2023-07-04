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
exports.postAdminLogin = void 0;
const adminModel_1 = __importDefault(require("../models/adminModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
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
                status: 401,
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
            };
            return res.status(object.status).send(object);
        }
        else {
            object = {
                access: true,
                message: "Access Granted",
                error: "",
                status: 200,
            };
            res.status(object.status).send(object);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.postAdminLogin = postAdminLogin;
