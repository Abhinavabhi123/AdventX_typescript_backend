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
exports.postBannerEdit = exports.getBanner = exports.deleteBanner = exports.banners = exports.AddBanner = void 0;
const bannerModel_1 = __importDefault(require("../models/bannerModel"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const AddBanner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let obj = {
            message: "",
            status: 0,
            error: "",
        };
        console.log(req.body);
        console.log(req.file);
        if (req.body.title && req.body.subTitle && req.file) {
            new bannerModel_1.default({
                title: req.body.title,
                subTitle: req.body.subTitle,
                image: req.file.filename,
            })
                .save()
                .then((data) => {
                obj = {
                    message: "Banner added successfully",
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
                error: "Request data not found",
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
            error: "",
        };
        const bannerData = yield bannerModel_1.default.find();
        if (bannerData) {
            obj = {
                message: "Data fetched successfully",
                status: 200,
                error: "",
                bannerData,
            };
            res.status(obj.status).send(obj);
        }
        else {
            obj = {
                message: "",
                status: 501,
                error: "Banner data not found",
            };
            res.status(obj.status).send(obj);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.banners = banners;
const deleteBanner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let obj = {
            message: "",
            status: 0,
            error: "",
        };
        const { id } = req.query;
        if (id) {
            const bannerData = yield bannerModel_1.default.findOne({ _id: id });
            if (bannerData) {
                const bannerFolder = path_1.default.join(__dirname, "../public/banners");
                const image = bannerData === null || bannerData === void 0 ? void 0 : bannerData.image;
                yield bannerModel_1.default.deleteOne({ _id: id }).then(() => {
                    const imagePath = path_1.default.join(bannerFolder, image);
                    fs_1.default.unlink(imagePath, (err) => {
                        if (err) {
                            console.error(err);
                        }
                        else {
                            console.log("banner image deleted successfully");
                        }
                    });
                    obj = {
                        message: "Banner deleted successfully",
                        status: 200,
                        error: "",
                    };
                    res.status(obj.status).send(obj);
                });
            }
            else {
                obj = {
                    message: "",
                    status: 401,
                    error: `Banner data not found with id${id}`,
                };
                res.status(obj.status).send(obj);
            }
        }
        else {
            obj = {
                message: "",
                status: 404,
                error: `Banner id is not found`,
            };
            res.status(obj.status).send(obj);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.deleteBanner = deleteBanner;
const getBanner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let obj = {
            message: "",
            status: 0,
            error: "",
        };
        const { id } = req.query;
        console.log(id);
        if (id) {
            const bannerData = yield bannerModel_1.default.findOne({ _id: id });
            if (bannerData) {
                obj = {
                    message: "Data fetched successfully",
                    status: 200,
                    error: "",
                    bannerData,
                };
                res.status(obj.status).send(obj);
            }
            else {
                obj = {
                    message: "",
                    status: 404,
                    error: `Can't found banner data with id${id}`,
                };
                res.status(obj.status).send(obj);
            }
        }
        else {
            obj = {
                message: "",
                status: 404,
                error: "Banner id not found",
            };
            res.status(obj.status).send(obj);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.getBanner = getBanner;
const postBannerEdit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let obj = {
            message: "",
            status: 0,
            error: "",
        };
        if (req.body) {
            const { title, subTitle, status, id } = req.body;
            if (id) {
                const bannerData = yield bannerModel_1.default.findOne({ _id: id });
                if (bannerData) {
                    if (req.file) {
                        const bannerFolder = path_1.default.join(__dirname, "../public/banners");
                        const image = bannerData === null || bannerData === void 0 ? void 0 : bannerData.image;
                        yield bannerModel_1.default.updateOne({ _id: id }, {
                            $set: {
                                title,
                                subTitle,
                                status,
                                image: req.file.filename,
                            },
                        });
                        const imagePath = path_1.default.join(bannerFolder, image);
                        fs_1.default.unlink(imagePath, (err) => {
                            if (err) {
                                console.error(err);
                                return;
                            }
                            else {
                                console.log("banner image deleted successfully");
                            }
                        });
                    }
                    else {
                        yield bannerModel_1.default.updateOne({ _id: id }, {
                            $set: {
                                title,
                                subTitle,
                                status,
                            },
                        });
                    }
                    obj = {
                        message: "Banner updated successfully",
                        status: 200,
                        error: "",
                    };
                    res.status(obj.status).send(obj);
                }
                else {
                    obj = {
                        message: "",
                        status: 404,
                        error: `Banner data not found with id${id}`,
                    };
                }
            }
        }
        else {
            obj = {
                message: "",
                status: 404,
                error: "Could not find the banner id",
            };
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.postBannerEdit = postBannerEdit;
