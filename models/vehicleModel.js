"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const vehicleScheme = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: "User",
    },
    vehicleNumber: {
        type: String,
        required: true,
    },
    vehicleName: {
        type: String,
        required: true,
    },
    vehicleType: {
        type: String,
        required: true,
    },
    wheelCount: {
        type: Number,
        required: true,
    },
    fuelType: {
        type: String,
        required: true,
    },
    ownerName: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
        default: [],
    },
    checked: {
        type: Boolean,
        default: true,
    },
    approved: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("Vehicles", vehicleScheme);
