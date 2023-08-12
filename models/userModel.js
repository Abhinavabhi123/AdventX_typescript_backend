"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    mobile: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        default: true,
    },
    date_of_birth: {
        type: String,
        required: false,
    },
    image: {
        type: String,
        required: false,
    },
    community: [
        {
            communityId: mongodb_1.ObjectId,
            _id: false,
        },
    ],
    about: {
        type: String,
        required: false,
    },
    address: {
        houseName: String,
        locality: String,
        area: String,
        district: String,
        state: String,
        zipCode: Number,
    },
    primeMember: {
        type: Boolean,
        default: false,
    },
    paymentId: {
        type: String,
        required: false
    },
    height: {
        type: Number,
        required: false,
    },
    weight: {
        type: Number,
        required: false,
    },
    vehicles: [
        {
            vehicleId: {
                type: [mongoose_1.SchemaTypes.ObjectId],
                ref: "Vehicles",
                required: false,
            },
            _id: false
        },
    ],
    eventParticipation: [
        {
            eventId: {
                type: mongoose_1.SchemaTypes.ObjectId,
                ref: "Event"
            },
            confirmed: {
                type: String,
                default: "confirmed"
            },
            _id: false
        },
    ],
    license: {
        licenseNumber: String,
        ExpiryDate: String,
        image: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("User", userSchema);
