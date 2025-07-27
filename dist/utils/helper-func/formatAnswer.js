"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatAnswerForAIGrading = void 0;
const formatAnswerForAIGrading = (questions, answers, courseId) => {
    return questions.map(question => {
        const answer = answers.find(a => a.question.toString() === question._id.toString());
        const validTypes = { mcq: "mcq", theory: "essay", german: "fill-in-the-blank" };
        return {
            id: question._id.toString(),
            question: question.text,
            course_id: courseId,
            expected_answer: question.correctAnswer || "",
            student_answer: (answer === null || answer === void 0 ? void 0 : answer.writtenAnswer) || "",
            type: validTypes[question.type],
            points: question.mark,
        };
    });
};
exports.formatAnswerForAIGrading = formatAnswerForAIGrading;
