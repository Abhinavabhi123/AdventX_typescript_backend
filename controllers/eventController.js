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
exports.addWinners = exports.editEventImage = exports.editEvent = exports.getUserAllEvents = exports.getAllEvents = exports.getEvent = exports.getAllUpEvents = exports.deleteEvent = exports.getEventData = exports.getEventDetails = exports.getAllEvent = exports.addEvent = void 0;
const eventModel_1 = __importDefault(require("../models/eventModel"));
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
        const data = yield eventModel_1.default.find();
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
        console.log(req.body);
        // console.log();
        const { firstName, secondName, thirdName, image } = req.body;
    }
    catch (error) {
        console.error(error);
    }
});
exports.addWinners = addWinners;
