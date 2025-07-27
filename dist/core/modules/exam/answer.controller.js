"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoGradeExam = exports.gradeTheoryAnswer = exports.getStudentAnswers = exports.submitAnswer = exports.saveProgress = void 0;
const exam_model_1 = require("./exam.model");
const async_handler_1 = require("../../../utils/async-handler");
const error_response_1 = __importDefault(require("../../../utils/error-response"));
const response_formater_1 = require("../../../utils/response-formater");
const formatAnswer_1 = require("../../../utils/helper-func/formatAnswer");
const ai_services_1 = require("../ai/ai.services");
// Temporarily save answers for progress tracking
exports.saveProgress = (0, async_handler_1.asyncHandler)(async (req, res) => {
    var _a, _b;
    const { answers, examId, remainingTime } = req.body;
    const studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!Array.isArray(answers) || answers.length === 0) {
        throw new error_response_1.default("Answers must be a non-empty array", 400);
    }
    // Verify exam exists and is published
    const exam = await exam_model_1.Exam.findById(examId);
    if (!exam) {
        throw new error_response_1.default("Exam not found", 404);
    }
    if (!exam.isPublished) {
        throw new error_response_1.default("Exam is not published", 400);
    }
    // Only students can save progress
    if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== "student") {
        throw new error_response_1.default("Only students can save progress", 403);
    }
    // Check if exam is within time window
    // const now = new Date();
    // if (now < exam.startTime || now > exam.endTime) {
    //   throw new ErrorResponse("Exam is not currently active", 400);
    // }
    const savedAnswers = [];
    for (const ans of answers) {
        const { question: questionId, selectedAnswer, writtenAnswer } = ans;
        // Verify question exists
        const question = await exam_model_1.Question.findById(questionId);
        if (!question) {
            throw new error_response_1.default(`Question with id ${questionId} not found`, 404);
        }
        if (question.exam.toString() !== examId) {
            throw new error_response_1.default(`Question with id ${questionId} does not belong to the specified exam`, 400);
        }
        // Create or update answer
        let answer = await exam_model_1.Answer.findOne({
            student: studentId,
            question: questionId,
            exam: examId,
        });
        if (answer) {
            // Update existing answer
            answer.selectedAnswer = selectedAnswer;
            answer.writtenAnswer = writtenAnswer;
            answer.remainingTime = remainingTime;
            await answer.save();
        }
        else {
            // Create new answer
            answer = await exam_model_1.Answer.create({
                student: studentId,
                question: questionId,
                exam: examId,
                selectedAnswer,
                writtenAnswer,
                remainingTime,
            });
        }
        savedAnswers.push(answer);
    }
    (0, response_formater_1.response)(res, "Progress saved successfully", 200, savedAnswers);
});
// Submit answer
exports.submitAnswer = (0, async_handler_1.asyncHandler)(async (req, res) => {
    var _a;
    const { answers, examId } = req.body;
    const studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!Array.isArray(answers) || answers.length === 0) {
        throw new error_response_1.default("Answers must be a non-empty array", 400);
    }
    // Verify exam exists and is published
    const exam = await exam_model_1.Exam.findById(examId);
    if (!exam) {
        throw new error_response_1.default("Exam not found", 404);
    }
    // if (!exam.isPublished) {
    //   throw new ErrorResponse("Exam is not published", 400);
    // }
    // Check if exam has ended
    // const now = new Date();
    // if (now > exam.endTime) {
    //   throw new ErrorResponse("Exam has ended and can no longer be submitted", 400);
    // }
    const submittedAnswers = [];
    let totalOriginalMarks = 0;
    const nonMCQQuestions = [];
    const nonMCQAnswers = [];
    for (const ans of answers) {
        const { question: questionId, selectedAnswer, writtenAnswer } = ans;
        // Verify question exists
        const question = await exam_model_1.Question.findById(questionId);
        if (!question) {
            console.error(`Question with id ${questionId} not found. Skipping.`);
            continue;
        }
        if (question.exam.toString() !== examId) {
            console.error(`Question with id ${questionId} does not belong to exam ${examId}. Skipping.`);
            continue;
        }
        totalOriginalMarks += question.mark;
        // Create or update answer
        let answer = await exam_model_1.Answer.findOne({
            student: studentId,
            question: questionId,
            exam: examId,
        });
        if (answer) {
            // Update existing answer
            answer.selectedAnswer = selectedAnswer;
            answer.writtenAnswer = writtenAnswer;
            answer.graded = false; // Reset graded status on update
        }
        else {
            // Create new answer
            answer = new exam_model_1.Answer({
                student: studentId,
                question: questionId,
                exam: examId,
                selectedAnswer,
                writtenAnswer,
            });
        }
        // Auto-grade MCQ questions
        if (question.type === "mcq" && selectedAnswer) {
            answer.score =
                selectedAnswer === question.correctAnswer ? question.mark : 0;
            answer.graded = true;
            await answer.save();
            submittedAnswers.push(answer);
        }
        if (question.type !== "mcq") {
            nonMCQQuestions.push(question);
            nonMCQAnswers.push(answer);
        }
    }
    // Only send non-MCQ questions for AI grading
    if (nonMCQQuestions.length > 0) {
        const aiRequests = (0, formatAnswer_1.formatAnswerForAIGrading)(nonMCQQuestions, nonMCQAnswers, exam.course.toString());
        const aiResponses = await (0, ai_services_1.batchGradeAnswers)(aiRequests);
        // Update answers with AI scores
        for (const aiResponse of aiResponses) {
            const answer = nonMCQAnswers.find(a => a.question.toString() === aiResponse.question_id);
            if (answer) {
                answer.score = aiResponse.score;
                answer.feedback = aiResponse.feedback;
                answer.graded = true;
                // await answer.save();
                await answer.save();
                submittedAnswers.push(answer);
            }
        }
    }
    const totalMarks = submittedAnswers.reduce((sum, ans) => sum + (ans.score || 0), 0);
    (0, response_formater_1.response)(res, "Answers submitted successfully", 200, { answers: submittedAnswers, totalMarks, totalOriginalMarks });
});
// Get student's answers for an exam (to restore progress)
exports.getStudentAnswers = (0, async_handler_1.asyncHandler)(async (req, res) => {
    var _a;
    const { examId } = req.params;
    const studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const exam = await exam_model_1.Exam.findById(examId);
    if (!exam) {
        throw new error_response_1.default("Exam not found", 404);
    }
    // Students can only view their own answers for a specific exam
    const query = {
        exam: examId,
        student: studentId
    };
    const answers = await exam_model_1.Answer.find(query)
        .populate("question", "text type mark");
    // Find the most recently updated answer to get the latest remaining time
    const latestAnswerWithTime = await exam_model_1.Answer.findOne(query).sort({ updatedAt: -1 }).select('remainingTime');
    const remainingTime = latestAnswerWithTime ? latestAnswerWithTime.remainingTime : null;
    const progress = {
        answers,
        remainingTime
    };
    (0, response_formater_1.response)(res, "Progress retrieved successfully", 200, progress);
});
// Grade theory answer
exports.gradeTheoryAnswer = (0, async_handler_1.asyncHandler)(async (req, res) => {
    var _a, _b;
    const { answerId } = req.params;
    const { score } = req.body;
    const answer = await exam_model_1.Answer.findById(answerId);
    if (!answer) {
        throw new error_response_1.default("Answer not found", 404);
    }
    const question = await exam_model_1.Question.findById(answer.question);
    if (!question) {
        throw new error_response_1.default("Question not found", 404);
    }
    // Only admin and lecturers can grade answers
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "admin" && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== "lecturer") {
        throw new error_response_1.default("Not authorized to grade answers", 403);
    }
    // Validate score
    if (score < 0 || score > question.mark) {
        throw new error_response_1.default(`Score must be between 0 and ${question.mark}`, 400);
    }
    answer.score = score;
    answer.graded = true;
    await answer.save();
    (0, response_formater_1.response)(res, "Answer submitted successfully", 200, answer);
});
// Auto-grade MCQ answers for an exam
exports.autoGradeExam = (0, async_handler_1.asyncHandler)(async (req, res) => {
    var _a, _b;
    const { examId } = req.params;
    const exam = await exam_model_1.Exam.findById(examId);
    if (!exam) {
        throw new error_response_1.default("Exam not found", 404);
    }
    // Only admin and lecturers can auto-grade exams
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "admin" && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== "lecturer") {
        throw new error_response_1.default("Not authorized to auto-grade exams", 403);
    }
    // Get all MCQ questions for the exam
    const mcqQuestions = await exam_model_1.Question.find({
        exam: examId,
        type: "mcq",
    });
    // Grade all MCQ answers
    for (const question of mcqQuestions) {
        const answers = await exam_model_1.Answer.find({
            question: question._id,
            graded: false,
        });
        for (const answer of answers) {
            answer.score =
                answer.selectedAnswer === question.correctAnswer ? question.mark : 0;
            answer.graded = true;
            await answer.save();
        }
    }
    (0, response_formater_1.response)(res, "Auto-grading completed", 200, {});
});
