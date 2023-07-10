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
exports.communities = exports.createCommunity = exports.getComUser = exports.getCommunityUsers = void 0;
const mongodb_1 = require("mongodb");
const userModel_1 = __importDefault(require("../models/userModel"));
const communityModel_1 = __importDefault(require("../models/communityModel"));
const getCommunityUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = yield userModel_1.default.find({
            $and: [{ status: true }, { primeMember: true }],
        });
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
        const id = req.query.id;
        console.log(id, "idddddd");
        const userData = yield userModel_1.default.findOne({ _id: id });
        if (userData) {
            console.log("no data");
            res.status(200).send(userData);
        }
    }
    catch (error) {
        console.error();
    }
});
exports.getComUser = getComUser;
// * Creating community
const createCommunity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let obj = {
            message: "",
            status: 0,
            error: ""
        };
        console.log("ethi");
        console.log(req.body);
        const { cName, status, cMembers } = req.body;
        const CommData = yield communityModel_1.default.findOne({ communityName: cName });
        console.log(CommData, "Dataaa");
        if (CommData) {
            console.log("yes");
        }
        else {
            console.log(cMembers);
            const mData = cMembers;
            let members = [];
            console.log(mongodb_1.ObjectId);
            mData.map((item) => {
                const value = {
                    userId: item._id,
                    status: true
                };
                members.push(value);
            });
            console.log(members, "userData");
            const data = new communityModel_1.default({
                communityName: cName,
                status: status,
                members: members
            }).save().then((data) => {
                console.log(data);
                mData.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                    yield userModel_1.default.updateOne({ _id: item._id }, { $push: { community: { communityId: data._id } } });
                }));
                obj = {
                    message: "Community Created Successfully",
                    status: 200,
                    error: ''
                };
                res.status(obj.status).send(obj);
            });
            console.log("no");
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.createCommunity = createCommunity;
const communities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let obj = {
            message: "",
            status: 0,
            error: "",
            community: {}
        };
        const commData = yield communityModel_1.default.find();
        if (commData) {
            obj = {
                message: 'Communities Fetched',
                status: 200,
                error: '',
                community: commData
            };
            res.status(obj.status).send(obj);
        }
        else {
            obj = {
                message: 'No Community founded',
                status: 200,
                error: '',
                community: commData
            };
            res.status(obj.status).send(obj);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.communities = communities;
