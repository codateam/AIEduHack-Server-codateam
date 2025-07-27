"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const courseSchema = new mongoose_1.Schema({
    code: {
        type: String,
        required: [true, "Course code is required"],
        trim: true,
        uppercase: true,
    },
    title: {
        type: String,
        required: [true, "Course title is required"],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    creditUnit: {
        type: Number,
        required: [true, "Credit unit is required"],
        min: [1, "Credit unit must be at least 1"],
    },
    level: {
        type: Number,
        required: [true, "Level is required"],
        enum: [100, 200, 300, 400, 500],
    },
    semester: {
        type: String,
        required: [true, "Semester is required"],
        enum: ["First", "Second"],
    },
    department: {
        type: String,
        required: [true, "Department is required"],
        trim: true,
    },
    lecturers: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "At least one lecturer is required"],
        },
    ],
    organizationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Organization",
        required: [true, "Organization is required"],
    },
    courseMaterials: [
        {
            type: String,
            default: [],
        },
    ]
}, {
    timestamps: true,
});
// Compound index for organization-scoped course codes
courseSchema.index({ organizationId: 1, code: 1 }, { unique: true });
courseSchema.index({ organizationId: 1, department: 1 });
courseSchema.index({ organizationId: 1, level: 1, semester: 1 });
exports.default = mongoose_1.default.model("Course", courseSchema);
