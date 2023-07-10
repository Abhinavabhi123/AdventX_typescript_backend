"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// * Creating community schema by obey the interface order
const communitySchema = new mongoose_1.Schema({
    communityName: {
        type: String,
        required: true,
    },
    members: [
        {
            userId: {
                type: String,
                ref: "User",
                required: true,
            },
            access: {
                type: Boolean,
                default: true,
            },
        },
    ],
    chat: [
        {
            userId: {
                type: mongoose_1.SchemaTypes.ObjectId,
                ref: "User",
                required: false,
            },
        },
    ],
    logo: {
        type: String,
        required: false,
    },
    status: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("Community", communitySchema);
