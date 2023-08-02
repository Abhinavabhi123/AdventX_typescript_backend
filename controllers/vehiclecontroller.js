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
exports.deleteVehicle = exports.getAllVehicles = exports.addVehicle = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const vehicleModel_1 = __importDefault(require("../models/vehicleModel"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const addVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let obj = {
            message: "",
            status: 0,
            error: ''
        };
        const { vNumber, vType, fuelType, vName, vWheels, vOwner, id } = req.body;
        if (id) {
            const userData = yield userModel_1.default.findOne({ _id: id });
            if (userData) {
                const files = req.files;
                if (files) {
                    let vehicleImages = [];
                    for (const i of Object.keys(files)) {
                        const image = files[i].filename;
                        console.log(image);
                        vehicleImages.push(image);
                    }
                    yield new vehicleModel_1.default({
                        userId: id,
                        vehicleNumber: vNumber,
                        vehicleName: vName,
                        vehicleType: vType,
                        wheelCount: vWheels,
                        fuelType,
                        ownerName: vOwner,
                        images: vehicleImages
                    }).save().then((data) => __awaiter(void 0, void 0, void 0, function* () {
                        console.log(data, "dataaaaa");
                        yield userModel_1.default.updateOne({ _id: id }, { $push: { vehicles: { vehicleId: data === null || data === void 0 ? void 0 : data._id } } }).then(() => {
                            obj = {
                                message: "vehicle added successfully",
                                status: 200,
                                error: ''
                            };
                            res.status(obj.status).send(obj);
                        });
                    }));
                }
                else {
                    obj = {
                        message: "",
                        status: 404,
                        error: "images not found"
                    };
                    res.status(obj.status).send(obj);
                }
            }
            else {
                obj = {
                    message: "",
                    status: 404,
                    error: 'User Not Found'
                };
                res.status(obj.status).send(obj);
            }
        }
        else {
            obj = {
                message: "",
                status: 404,
                error: "userId not found"
            };
            res.status(obj.status).send(obj);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.addVehicle = addVehicle;
const getAllVehicles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let obj = {
            message: '',
            status: 0,
            error: ""
        };
        const { id } = req.params;
        if (id) {
            const userData = yield userModel_1.default.findOne({ _id: id }, { vehicles: 1, _id: 0 });
            if (userData) {
                const vehicleData = yield vehicleModel_1.default.find({ userId: id });
                console.log(vehicleData, "kikgig");
                if (vehicleData) {
                    obj = {
                        message: `Fetched vehicle data`,
                        status: 200,
                        error: "",
                        vehicleData
                    };
                    res.status(obj.status).send(obj);
                }
                else {
                    obj = {
                        message: "",
                        status: 404,
                        error: "No vehicle data"
                    };
                    res.status(obj.status).send(obj);
                }
            }
            else {
                obj = {
                    message: "",
                    status: 404,
                    error: "User not found"
                };
                res.status(obj.status).send(obj);
            }
        }
        else {
            obj = {
                message: "",
                status: 404,
                error: "vehicle not found"
            };
            res.status(obj.status).send(obj);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.getAllVehicles = getAllVehicles;
const deleteVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let obj = {
            message: "",
            status: 0,
            error: ""
        };
        const { id } = req.params;
        if (id) {
            const vehicleData = yield vehicleModel_1.default.findOne({ _id: id });
            if (vehicleData) {
                yield vehicleModel_1.default.deleteOne({ _id: id }).then((data) => __awaiter(void 0, void 0, void 0, function* () {
                    const userData = yield userModel_1.default.updateOne({ _id: vehicleData === null || vehicleData === void 0 ? void 0 : vehicleData.userId }, { $pull: { vehicles: { vehicleId: id } } }).then(() => {
                        console.log(vehicleData.images);
                        for (let i = 0; i < vehicleData.images.length; i++) {
                            const imagePath = path_1.default.join(__dirname, "../public/Vehicles");
                            const delImagePath = path_1.default.join(imagePath, vehicleData === null || vehicleData === void 0 ? void 0 : vehicleData.images[i]);
                            fs_1.default.unlink(delImagePath, (err) => {
                                if (err) {
                                    console.error(err);
                                }
                                else {
                                    console.log(`LIcense image data removed successfully`);
                                }
                            });
                        }
                        console.log("deleted");
                        obj = {
                            message: "vehicle deleted successfully",
                            status: 200,
                            error: ""
                        };
                        res.status(obj.status).send(obj);
                    });
                }));
            }
            else {
                obj = {
                    message: "",
                    status: 404,
                    error: "vehicle data not found"
                };
                res.status(obj.status).send(obj);
            }
        }
        else {
            obj = {
                message: "",
                status: 404,
                error: 'something went wrong'
            };
            res.status(obj.status).send(obj);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.deleteVehicle = deleteVehicle;
