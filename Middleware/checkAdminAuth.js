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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.ADMIN_JWT_SECRET;
const adminModel_1 = __importDefault(require("../models/adminModel"));
const isAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        if (token) {
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            if (decoded) {
                const data = yield adminModel_1.default.findOne({ email: decoded === null || decoded === void 0 ? void 0 : decoded.email });
                if (data) {
                    next();
                }
                else {
                    return res.status(401).send("Unauthorized access");
                }
            }
            else {
                return res.status(401).send("Unauthorized access");
            }
        }
    }
    catch (error) { }
});
exports.default = isAuth;
