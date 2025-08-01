"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = require("../../../utils/verifyToken/verifyToken");
const ai_controller_1 = require("./ai.controller");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
// Apply authentication middleware to all routes
router.use(verifyToken_1.verifyUser);
// Send message to AI (creates chat history if doesn't exist)
router.post("/chat/message", [
    (0, express_validator_1.body)("courseId").notEmpty().withMessage("Course ID is required"),
    (0, express_validator_1.body)("message").notEmpty().withMessage("Message is required"),
    (0, express_validator_1.body)("additionalInfo").optional().isString(),
    (0, express_validator_1.body)("lang").notEmpty().withMessage("Language is required"),
], ai_controller_1.AIController.sendMessage);
// Get chat history for a specific course
router.get("/chat/history/:courseId", [(0, express_validator_1.param)("courseId").notEmpty().withMessage("Course ID is required")], ai_controller_1.AIController.getChatHistory);
// Get all chat histories for a user
router.get("/chat/histories", ai_controller_1.AIController.getUserChatHistories);
// Clear chat history for a specific course
router.delete("/chat/history/:courseId", [(0, express_validator_1.param)("courseId").notEmpty().withMessage("Course ID is required")], ai_controller_1.AIController.clearChatHistory);
// Clear all chat histories for a user
router.delete("/chat/histories", ai_controller_1.AIController.clearAllChatHistory);
// Direct AI Teaching Agent query
router.post("/teaching-agent", [
    (0, express_validator_1.body)("courseId").notEmpty().withMessage("Course ID is required"),
    (0, express_validator_1.body)("additionalInfo").optional().isString(),
    (0, express_validator_1.body)("lang").notEmpty().withMessage("Language is required"),
], ai_controller_1.AIController.queryAITeachingAgent);
exports.default = router;
