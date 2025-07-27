"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatQuestion = void 0;
const formatQuestion = (questions, examId) => {
    const validTypes = { mcq: "mcq", essay: "theory", "fill-in-the-blank": "german" };
    return questions.map((question) => ({
        exam: examId,
        type: validTypes[question.type] || "mcq",
        text: question.question,
        options: (question === null || question === void 0 ? void 0 : question.options) && question.options ? question.options.map(item => item.option) : [],
        expected_answer: (question === null || question === void 0 ? void 0 : question.expected_answer) || "",
        correctAnswer: (question === null || question === void 0 ? void 0 : question.expected_answer) || "",
        mark: (question === null || question === void 0 ? void 0 : question.mark) || 1,
    }));
};
exports.formatQuestion = formatQuestion;
