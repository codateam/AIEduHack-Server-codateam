"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearAllUserChatHistory = exports.clearChatHistory = exports.getUserChatHistories = exports.getChatHistory = exports.sendMessage = exports.AITeachingAgent = exports.batchGradeAnswers = exports.generateQuestionWithAI = exports.uploadCourseMaterials = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../../../config");
const ai_model_1 = __importDefault(require("./ai.model"));
const mongoose_1 = __importDefault(require("mongoose"));
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
async function AITeachingAgent(data) {
    const response = await axios_1.default.post(`${AI_BASE_URL}/ai-teaching-agent`, {
        "course_id": data.course_id,
        "additional_info": data.additional_info,
        "lang": data.lang
    }, {
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
        },
    });
    return response.data;
}
exports.AITeachingAgent = AITeachingAgent;
/**
 * Send a message to AI and save the conversation history
 */
async function sendMessage(userId, courseId, organizationId, message, lang = "en") {
    try {
        // Get AI response
        const aiResponse = await AITeachingAgent({
            course_id: courseId,
            additional_info: message,
            lang,
        });
        // Find or create chat history
        let chatHistory = await ai_model_1.default.findOne({
            userId: new mongoose_1.default.Types.ObjectId(userId),
            courseId: new mongoose_1.default.Types.ObjectId(courseId),
        });
        if (!chatHistory) {
            chatHistory = new ai_model_1.default({
                userId: new mongoose_1.default.Types.ObjectId(userId),
                courseId: new mongoose_1.default.Types.ObjectId(courseId),
                organizationId: new mongoose_1.default.Types.ObjectId(organizationId),
                messages: [],
                lang,
            });
        }
        // Add user message and AI response
        chatHistory.messages.push({
            role: "user",
            content: message,
            timestamp: new Date(),
        }, {
            role: "assistant",
            content: aiResponse,
            timestamp: new Date(),
        });
        await chatHistory.save();
        return { response: aiResponse, chatHistory };
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to send message");
    }
}
exports.sendMessage = sendMessage;
/**
 * Get chat history for a specific course
 */
async function getChatHistory(userId, courseId) {
    try {
        return await ai_model_1.default.findOne({
            userId: new mongoose_1.default.Types.ObjectId(userId),
            courseId: new mongoose_1.default.Types.ObjectId(courseId),
        }).populate("courseId", "title code");
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to get chat history");
    }
}
exports.getChatHistory = getChatHistory;
/**
 * Get all chat histories for a user
 */
async function getUserChatHistories(userId, organizationId) {
    try {
        return await ai_model_1.default.find({
            userId: new mongoose_1.default.Types.ObjectId(userId),
            organizationId: new mongoose_1.default.Types.ObjectId(organizationId),
        })
            .populate("courseId", "title code")
            .sort({ updatedAt: -1 });
    }
    catch (error) {
        throw new Error(error instanceof Error
            ? error.message
            : "Failed to get user chat histories");
    }
}
exports.getUserChatHistories = getUserChatHistories;
/**
 * Clear chat history for a specific course
 */
async function clearChatHistory(userId, courseId) {
    try {
        const result = await ai_model_1.default.deleteOne({
            userId: new mongoose_1.default.Types.ObjectId(userId),
            courseId: new mongoose_1.default.Types.ObjectId(courseId),
        });
        return result.deletedCount > 0;
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to clear chat history");
    }
}
exports.clearChatHistory = clearChatHistory;
/**
 * Clear all chat histories for a user
 */
async function clearAllUserChatHistory(userId, organizationId) {
    try {
        const result = await ai_model_1.default.deleteMany({
            userId: new mongoose_1.default.Types.ObjectId(userId),
            organizationId: new mongoose_1.default.Types.ObjectId(organizationId),
        });
        return result.deletedCount;
    }
    catch (error) {
        throw new Error(error instanceof Error
            ? error.message
            : "Failed to clear all user chat history");
    }
}
exports.clearAllUserChatHistory = clearAllUserChatHistory;
