"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQuestions = exports.deleteQuestion = exports.updateQuestion = exports.getQuestions = exports.createMultipleQuestions = exports.createQuestion = void 0;
const exam_model_1 = require("./exam.model");
const async_handler_1 = require("../../../utils/async-handler");
const error_response_1 = __importDefault(require("../../../utils/error-response"));
const course_service_1 = require("../course/course.service");
const ai_services_1 = require("../ai/ai.services");
const formatQuestion_1 = require("../../../utils/helper-func/formatQuestion");
// import { ErrorResponse } from "../../../utils/error-response";
// Add question to exam
exports.createQuestion = (0, async_handler_1.asyncHandler)(async (req, res) => {
    var _a, _b;
    const exam = await exam_model_1.Exam.findById(req.body.exam);
    if (!exam) {
        throw new error_response_1.default("Exam not found", 404);
    }
    // Only admin or the lecturer who created the exam can add questions
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "admin" &&
        exam.lecturer.toString() !== ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id)) {
        throw new error_response_1.default("Not authorized to add questions to this exam", 403);
    }
    // Validate question type and required fields
    if (req.body.type === "mcq" &&
        (!req.body.options || !req.body.correctAnswer)) {
        throw new error_response_1.default("MCQ questions require options and correct answer", 400);
    }
    const question = await exam_model_1.Question.create(req.body);
    res.status(201).json({
        success: true,
        data: question,
    });
});
// Create Multiple questions to exam 
exports.createMultipleQuestions = (0, async_handler_1.asyncHandler)(async (req, res) => {
    var _a, _b;
    const exam = await exam_model_1.Exam.findById(req.body.exam);
    if (!exam) {
        throw new error_response_1.default("Exam not found", 404);
    }
    // Only admin or the lecturer who created the exam can add questions
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "admin" &&
        exam.lecturer.toString() !== ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id)) {
        throw new error_response_1.default("Not authorized to add questions to this exam", 403);
    }
    const questions = await exam_model_1.Question.create(req.body.questions);
    res.status(201).json({
        success: true,
        data: questions,
    });
});
// Get questions for an exam
exports.getQuestions = (0, async_handler_1.asyncHandler)(async (req, res) => {
    var _a;
    const { exam } = req.query;
    const examDoc = await exam_model_1.Exam.findById(exam);
    if (!examDoc) {
        throw new error_response_1.default("Exam not found", 404);
    }
    // Students can only view questions of published exams
    // if (req.user?.role === "student" && !examDoc.isPublished) {
    //   throw new ErrorResponse("Not authorized to view these questions", 403);
    // }
    const questions = await exam_model_1.Question.find({ exam }).select(((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === "student" ? "-correctAnswer" : "+correctAnswer");
    res.status(200).json({
        success: true,
        data: questions,
    });
});
// Update question
exports.updateQuestion = (0, async_handler_1.asyncHandler)(async (req, res) => {
    var _a, _b;
    let question = await exam_model_1.Question.findById(req.params.id);
    if (!question) {
        throw new error_response_1.default("Question not found", 404);
    }
    const exam = await exam_model_1.Exam.findById(question.exam);
    if (!exam) {
        throw new error_response_1.default("Associated exam not found", 404);
    }
    // Only admin or the lecturer who created the exam can update questions
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "admin" &&
        exam.lecturer.toString() !== ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id)) {
        throw new error_response_1.default("Not authorized to update this question", 403);
    }
    // Validate question type and required fields
    if (req.body.type === "mcq" &&
        (!req.body.options || !req.body.correctAnswer)) {
        throw new error_response_1.default("MCQ questions require options and correct answer", 400);
    }
    question = await exam_model_1.Question.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        success: true,
        data: question,
    });
});
// Delete question
exports.deleteQuestion = (0, async_handler_1.asyncHandler)(async (req, res) => {
    var _a, _b;
    const question = await exam_model_1.Question.findById(req.params.id);
    if (!question) {
        throw new error_response_1.default("Question not found", 404);
    }
    const exam = await exam_model_1.Exam.findById(question.exam);
    if (!exam) {
        throw new error_response_1.default("Associated exam not found", 404);
    }
    // Only admin or the lecturer who created the exam can delete questions
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "admin" &&
        exam.lecturer.toString() !== ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id)) {
        throw new error_response_1.default("Not authorized to delete this question", 403);
    }
    await question.deleteOne();
    res.status(200).json({
        success: true,
        data: {},
    });
});
exports.generateQuestions = (0, async_handler_1.asyncHandler)(async (req, res) => {
    var _a, _b;
    const { examId, course_id, difficulty, question_types, num_questions, additional_context, mark } = req.body;
    const exam = await exam_model_1.Exam.findById(examId);
    if (!exam) {
        throw new error_response_1.default("Exam not found", 404);
    }
    // Only admin or the lecturer who created the exam can add questions
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "admin" &&
        exam.lecturer.toString() !== ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id)) {
        throw new error_response_1.default("Not authorized to add questions to this exam", 403);
    }
    if (!course_id || !difficulty || !question_types || !num_questions) {
        throw new error_response_1.default("Please provide all required fields", 400);
    }
    const course = await course_service_1.CourseService.getCourseById(course_id);
    // Call AI service to generate questions
    const generatedQuestions = await (0, ai_services_1.generateQuestionWithAI)({
        course_id,
        subject: (course === null || course === void 0 ? void 0 : course.title) || "No suject title provided",
        difficulty,
        question_types,
        num_questions,
        additional_context,
        mark
    });
    if (!generatedQuestions || generatedQuestions.length === 0) {
        throw new error_response_1.default("No questions generated", 500);
    }
    const questions = await exam_model_1.Question.create((0, formatQuestion_1.formatQuestion)(generatedQuestions, exam._id));
    // Save generated questions to the database
    res.status(200).json({
        success: true,
        data: questions,
    });
});
