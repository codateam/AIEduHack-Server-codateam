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
exports.Answer = exports.Question = exports.Exam = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const examSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    course: { type: mongoose_1.Schema.Types.ObjectId, ref: "Course", required: true },
    lecturer: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    organizationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Organization",
        required: [true, "Organization is required"],
    },
    session: { type: String, required: true },
    semester: { type: String, enum: ["First", "Second"], required: true },
    examType: {
        type: String,
        enum: ["regular", "resit", "makeup"],
        required: true,
    },
    duration: { type: Number, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    totalMarks: { type: Number, required: true },
    isPublished: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });
// Indexes for organization-scoped queries
examSchema.index({ organizationId: 1, course: 1 });
examSchema.index({ organizationId: 1, lecturer: 1 });
examSchema.index({ organizationId: 1, session: 1, semester: 1 });
const questionSchema = new mongoose_1.Schema({
    exam: { type: mongoose_1.Schema.Types.ObjectId, ref: "Exam", required: true },
    // organizationId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Organization",
    //   required: [true, "Organization is required"],
    // },
    type: {
        type: String,
        enum: ["mcq", "theory", "german"],
        required: true,
    },
    text: { type: String, required: true },
    options: [{ type: String }],
    correctAnswer: { type: String },
    mark: { type: Number, required: true },
}, { timestamps: true });
// Indexes for organization-scoped queries
questionSchema.index({ organizationId: 1, exam: 1 });
const answerSchema = new mongoose_1.Schema({
    student: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    exam: { type: mongoose_1.Schema.Types.ObjectId, ref: "Exam" },
    question: { type: mongoose_1.Schema.Types.ObjectId, ref: "Question", required: true },
    organizationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Organization",
        required: [true, "Organization is required"],
    },
    selectedAnswer: { type: String },
    writtenAnswer: { type: String },
    score: { type: Number, default: 0 },
    graded: { type: Boolean, default: false },
    remainingTime: { type: Number },
    feedback: { type: String, default: "" }
}, { timestamps: true });
// Indexes for organization-scoped queries
answerSchema.index({ organizationId: 1, student: 1, exam: 1 });
answerSchema.index({ organizationId: 1, exam: 1, question: 1 });
exports.Exam = mongoose_1.default.model("Exam", examSchema);
exports.Question = mongoose_1.default.model("Question", questionSchema);
exports.Answer = mongoose_1.default.model("Answer", answerSchema);
