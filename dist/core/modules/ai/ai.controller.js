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
exports.AIController = void 0;
const AIService = __importStar(require("./ai.services"));
const express_validator_1 = require("express-validator");
class AIController {
    /**
     * Send a message to AI
     */
    static async sendMessage(req, res) {
        var _a, _b;
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: errors.array(),
                });
                return;
            }
            const { courseId, message, additionalInfo, lang } = req.body;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const organizationId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.organizationId;
            if (!userId || !organizationId) {
                res.status(401).json({
                    success: false,
                    message: "User authentication required",
                });
                return;
            }
            const result = await AIService.sendMessage(userId, courseId, organizationId, message, lang);
            res.status(200).json({
                success: true,
                message: "Message sent successfully",
                data: result,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    /**
     * Get chat history for a specific course
     */
    static async getChatHistory(req, res) {
        var _a;
        try {
            const { courseId } = req.params;
            const { page = 1, limit = 50 } = req.query;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: "User authentication required",
                });
                return;
            }
            const result = await AIService.getChatHistory(userId, courseId);
            res.status(200).json({
                success: true,
                message: "Chat history retrieved successfully",
                data: result,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    /**
     * Get all chat histories for a user
     */
    static async getUserChatHistories(req, res) {
        var _a, _b;
        try {
            const { page = 1, limit = 10 } = req.query;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const organizationId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.organizationId;
            if (!userId || !organizationId) {
                res.status(401).json({
                    success: false,
                    message: "User authentication required",
                });
                return;
            }
            const result = await AIService.getUserChatHistories(userId, organizationId);
            res.status(200).json({
                success: true,
                message: "User chat histories retrieved successfully",
                data: result,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    /**
     * Clear chat history for a specific course
     */
    static async clearChatHistory(req, res) {
        var _a;
        try {
            const { courseId } = req.params;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: "User authentication required",
                });
                return;
            }
            const result = await AIService.clearChatHistory(userId, courseId);
            res.status(200).json({
                success: true,
                message: "Chat history cleared successfully",
                data: result,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    /**
     * Clear all chat histories for a user
     */
    static async clearAllChatHistory(req, res) {
        var _a, _b;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const organizationId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.organizationId;
            if (!userId || !organizationId) {
                res.status(401).json({
                    success: false,
                    message: "User authentication required",
                });
                return;
            }
            const result = await AIService.clearAllUserChatHistory(userId, organizationId);
            res.status(200).json({
                success: true,
                message: "All chat histories cleared successfully",
                data: result,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    /**
     * Direct AI Teaching Agent query
     */
    static async queryAITeachingAgent(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: errors.array(),
                });
                return;
            }
            const { courseId, additionalInfo, lang } = req.body;
            const result = await AIService.AITeachingAgent({
                course_id: courseId,
                additional_info: additionalInfo,
                lang
            });
            res.status(200).json({
                success: true,
                message: "AI Teaching Agent query successful",
                data: result,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
}
exports.AIController = AIController;
