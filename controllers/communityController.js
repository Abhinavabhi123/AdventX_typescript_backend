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
exports.getComUser = exports.getCommunityUsers = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const getCommunityUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = yield userModel_1.default.find({
            $and: [{ status: true }, { primeMember: true }],
        });
        console.log(userData);
        if (!userData) {
            res.status(401).send({ message: "No Prime Users" });
        }
        else {
            res.status(200).send(userData);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.getCommunityUsers = getCommunityUsers;
const getComUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("ethi");
        const id = req.query;
        console.log(id);
        const userData = yield userModel_1.default.findOne({ _id: id });
        if (!userData) {
            console.log("no data");
        }
        else {
            console.log(userData, "this is the data");
        }
    }
    catch (error) {
        console.error();
    }
});
exports.getComUser = getComUser;
