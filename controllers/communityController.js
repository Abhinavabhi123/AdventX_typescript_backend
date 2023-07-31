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
exports.communityData = exports.userCommunities = exports.deleteCommunity = exports.changeCommunity = exports.addUserECommunity = exports.changeComStatus = exports.getCommunityDetails = exports.communities = exports.createCommunity = exports.getComUser = exports.getCommunityUsers = void 0;
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
            error: "",
        };
        const userData = yield userModel_1.default.find({
            $and: [
                { status: true },
                { primeMember: true },
                { community: { $nin: { communityId: commId } } },
            ],
        }, { _id: 1, firstName: 1, lastName: 1, community: 1 });
        if (userData) {
            obj = {
                message: "Data fetched Successfully",
                status: 200,
                error: "",
                userData,
            };
            res.status(obj.status).send(obj);
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
exports.addUserECommunity = addUserECommunity;
const changeCommunity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        console.log(id);
        const { selectedOption, cMembers, inputValue } = req.body;
        console.log(req.body);
        let obj = {
            message: "",
            status: 0,
            error: "",
        };
        if (selectedOption === "" ||
            selectedOption === "select" ||
            inputValue <= 0) {
            obj = {
                message: "",
                status: 204,
                error: "something went wrong, try again",
            };
            res.status(204).send(obj);
        }
        else {
            if (cMembers.length > 0) {
                cMembers.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                    console.log(item);
                    const obj = {
                        userId: item._id,
                        access: true,
                    };
                    yield communityModel_1.default.updateOne({ _id: id }, {
                        $set: { communityName: inputValue, status: selectedOption },
                        $push: { members: obj },
                    });
                    const CommId = new mongodb_1.ObjectId(id);
                    yield userModel_1.default.updateOne({ _id: item._id }, { $push: { community: { communityId: CommId } } });
                }));
            }
            else {
                const data = yield communityModel_1.default.updateOne({ _id: id }, { $set: { communityName: inputValue, status: selectedOption } });
            }
            obj = {
                message: "Community Updated successfully ",
                status: 200,
                error: "something went wrong, try again",
            };
            res.status(200).send(obj);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.changeCommunity = changeCommunity;
const deleteCommunity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        console.log(id);
        let obj = {
            message: "",
            status: 0,
            error: "",
        };
        const data = yield communityModel_1.default.findOne({ _id: id });
        if (data) {
            console.log(data === null || data === void 0 ? void 0 : data.members);
            const members = data === null || data === void 0 ? void 0 : data.members;
            members.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                console.log(item === null || item === void 0 ? void 0 : item.userId);
                const userId = item === null || item === void 0 ? void 0 : item.userId;
                yield userModel_1.default.updateOne({ _id: userId }, { $pull: { community: { communityId: id } } });
            }));
            (() => __awaiter(void 0, void 0, void 0, function* () {
                yield communityModel_1.default.deleteOne({ _id: id });
            }))().then(() => {
                obj = {
                    message: "Deleted successfully",
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
                error: "content not found",
            };
            res.status(obj.status).send(obj);
        }
        console.log("ethi");
    }
    catch (error) {
        console.error(error);
    }
});
exports.deleteCommunity = deleteCommunity;
const userCommunities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let obj = {
            message: "",
            status: 0,
            error: "",
        };
        const { id } = req.params;
        if (id) {
            const userData = yield userModel_1.default.findOne({ _id: id }, { community: 1, _id: 0 });
            if (userData) {
                const community = userData === null || userData === void 0 ? void 0 : userData.community;
                let array = [];
                yield Promise.all(community.map((item, i) => __awaiter(void 0, void 0, void 0, function* () {
                    const communityData = yield communityModel_1.default.findOne({ $and: [
                            { _id: String(item === null || item === void 0 ? void 0 : item.communityId) }, { status: "Active" }
                        ]
                    });
                    array.push(communityData);
                })));
                obj = {
                    message: 'Data fetched successfully',
                    status: 200,
                    error: '',
                    array
                };
                res.status(obj.status).send(obj);
            }
            else {
                obj = {
                    message: "",
                    status: 404,
                    error: "User data not found",
                };
                res.status(obj.status).send(obj);
            }
        }
        else {
            obj = {
                message: "",
                status: 404,
                error: `User is not there`,
            };
            res.status(obj.status).send(obj);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.userCommunities = userCommunities;
const communityData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.params);
        console.log(req.query);
    }
    catch (error) {
        console.error(error);
    }
});
exports.communityData = communityData;
