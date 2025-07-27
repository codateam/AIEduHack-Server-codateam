"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const organizationSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Organization name is required"],
        trim: true,
        maxlength: [100, "Organization name cannot exceed 100 characters"],
    },
    code: {
        type: String,
        required: [true, "Organization code is required"],
        unique: true,
        trim: true,
        uppercase: true,
        maxlength: [20, "Organization code cannot exceed 20 characters"],
        match: [/^[A-Z0-9_]+$/, "Organization code can only contain uppercase letters, numbers, and underscores"],
    },
    type: {
        type: String,
        required: [true, "Organization type is required"],
        enum: {
            values: ["university", "college", "school", "institute", "academy"],
            message: "Organization type must be one of: university, college, school, institute, academy",
        },
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, "Description cannot exceed 500 characters"],
    },
    mainAdmin: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Main admin is required"],
    },
    address: {
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        country: { type: String, trim: true },
        postalCode: { type: String, trim: true },
    },
    contact: {
        email: {
            type: String,
            trim: true,
            lowercase: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
        },
        phone: { type: String, trim: true },
        website: { type: String, trim: true },
    },
    settings: {
        allowSelfRegistration: {
            type: Boolean,
            default: true,
        },
        requireApproval: {
            type: Boolean,
            default: false,
        },
        maxStudents: {
            type: Number,
            min: [1, "Maximum students must be at least 1"],
        },
        maxLecturers: {
            type: Number,
            min: [1, "Maximum lecturers must be at least 1"],
        },
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isApproved: {
        type: Boolean,
        default: true,
    },
    approvedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    approvedAt: {
        type: Date,
    },
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        },
    },
});
// Indexes for better performance
organizationSchema.index({ code: 1 });
organizationSchema.index({ isActive: 1 });
const Organization = mongoose_1.default.model("Organization", organizationSchema);
exports.default = Organization;
