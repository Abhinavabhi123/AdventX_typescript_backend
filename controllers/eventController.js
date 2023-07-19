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
exports.addEvent = void 0;
const eventModel_1 = __importDefault(require("../models/eventModel"));
const addEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let obj = {
            message: "",
            status: 0,
            error: ""
        };
        console.log(req.body);
        const { eventName, subTitle, location, date, type, fee, firstPrice, secondPrice, thirdPrice, description, about, imageUrl } = req.body;
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
                primaryImage: imageUrl
            }).save().then((data) => {
                obj = {
                    message: "Data stored successfully",
                    status: 200,
                    error: "",
                    eventId: data._id
                };
                res.status(obj.status).send(obj);
            }).catch((error) => {
                console.log(error);
            });
        }
        else {
            obj = {
                message: "",
                status: 409,
                error: "This event name is already in use"
            };
            res.status(obj.status).send(obj);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.addEvent = addEvent;
