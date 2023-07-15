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
exports.changeCommunity = exports.addUserECommunity = exports.changeComStatus = exports.getCommunityDetails = exports.communities = exports.createCommunity = exports.getComUser = exports.getCommunityUsers = void 0;
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
            error: "",
        };
        console.log(req.body, "Datrtttt");
        const { cName, status, cMembers } = req.body;
        console.log(req.file, "file");
        const CommData = yield communityModel_1.default.findOne({ communityName: cName });
        console.log(CommData, "Dataaa");
        if (CommData) {
            console.log("yes");
        }
        else {
            console.log(cMembers);
            const mData = cMembers;
            let members = [];
            if (!req.body.cName ||
                !req.body.status ||
                !req.body.cMembers ||
                !req.file ||
                !req.file.path) {
                console.error("error");
                obj = {
                    message: "",
                    status: 404,
                    error: `Resource not found,Please try again later`,
                };
                res.status(obj.status).send(obj);
                return;
            }
            let fileName = "";
            if (req.file) {
                fileName = req.file.filename;
            }
            mData.map((item) => {
                const value = {
                    userId: item._id,
                    status: true,
                };
                members.push(value);
            });
            console.log(members, "userData");
            const data = new communityModel_1.default({
                communityName: cName,
                status: status,
                members: members,
                logo: fileName,
            })
                .save()
                .then((data) => {
                console.log(data);
                mData.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                    yield userModel_1.default.updateOne({ _id: item._id }, { $push: { community: { communityId: data._id } } });
                }));
                obj = {
                    message: "Community Created Successfully",
                    status: 200,
                    error: "",
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
            community: {},
        };
        const commData = yield communityModel_1.default.find();
        if (commData) {
            obj = {
                message: "Communities Fetched",
                status: 200,
                error: "",
                community: commData,
            };
            res.status(obj.status).send(obj);
        }
        else {
            obj = {
                message: "No Community founded",
                status: 200,
                error: "",
                community: commData,
            };
            res.status(obj.status).send(obj);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.communities = communities;
const getCommunityDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let obj = {
            message: "",
            status: 0,
            error: "",
        };
        const id = req.params.id;
        const commData = yield communityModel_1.default.findOne({ _id: id }).populate({
            path: "members.userId",
            model: "User",
        });
        if (commData) {
            // const data = commData?.members
            // console.log(data)
            // // let hello = data.populate({path:userId,model:"User"})
            // const array:string[]=[]
            // data.map((item)=>{
            //   console.log(item?.userId);
            //   const hello = item.populate('User')
            //   // array.push(item?.userId)
            // })
            obj = {
                message: "Data fetched Successfully",
                status: 200,
                error: "",
                commData,
            };
            res.status(obj.status).send(obj);
        }
        else {
            console.log("Data not fetched");
            obj = {
                message: "",
                status: 404,
                error: "Data Not fetched",
            };
            res.status(obj.status).send(obj);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.getCommunityDetails = getCommunityDetails;
const changeComStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let obj = {
            message: "",
            status: 0,
            error: "",
        };
        console.log(req.body);
        const { id, userId } = req.body;
        const community = yield communityModel_1.default.findOne({ _id: id });
        if (community) {
            const members = community.members;
            const user = members.map((member) => {
                if (member.userId === userId) {
                    member.access = !member.access;
                }
                return member;
            });
            community.members = user;
            yield community.save().then(() => {
                obj = {
                    message: "Status changed",
                    status: 201,
                    error: "",
                };
                res.status(obj.status).send(obj);
            });
        }
        else {
            obj = {
                message: "",
                status: 404,
                error: "Data not found",
            };
            res.status(obj.status).send(obj);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.changeComStatus = changeComStatus;
const addUserECommunity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commId = req.query.id;
        let obj = {
            message: "",
            status: 0,
            error: ""
        };
        const userData = yield userModel_1.default.find({ $and: [{ status: true }, { primeMember: true }, { community: { $nin: { communityId: commId } } }] }, { _id: 1, firstName: 1, lastName: 1, community: 1 });
        if (userData) {
            obj = {
                message: "Data fetched Successfully",
                status: 200,
                error: '',
                userData
            };
            res.status(obj.status).send(obj);
        }
        else {
            obj = {
                message: "",
                status: 404,
                error: 'Data not found',
            };
            res.status(obj.status).send(obj);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.addUserECommunity = addUserECommunity;
const changeCommunity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
    }
    catch (error) {
        console.error(error);
    }
});
exports.changeCommunity = changeCommunity;
