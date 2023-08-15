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
exports.editWinner = exports.deleteEventImages = exports.userEvents = exports.addParticipation = exports.eventPayment = exports.eventEarnings = exports.changeEventStatus = exports.eventImages = exports.addWinners = exports.editEventImage = exports.editEvent = exports.getUserAllEvents = exports.getAllEvents = exports.getEvent = exports.getAllUpEvents = exports.deleteEvent = exports.getEventData = exports.getEventDetails = exports.getAllEvent = exports.addEvent = void 0;
const eventModel_1 = __importDefault(require("../models/eventModel"));
const cloudnaryConfig_1 = __importDefault(require("../utils/cloudnaryConfig"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const stripe_1 = __importDefault(require("stripe"));
const dotenv = __importStar(require("dotenv"));
const userModel_1 = __importDefault(require("../models/userModel"));
dotenv.config();
const secret_strip = process.env.STRIPE_SECRET_KEY;
const stripes = new stripe_1.default(secret_strip, { apiVersion: "2022-11-15" });
const addEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let obj = {
            message: "",
            status: 0,
            error: "",
        };
        console.log(req.body);
        const { eventName, subTitle, location, date, type, fee, firstPrice, secondPrice, thirdPrice, description, about, imageUrl, status, } = req.body;
        const eventData = yield eventModel_1.default.findOne({ eventName: eventName });
        if (!eventData) {
            new eventModel_1.default({
                eventName,
                subName: subTitle,
                location,
                date,
                eventType: type,
                fee,
                firstPrice,
                secondPrice,
                thirdPrice,
                description,
                about,
                status,
                primaryImage: imageUrl,
            })
                .save()
                .then((data) => {
                obj = {
                    message: "Data stored successfully",
                    status: 200,
                    error: "",
                    eventId: data._id,
                };
                res.status(obj.status).send(obj);
            })
                .catch((error) => {
                console.log(error);
            });
        }
        else {
            obj = {
                message: "",
                status: 409,
                error: "This event name is already in use",
            };
            res.status(obj.status).send(obj);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.addEvent = addEvent;
const getAllEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let obj = {
            message: "",
            status: 0,
            error: "",
        };
        const eventData = yield eventModel_1.default.find();
        if (eventData) {
            let array = [];
            eventData.map((item) => {
                array.push(item._id);
            });
            obj = {
                message: "Data Fetched Successfully",
                status: 200,
                error: "",
                eventData: array,
            };
            res.status(obj.status).send(obj);
        }
        else {
            obj = {
                message: "",
                status: 404,
                error: "No Data Found",
            };
            res.status(obj.status).send(obj);
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.getAllEvent = getAllEvent;
const getEventDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let obj = {
            message: "",
            status: 0,
            error: "",
        };
        const { id } = req.query;
        if (id) {
            const data = yield eventModel_1.default.findOne({ _id: id });
            if (data) {
                obj = {
                    message: "Data fetched successfully",
                    status: 200,
                    error: "",
                    data,
                };
                res.status(obj.status).send(obj);
            }
            else {
                obj = {
                    message: "",
                    status: 404,
                    error: "Document not found",
                };
                res.status(obj.status).send(obj);
            }
        }
        else {
            obj = {
                message: "",
                status: 404,
                error: "Please provide an Event ID",
            };
            res.status(obj.status).send(obj);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.getEventDetails = getEventDetails;
const getEventData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let obj = {
            message: "",
            status: 0,
            error: "",
        };
        const { id } = req.query;
        if (id) {
            const eventData = yield eventModel_1.default.findOne({ _id: id });
            if (eventData) {
                obj = {
                    message: `Event data fetched successfully`,
                    status: 200,
                    error: "",
                    eventData,
                };
                res.status(obj.status).send(obj);
            }
            else {
                obj = {
                    message: "",
                    status: 404,
                    error: "No such record found",
                };
                res.status(obj.status).send(obj);
            }
        }
        else {
            obj = {
                message: "",
                status: 404,
                error: "Please provide a valid id for fetching the events.",
            };
            res.status(obj.status).send(obj);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.getEventData = getEventData;
const deleteEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let obj = {
            message: "",
            status: 0,
            error: "",
        };
        const { id } = req.query;
        if (id) {
            const data = yield eventModel_1.default.findOne({ _id: id });
            if (data) {
                yield eventModel_1.default.deleteOne({ _id: id });
                obj = {
                    message: "Event deleted successfully",
                    status: 200,
                    error: "",
                    image: data === null || data === void 0 ? void 0 : data.primaryImage
                };
                res.status(obj.status).send(obj);
            }
        }
        else {
            obj = {
                message: "",
                status: 404,
                error: "Please provide the event Id",
            };
            res.status(obj.status).send(obj);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.deleteEvent = deleteEvent;
const getAllUpEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let obj = {
            message: '',
            status: 0,
            error: ""
        };
        const eventData = yield eventModel_1.default.find({ $and: [{ status: "Active" }, { is_completed: false }] }, { _id: 1 });
        if (eventData) {
            obj = {
                message: "Data fetched successfully",
                status: 200,
                error: "",
                eventData
            };
            res.status(obj.status).send(obj);
        }
        else {
            obj = {
                message: "",
                status: 500,
                error: "Can't fetch the data"
            };
            res.status(obj.status).send(obj);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.getAllUpEvents = getAllUpEvents;
const getEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.query;
        if (id) {
            let obj = {
                message: "",
                status: 0,
                error: ""
            };
            const data = yield eventModel_1.default.findOne({ _id: id });
            if (data) {
                obj = {
                    message: "Data fetched successfully",
                    status: 200,
                    error: "",
                    data
                };
                res.status(obj.status).send(obj);
            }
            else {
                obj = {
                    message: "",
                    status: 404,
                    error: "Data not found"
                };
                res.status(obj.status).send(obj);
            }
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.getEvent = getEvent;
const getAllEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let obj = {
            message: "",
            status: 0,
            error: ""
        };
        const data = yield eventModel_1.default.find({ is_completed: true });
        if (data) {
            obj = {
                message: "Data fetched successfully",
                status: 200,
                error: '',
                data
            };
            res.status(obj.status).send(obj);
        }
        else {
            obj = {
                message: "",
                status: 404,
                error: "Data not found"
            };
            res.status(obj.status).send(obj);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.getAllEvents = getAllEvents;
const getUserAllEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let obj = {
            message: '',
            status: 0,
            error: ''
        };
        const eventData = yield eventModel_1.default.find({ status: "Active" });
        if (eventData) {
            obj = {
                message: "Event data fetched successfully",
                status: 200,
                error: "",
                eventData
            };
            res.status(obj.status).send(obj);
        }
        else {
            obj = {
                message: "",
                status: 404,
                error: `No event data found`
            };
            res.status(obj.status).send(obj);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.getUserAllEvents = getUserAllEvents;
const editEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let obj = {
            message: "",
            status: 0,
            error: ""
        };
        const { id } = req.params;
        const { eventName, subTitle, location, date, type, fee, firstPrice, secondPrice, thirdPrice, description, about, status } = req.body;
        if (id) {
            const eventData = yield eventModel_1.default.findOne({ _id: id });
            if (eventData) {
                if (req.body) {
                    yield eventModel_1.default.updateOne({ _id: id }, { $set: {
                            eventName: eventName,
                            subName: subTitle,
                            location,
                            date,
                            eventType: type,
                            fee,
                            firstPrice,
                            secondPrice,
                            thirdPrice,
                            description,
                            about,
                            status
                        } }).then(() => {
                        obj = {
                            message: `data changed successfully`,
                            status: 200,
                            error: "",
                            eventData
                        };
                        res.status(obj.status).send(obj);
                    });
                }
            }
            else {
                obj = {
                    message: "",
                    status: 404,
                    error: `The event is not present `
                };
                res.status(obj.status).send(obj);
            }
        }
        else {
            obj = {
                message: "",
                status: 404,
                error: "can't find the event"
            };
            res.status(obj.status).send(obj);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.editEvent = editEvent;
const editEventImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let obj = {
            message: "",
            status: 0,
            error: ""
        };
        const { id } = req.params;
        const { eventName, subTitle, location, date, type, fee, firstPrice, secondPrice, thirdPrice, description, about, status, imageUrl } = req.body;
        if (id) {
            const eventData = yield eventModel_1.default.findOne({ _id: id });
            if (eventData) {
                if (req.body) {
                    yield eventModel_1.default.updateOne({ _id: id }, { $set: {
                            eventName: eventName,
                            subName: subTitle,
                            location,
                            date,
                            eventType: type,
                            fee,
                            firstPrice,
                            secondPrice,
                            thirdPrice,
                            description,
                            about,
                            status,
                            primaryImage: imageUrl
                        } }).then(() => {
                        obj = {
                            message: `data changed successfully`,
                            status: 200,
                            error: "",
                            eventData
                        };
                        res.status(obj.status).send(obj);
                    });
                }
            }
            else {
                obj = {
                    message: "",
                    status: 404,
                    error: `The event is not present `
                };
                res.status(obj.status).send(obj);
            }
        }
        else {
            obj = {
                message: "",
                status: 404,
                error: "can't find the event"
            };
            res.status(obj.status).send(obj);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.editEventImage = editEventImage;
const addWinners = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let obj = {
            message: "",
            status: 0,
            error: ''
        };
        const { id } = req.params;
        const { firstName, secondName, thirdName } = req.body;
        if (id) {
            const eventData = yield eventModel_1.default.findOne({ _id: id });
            if (eventData) {
                if (req.files && req.body) {
                    const array = [];
                    const file = req.files;
                    const folder = path_1.default.join(__dirname, "../public/eventIMage");
                    for (const img of file) {
                        const imageUrl = img === null || img === void 0 ? void 0 : img.filename;
                        const imagePath = path_1.default.join(folder, imageUrl);
                        const options = {
                            folder: "winners",
                            format: "webp"
                        };
                        yield cloudnaryConfig_1.default.v2.uploader.upload(img.path, options).then((data) => {
                            array.push(data === null || data === void 0 ? void 0 : data.url);
                            fs_1.default.unlink(imagePath, (err) => {
                                if (err) {
                                    console.error(err);
                                }
                                else {
                                    console.log("Event image deleted successfully");
                                }
                            });
                        });
                    }
                    const obj1 = {
                        name: firstName,
                        image: array[0]
                    };
                    const obj2 = {
                        name: secondName,
                        image: array[1]
                    };
                    const obj3 = {
                        name: thirdName,
                        image: array[2]
                    };
                    yield eventModel_1.default.updateOne({ _id: id }, { $set: { winners: [{ first: obj1, second: obj2, third: obj3 }] } }).then((data) => {
                        obj = {
                            message: "Data updated successfully",
                            status: 200,
                            error: ''
                        };
                        res.status(obj.status).send(obj);
                    });
                }
                else {
                    obj = {
                        message: "",
                        status: 404,
                        error: `Data not found`
                    };
                    res.status(obj.status).send(obj);
                }
            }
            else {
                obj = {
                    message: "",
                    status: 404,
                    error: `Can't fetch the event data`
                };
                res.status(obj.status).send(obj);
            }
        }
        else {
            obj = {
                message: "",
                status: 404,
                error: `Cant find the event data`
            };
            res.status(obj.status).send(obj);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.addWinners = addWinners;
const eventImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let obj = {
            message: "",
            status: 0,
            error: ''
        };
        const { id } = req.params;
        const file = req.files;
        const eventData = yield eventModel_1.default.findOne({ _id: id });
        if (eventData) {
            if (file) {
                const array = [];
                const folder = path_1.default.join(__dirname, "../public/eventIMage");
                for (const image in file) {
                    const data = file[image];
                    const imageUrl = data === null || data === void 0 ? void 0 : data.filename;
                    const imagePath = path_1.default.join(folder, imageUrl);
                    const options = {
                        folder: "events",
                        format: "webp"
                    };
                    yield cloudnaryConfig_1.default.v2.uploader.upload(data.path, options).then((data) => {
                        array.push(data === null || data === void 0 ? void 0 : data.url);
                        fs_1.default.unlink(imagePath, (err) => {
                            if (err) {
                                console.error(err);
                            }
                            else {
                                console.log("Event image deleted successfully");
                            }
                        });
                    });
                }
                yield eventModel_1.default.updateOne({ _id: id }, { $push: { images: array } }).then(() => {
                    obj = {
                        message: "Image saved successfully",
                        status: 200,
                        error: ''
                    };
                    res.status(obj.status).send(obj);
                });
            }
        }
        else {
            obj = {
                message: "",
                status: 404,
                error: `Can't find the event`
            };
            res.status(obj.status).send(obj);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.eventImages = eventImages;
const changeEventStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let obj = {
            message: "",
            status: 0,
            error: ""
        };
        console.log(req.body);
        const { _id, selected } = req.body;
        if (_id) {
            const id = _id;
            const eventData = yield eventModel_1.default.findOne({ _id: id });
            if (eventData) {
                yield eventModel_1.default.updateOne({ _id: id }, { $set: {
                        is_completed: selected
                    } }).then(() => {
                    obj = {
                        message: "Event status has been changed",
                        status: 200,
                        error: ''
                    };
                    res.status(obj.status).send(obj);
                });
            }
            else {
                obj = {
                    message: "",
                    status: 404,
                    error: `Event data is not available`
                };
                res.status(obj.status).send(obj);
            }
        }
        else {
            obj = {
                message: "",
                status: 404,
                error: `Can't find the event data `
            };
            res.status(obj.status).send(obj);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.changeEventStatus = changeEventStatus;
const eventEarnings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let obj = {
            message: "",
            status: 0,
            error: ''
        };
        const eventData = yield eventModel_1.default.find({}, { _id: 0, fee: 1, participants: 1, eventName: 1 });
        if (eventData) {
            obj = {
                message: `Event data fetched successfully`,
                status: 200,
                error: "",
                eventData
            };
            res.status(obj.status).send(obj);
        }
        else {
            obj = {
                message: "",
                status: 404,
                error: "Something went wrong"
            };
            res.status(obj.status).send(obj);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.eventEarnings = eventEarnings;
const eventPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let obj = {
            message: "",
            status: 0,
            error: ""
        };
        console.log(req.body);
        console.log("Ethiiii");
        const { userId, amount, eventName, eventId, license, vehicle } = req.body;
        const userData = yield userModel_1.default.findOne({ _id: userId });
        if (userId) {
            const eventData = yield eventModel_1.default.findOne({ _id: eventId });
            if (eventData) {
                const session = yield stripes.checkout.sessions.create({
                    payment_method_types: ["card"],
                    line_items: [
                        {
                            price_data: {
                                currency: "inr",
                                product_data: {
                                    name: eventName,
                                },
                                unit_amount: amount,
                            },
                            quantity: 1,
                        },
                    ],
                    mode: "payment",
                    metadata: {
                        userId,
                        eventId
                    },
                    success_url: `${process.env.CLIENT_DOMAIN}/eventPayment/success?eveId=${eventId}&_id={CHECKOUT_SESSION_ID}&li=${license}&veh=${vehicle}`,
                    cancel_url: `${process.env.CLIENT_DOMAIN}/eventPayment/cancel`,
                });
                console.log(session, "session");
                obj = {
                    message: "success",
                    status: 200,
                    error: "",
                    url: session.url
                };
                res.status(obj.status).send(obj);
            }
            else {
                obj = {
                    message: "",
                    status: 404,
                    error: "Event data not found"
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
    catch (error) {
        console.error(error);
    }
});
exports.eventPayment = eventPayment;
const addParticipation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let obj = {
            message: "",
            status: 0,
            error: ""
        };
        console.log(req.body);
        const { _id, eventId, userId, vehicle, license } = req.body;
        if (_id && eventId && userId && vehicle && license) {
            const eventData = yield eventModel_1.default.findOne({ _id: eventId });
            if (eventData) {
                yield eventModel_1.default.updateOne({ _id: eventId }, { $push: {
                        participants: {
                            userId: userId,
                            vehicleId: vehicle,
                            licenseId: license,
                            paymentId: _id
                        }
                    } }).then(() => __awaiter(void 0, void 0, void 0, function* () {
                    yield userModel_1.default.updateOne({ _id: userId }, { $push: { eventParticipation: { eventId: eventData === null || eventData === void 0 ? void 0 : eventData._id } } }).then(() => {
                        obj = {
                            message: "Event participation successful",
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
                    error: "Event data not found"
                };
                res.status(obj.status).send(obj);
            }
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.addParticipation = addParticipation;
const userEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let obj = {
            message: "",
            status: 0,
            error: ""
        };
        const { id } = req.params;
        if (id) {
            const userData = yield userModel_1.default.findOne({ _id: id });
            if (userData) {
                const array = [];
                for (const data of userData.eventParticipation) {
                    const event = yield eventModel_1.default.findOne({ _id: data.eventId });
                    array.push(event);
                }
                obj = {
                    message: "Data fetched successfully",
                    status: 200,
                    error: "",
                    eventList: array
                };
                res.status(obj.status).send(obj);
            }
            else {
                obj = {
                    message: "",
                    status: 404,
                    error: `Data not found`
                };
                res.status(obj.status).send(obj);
            }
        }
        else {
            obj = {
                message: "",
                status: 404,
                error: "Something wen't wrong"
            };
            res.status(obj.status).send(obj);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.userEvents = userEvents;
const deleteEventImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let obj = {
            message: "",
            status: 0,
            error: ""
        };
        console.log(req.query);
        console.log(req.body.selectedValues);
        const { selectedValues } = req.body;
        const { id } = req.query;
        const eventData = yield eventModel_1.default.findOne({ _id: id });
        if (eventData) {
            for (const image of selectedValues) {
                try {
                    console.log(image.value, "popoo");
                    const images = image === null || image === void 0 ? void 0 : image.value.split("/");
                    const data = images[images.length - 1];
                    const img = data.split(".")[0];
                    const destroyResult = yield cloudnaryConfig_1.default.v2.uploader.destroy(`events/${img}`);
                    if (destroyResult.result === 'ok') {
                        yield eventModel_1.default.updateOne({ _id: id }, { $pull: {
                                images: image === null || image === void 0 ? void 0 : image.value
                            } }).then(() => {
                            console.log("Image removed from database");
                        });
                    }
                    else {
                        console.log('Cloudinary error:', destroyResult.result);
                    }
                }
                catch (error) {
                    console.log('Error deleting image:', error);
                }
            }
            obj = {
                message: "Images removed successfully",
                status: 200,
                error: ""
            };
            res.status(obj.status).send(obj);
        }
        else {
            obj = {
                message: '',
                status: 404,
                error: `Can't find the event data`
            };
            res.status(obj.status).send(obj);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.deleteEventImages = deleteEventImages;
const editWinner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    try {
        let obj = {
            message: "",
            status: 0,
            error: ""
        };
        const { id } = req.params;
        const { firstName, secondName, thirdName } = req.body;
        const eventData = yield eventModel_1.default.findOne({ _id: id });
        if (eventData) {
            if (req.files) {
                let object = {
                    name: "",
                    image: ""
                };
                const data = [];
                const array = ["first", "second", "third"];
                const values = [firstName, secondName, thirdName];
                const imageArray = [];
                if (Object.keys(req.files).length > 0) {
                    const images = req.files;
                    const folder = path_1.default.join(__dirname, "../public/eventIMage");
                    for (const image in images) {
                        imageArray.push(images[image][0]);
                    }
                    const options = {
                        folder: "winners",
                        format: "webp"
                    };
                    let count = 0;
                    let k = 0;
                    for (let i = 0; i < array.length; i++) {
                        for (let j = 0; j < imageArray.length; j++) {
                            if (array[i] === imageArray[j].fieldname) {
                                let imagesss;
                                if (imageArray[j].fieldname === "first") {
                                    console.log("first");
                                    imagesss = (_a = eventData.winners[0].first.image) !== null && _a !== void 0 ? _a : '';
                                }
                                if (imageArray[j].fieldname === "second") {
                                    imagesss = (_b = eventData.winners[0].second.image) !== null && _b !== void 0 ? _b : '';
                                }
                                if (imageArray[j].fieldname === "third") {
                                    imagesss = (_c = eventData.winners[0].third.image) !== null && _c !== void 0 ? _c : '';
                                }
                                yield cloudnaryConfig_1.default.v2.uploader.upload(imageArray[j].path, options).then((response) => __awaiter(void 0, void 0, void 0, function* () {
                                    data.push({ name: values[i], image: response === null || response === void 0 ? void 0 : response.url });
                                    const imagePath = path_1.default.join(folder, imageArray[j].filename);
                                    fs_1.default.unlink(imagePath, (err) => {
                                        if (err) {
                                            console.error(err);
                                        }
                                        else {
                                            console.log("Event image deleted successfully");
                                        }
                                    });
                                    if (imagesss !== undefined) {
                                        const imagesUrl = imagesss.split("/");
                                        const imageData = imagesUrl[imagesUrl.length - 1];
                                        const img = imageData.split(".")[0];
                                        const destroyResult = yield cloudnaryConfig_1.default.v2.uploader.destroy(`winners/${img}`);
                                        if (destroyResult.result === 'ok') {
                                        }
                                        else {
                                            console.log('Cloudinary error:', destroyResult.result);
                                        }
                                    }
                                }));
                                count++;
                            }
                        }
                        if (count === 0) {
                            if (array[i] === "first") {
                                data.push({ name: values[i], image: (_d = eventData === null || eventData === void 0 ? void 0 : eventData.winners[0].first) === null || _d === void 0 ? void 0 : _d.image });
                            }
                            if (array[i] === "second") {
                                data.push({ name: values[i], image: (_e = eventData === null || eventData === void 0 ? void 0 : eventData.winners[0].second) === null || _e === void 0 ? void 0 : _e.image });
                            }
                            if (array[i] === "third") {
                                data.push({ name: values[i], image: (_f = eventData === null || eventData === void 0 ? void 0 : eventData.winners[0].third) === null || _f === void 0 ? void 0 : _f.image });
                            }
                        }
                        count = 0;
                        k++;
                    }
                    yield eventModel_1.default.updateOne({ _id: id }, { $set: { winners: [{ first: data[0], second: data[1], third: data[2] }] } }).then(() => {
                        obj = {
                            message: "Edit successful",
                            status: 200,
                            error: ""
                        };
                        res.status(obj.status).send(obj);
                    }).catch((error) => {
                        console.log("error");
                    });
                }
                else {
                    const array = [
                        {
                            first: {
                                name: firstName,
                                image: (_h = (_g = eventData === null || eventData === void 0 ? void 0 : eventData.winners[0]) === null || _g === void 0 ? void 0 : _g.first) === null || _h === void 0 ? void 0 : _h.image
                            },
                            second: {
                                name: secondName,
                                image: (_k = (_j = eventData === null || eventData === void 0 ? void 0 : eventData.winners[0]) === null || _j === void 0 ? void 0 : _j.second) === null || _k === void 0 ? void 0 : _k.image
                            },
                            third: {
                                name: thirdName,
                                image: (_m = (_l = eventData === null || eventData === void 0 ? void 0 : eventData.winners[0]) === null || _l === void 0 ? void 0 : _l.third) === null || _m === void 0 ? void 0 : _m.image
                            }
                        },
                    ];
                    console.log(array, "this  is the result array");
                    yield eventModel_1.default.updateOne({ _id: id }, { $set: { winners: array } }).then(() => {
                        obj = {
                            message: "Event updated successfully",
                            status: 200,
                            error: ""
                        };
                        res.status(obj.status).send(obj);
                    });
                }
            }
        }
        else {
            obj = {
                message: '',
                status: 404,
                error: 'Event Data Not found,Please try after some time!'
            };
            res.status(obj.status).send(obj);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.editWinner = editWinner;
