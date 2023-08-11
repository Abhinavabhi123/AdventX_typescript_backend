"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const mongoose_1 = require("mongoose");
const eventSchema = new mongoose_1.Schema({
    eventName: {
        type: String,
        required: true,
        unique: true
    },
    subName: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    eventType: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    fee: {
        type: Number,
        required: true
    },
    firstPrice: {
        type: Number,
        required: true
    },
    secondPrice: {
        type: Number,
        required: true
    },
    thirdPrice: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    primaryImage: {
        type: String,
        required: true
    },
    earnings: {
        type: Number,
        required: false
    },
    subTotal: {
        type: Number,
        required: false
    },
    is_completed: {
        type: Boolean,
        default: false
    },
    participants: [
        {
            userId: {
                type: mongodb_1.ObjectId,
                ref: "User"
            },
            vehicleId: {
                type: mongodb_1.ObjectId,
                ref: "Vehicles"
            },
            paymentId: {
                required: true,
                type: String
            },
            licenseNo: {
                type: String,
                required: true
            },
            _id: false
        }
    ],
    winners: [
        {
            first: {
                name: {
                    type: String,
                    requires: true
                },
                image: {
                    type: String,
                    required: true
                }
            },
            second: {
                name: {
                    type: String,
                    requires: true
                },
                image: {
                    type: String,
                    required: true
                }
            },
            third: {
                name: {
                    type: String,
                    requires: true
                },
                image: {
                    type: String,
                    required: true
                }
            },
            _id: false
        },
    ],
    images: {
        type: [String],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)("Event", eventSchema);
