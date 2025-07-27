"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchGradeAnswers = exports.generateQuestionWithAI = exports.uploadCourseMaterials = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../../../config");
const AI_BASE_URL = config_1.config.AI_BASE_URL;
/**
 * Upload multiple course materials (PDF URLs) to the AI service.
 * @param courseId - The course ID as a string.
 * @param pdfUrls - Array of PDF URLs (strings).
 * @returns Promise with AI service response.
 */
async function uploadCourseMaterials(courseId, pdfUrls) {
    const params = new URLSearchParams();
    params.append("course_id", courseId);
    params.append("pdf_urls", pdfUrls.join(","));
    const response = await axios_1.default.post(`${AI_BASE_URL}/upload-multiple-course-materials`, params, {
        headers: {
            "accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    return response.data;
}
exports.uploadCourseMaterials = uploadCourseMaterials;
/**
 * Autogenerate questions using the AI service.
 * @param payload - The request body as specified by the AI API.
 * @returns Promise with generated questions array.
 */
async function generateQuestionWithAI(payload) {
    const response = await axios_1.default.post(`${AI_BASE_URL}/generate-questions`, Object.assign(Object.assign({}, payload), { llm_config: {} }), {
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
        },
    });
    return response.data;
}
exports.generateQuestionWithAI = generateQuestionWithAI;
async function batchGradeAnswers(answers) {
    const response = await axios_1.default.post(`${AI_BASE_URL}/batch-grade-answers`, { answers }, {
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
        },
    });
    return response.data;
}
exports.batchGradeAnswers = batchGradeAnswers;
