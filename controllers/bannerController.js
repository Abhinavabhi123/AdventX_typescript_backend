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
exports.banners = exports.AddBanner = void 0;
const bannerModel_1 = __importDefault(require("../models/bannerModel"));
const AddBanner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let obj = {
            message: "",
            status: 0,
            error: ""
        };
        console.log(req.body);
        console.log(req.file);
        if (req.body.title && req.body.subTitle && req.file) {
            new bannerModel_1.default({
                title: req.body.title,
                subTitle: req.body.subTitle,
                image: req.file.filename
            }).save().then((data) => {
                console.log(data);
                obj = {
                    message: "Banner added successfully",
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
                error: "Request data not found"
            };
            res.status(obj.status).send(obj);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.AddBanner = AddBanner;
const banners = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let obj = {
            message: "",
            status: 0,
            error: ""
        };
        const bannerData = yield bannerModel_1.default.find();
        if (bannerData) {
            obj = {
                message: "Data fetched successfully",
                status: 200,
                error: "",
                bannerData
            };
            res.status(obj.status).send(obj);
        }
        else {
            obj = {
                message: "",
                status: 501,
                error: "Banner data not found"
            };
            res.status(obj.status).send(obj);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.banners = banners;
