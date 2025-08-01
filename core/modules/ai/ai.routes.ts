import { Router } from "express";
import { verifyUser } from "../../../utils/verifyToken/verifyToken";
import { AIController } from "./ai.controller";
import { body, param } from "express-validator";

const router = Router();

// Apply authentication middleware to all routes
router.use(verifyUser);

// Send message to AI (creates chat history if doesn't exist)
router.post(
  "/chat/message",
  [
    body("courseId").notEmpty().withMessage("Course ID is required"),
    body("message").notEmpty().withMessage("Message is required"),
    body("additionalInfo").optional().isString(),
    body("lang").notEmpty().withMessage("Language is required"),
  ],
  AIController.sendMessage
);

// Get chat history for a specific course
router.get(
  "/chat/history/:courseId",
  [param("courseId").notEmpty().withMessage("Course ID is required")],
  AIController.getChatHistory
);

// Get all chat histories for a user
router.get("/chat/histories", AIController.getUserChatHistories);

// Clear chat history for a specific course
router.delete(
  "/chat/history/:courseId",
  [param("courseId").notEmpty().withMessage("Course ID is required")],
  AIController.clearChatHistory
);

// Clear all chat histories for a user
router.delete("/chat/histories", AIController.clearAllChatHistory);

// Direct AI Teaching Agent query
router.post(
  "/teaching-agent",
  [
    body("courseId").notEmpty().withMessage("Course ID is required"),
    body("additionalInfo").optional().isString(),
    body("lang").notEmpty().withMessage("Language is required"),
  ],
  AIController.queryAITeachingAgent
);

export default router;