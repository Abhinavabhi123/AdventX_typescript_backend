"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        type: Date,
        required: false,
    },
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
        },
    ],
    eventParticipation: [
        {
            eventId: {
                type: [mongoose_1.SchemaTypes.ObjectId]
            }
        }
    ],
    license: {
        licenseNumber: Number,
        ExpiryDate: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)("User", userSchema);
