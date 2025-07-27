"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.llmGrade = exports.autoGrade = exports.getResult = exports.finishExam = exports.submitAnswer = exports.startExam = exports.deleteQuestion = exports.updateQuestion = exports.getQuestions = exports.addQuestion = exports.publishExam = exports.deleteExam = exports.updateExam = exports.getExam = exports.getExams = exports.createExam = void 0;
const exam_model_1 = require("./exam.model");
const async_handler_1 = require("../../../utils/async-handler");
const error_response_1 = __importDefault(require("../../../utils/error-response"));
// Create a new exam
exports.createExam = (0, async_handler_1.asyncHandler)(async (req, res) => {
    var _a, _b, _c, _d;
    // Only admin and lecturer can create exams
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "admin" && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== "lecturer") {
        throw new error_response_1.default("Not authorized to create exams", 403);
    }
    const exam = await exam_model_1.Exam.create(Object.assign(Object.assign({}, req.body), { lecturer: (_c = req.user) === null || _c === void 0 ? void 0 : _c.id, organizationId: (_d = req.user) === null || _d === void 0 ? void 0 : _d.organizationId }));
    res.status(201).json({
        success: true,
        data: exam,
    });
});
// Get all exams for a course
exports.getExams = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { course } = req.query;
    const query = course ? { course } : {};
    const exams = await exam_model_1.Exam.find(query)
        .populate("course", "code title")
        .populate("lecturer", "firstName lastName");
    res.status(200).json({
        success: true,
        data: exams,
    });
});
// Get single exam
exports.getExam = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const exam = await exam_model_1.Exam.findById(req.params.id)
        .populate("course", "code title")
        .populate("lecturer", "firstName lastName");
    if (!exam) {
        throw new error_response_1.default("Exam not found", 404);
    }
    // Students can only view published exams
    // if (req.user?.role === "student" && !exam.isPublished) {
    //   throw new ErrorResponse("Not authorized to view this exam", 403);
    // }
    res.status(200).json({
        success: true,
        data: exam,
    });
});
// Update exam
exports.updateExam = (0, async_handler_1.asyncHandler)(async (req, res) => {
    var _a, _b;
    let exam = await exam_model_1.Exam.findById(req.params.id);
    if (!exam) {
        throw new error_response_1.default("Exam not found", 404);
    }
    // Only admin or the lecturer who created the exam can update it
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "admin" && exam.lecturer.toString() !== ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id)) {
        throw new error_response_1.default("Not authorized to update this exam", 403);
    }
    exam = await exam_model_1.Exam.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        success: true,
        data: exam,
    });
});
// Delete exam
exports.deleteExam = (0, async_handler_1.asyncHandler)(async (req, res) => {
    var _a, _b;
    const exam = await exam_model_1.Exam.findById(req.params.id);
    if (!exam) {
        throw new error_response_1.default("Exam not found", 404);
    }
    // Only admin or the lecturer who created the exam can delete it
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "admin" && exam.lecturer.toString() !== ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id)) {
        throw new error_response_1.default("Not authorized to delete this exam", 403);
    }
    await exam.deleteOne();
    res.status(200).json({
        success: true,
        data: {},
    });
});
// Publish exam
exports.publishExam = (0, async_handler_1.asyncHandler)(async (req, res) => {
    var _a, _b;
    const exam = await exam_model_1.Exam.findById(req.params.id);
    if (!exam) {
        throw new error_response_1.default("Exam not found", 404);
    }
    // Only admin or the lecturer who created the exam can publish it
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "admin" && exam.lecturer.toString() !== ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id)) {
        throw new error_response_1.default("Not authorized to publish this exam", 403);
    }
    exam.isPublished = true;
    await exam.save();
    res.status(200).json({
        success: true,
        data: exam,
    });
});
// Add a question to an exam
exports.addQuestion = (0, async_handler_1.asyncHandler)(async (req, res) => {
    var _a, _b;
    const exam = await exam_model_1.Exam.findById(req.body.exam);
    if (!exam) {
        throw new error_response_1.default("Exam not found", 404);
    }
    // Only admin or the lecturer who created the exam can add questions
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "admin" && exam.lecturer.toString() !== ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id)) {
        throw new error_response_1.default("Not authorized to add questions to this exam", 403);
    }
    const question = await exam_model_1.Question.create(Object.assign(Object.assign({}, req.body), { exam: exam._id }));
    res.status(201).json({
        success: true,
        data: question,
    });
});
// Get questions for an exam
exports.getQuestions = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { exam } = req.query;
    if (!exam) {
        throw new error_response_1.default("Please provide an exam ID", 400);
    }
    const questions = await exam_model_1.Question.find({ exam });
    res.status(200).json({
        success: true,
        data: questions,
    });
});
// Update a question
exports.updateQuestion = (0, async_handler_1.asyncHandler)(async (req, res) => {
    var _a, _b;
    let question = await exam_model_1.Question.findById(req.params.id);
    if (!question) {
        throw new error_response_1.default("Question not found", 404);
    }
    const exam = await exam_model_1.Exam.findById(question.exam);
    if (!exam) {
        throw new error_response_1.default("Exam not found", 404);
    }
    // Only admin or the lecturer who created the exam can update questions
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "admin" &&
        exam.lecturer.toString() !== ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id)) {
        throw new error_response_1.default("Not authorized to update this question", 403);
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
// Delete a question
exports.deleteQuestion = (0, async_handler_1.asyncHandler)(async (req, res) => {
    var _a, _b;
    const question = await exam_model_1.Question.findById(req.params.id);
    if (!question) {
        throw new error_response_1.default("Question not found", 404);
    }
    const exam = await exam_model_1.Exam.findById(question.exam);
    if (!exam) {
        throw new error_response_1.default("Exam not found", 404);
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
// Start an exam
exports.startExam = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const exam = await exam_model_1.Exam.findById(req.params.id);
    if (!exam) {
        throw new error_response_1.default("Exam not found", 404);
    }
    if (!exam.isPublished) {
        throw new error_response_1.default("This exam is not yet published", 400);
    }
    const now = new Date();
    if (now < exam.startTime) {
        throw new error_response_1.default("This exam has not started yet", 400);
    }
    if (now > exam.endTime) {
        throw new error_response_1.default("This exam has already ended", 400);
    }
    res.status(200).json({
        success: true,
        data: {
            exam,
            startTime: now,
            remainingTime: Math.floor((exam.endTime.getTime() - now.getTime()) / 1000), // in seconds
        },
    });
});
// Submit an answer
exports.submitAnswer = (0, async_handler_1.asyncHandler)(async (req, res) => {
    var _a, _b;
    const { examId, questionId, answer } = req.body;
    const exam = await exam_model_1.Exam.findById(examId);
    if (!exam) {
        throw new error_response_1.default("Exam not found", 404);
    }
    const question = await exam_model_1.Question.findById(questionId);
    if (!question) {
        throw new error_response_1.default("Question not found", 404);
    }
    const now = new Date();
    if (now > exam.endTime) {
        throw new error_response_1.default("This exam has already ended", 400);
    }
    let answerDoc = await exam_model_1.Answer.findOne({
        student: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
        exam: examId,
        question: questionId,
    });
    if (answerDoc) {
        // Update existing answer
        if (question.type === "mcq") {
            answerDoc.selectedAnswer = answer;
        }
        else {
            answerDoc.writtenAnswer = answer;
        }
        await answerDoc.save();
    }
    else {
        // Create new answer
        answerDoc = await exam_model_1.Answer.create(Object.assign({ student: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id, exam: examId, question: questionId }, (question.type === "mcq"
            ? { selectedAnswer: answer }
            : { writtenAnswer: answer })));
    }
    res.status(200).json({
        success: true,
        data: answerDoc,
    });
});
// Finish exam
exports.finishExam = (0, async_handler_1.asyncHandler)(async (req, res) => {
    var _a;
    const exam = await exam_model_1.Exam.findById(req.params.id);
    if (!exam) {
        throw new error_response_1.default("Exam not found", 404);
    }
    const answers = await exam_model_1.Answer.find({
        student: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
        exam: exam._id,
    });
    res.status(200).json({
        success: true,
        data: {
            exam,
            answersSubmitted: answers.length,
            submissionTime: new Date(),
        },
    });
});
// Get exam result
exports.getResult = (0, async_handler_1.asyncHandler)(async (req, res) => {
    var _a;
    const exam = await exam_model_1.Exam.findById(req.params.examId);
    if (!exam) {
        throw new error_response_1.default("Exam not found", 404);
    }
    const answers = await exam_model_1.Answer.find({
        student: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
        exam: exam._id,
    }).populate("question");
    const totalScore = answers.reduce((acc, answer) => acc + (answer.score || 0), 0);
    res.status(200).json({
        success: true,
        data: {
            exam,
            answers,
            totalScore,
            totalMarks: exam.totalMarks,
            percentage: (totalScore / exam.totalMarks) * 100,
        },
    });
});
// Auto-grade MCQ questions
exports.autoGrade = (0, async_handler_1.asyncHandler)(async (req, res) => {
    var _a, _b;
    const exam = await exam_model_1.Exam.findById(req.params.id);
    if (!exam) {
        throw new error_response_1.default("Exam not found", 404);
    }
    // Only admin or the lecturer who created the exam can grade
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "admin" && exam.lecturer.toString() !== ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id)) {
        throw new error_response_1.default("Not authorized to grade this exam", 403);
    }
    const mcqQuestions = await exam_model_1.Question.find({ exam: exam._id, type: "mcq" });
    const mcqAnswers = await exam_model_1.Answer.find({
        exam: exam._id,
        question: { $in: mcqQuestions.map((q) => q._id) },
    });
    // Grade MCQ answers
    for (const answer of mcqAnswers) {
        const question = mcqQuestions.find((q) => q._id.equals(answer.question));
        if (question && answer.selectedAnswer === question.correctAnswer) {
            answer.score = question.mark;
        }
        else {
            answer.score = 0;
        }
        answer.graded = true;
        await answer.save();
    }
    res.status(200).json({
        success: true,
        data: {
            gradedAnswers: mcqAnswers.length,
        },
    });
});
// LLM-based grading for theory questions
exports.llmGrade = (0, async_handler_1.asyncHandler)(async (req, res) => {
    var _a, _b;
    const exam = await exam_model_1.Exam.findById(req.params.id);
    if (!exam) {
        throw new error_response_1.default("Exam not found", 404);
    }
    // Only admin or the lecturer who created the exam can grade
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "admin" && exam.lecturer.toString() !== ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id)) {
        throw new error_response_1.default("Not authorized to grade this exam", 403);
    }
    // Note: This is a placeholder for LLM integration
    // In a real implementation, you would:
    // 1. Get all theory questions and their answers
    // 2. Send them to an LLM service for grading
    // 3. Update the scores based on LLM response
    res.status(200).json({
        success: true,
        message: "LLM grading feature is under development",
    });
});
