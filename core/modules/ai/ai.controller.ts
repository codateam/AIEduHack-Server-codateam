import { Request, Response } from "express";
import * as AIService from "./ai.services";
import { validationResult } from "express-validator";

export class AIController {
  /**
   * Send a message to AI
   */
  static async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
        return;
      }

      const { courseId, message, additionalInfo, lang } = req.body;
      const userId = req.user?.id;
      const organizationId = req.user?.organizationId;

      if (!userId || !organizationId) {
        res.status(401).json({
          success: false,
          message: "User authentication required",
        });
        return;
      }

      const result = await AIService.sendMessage(
        userId,
        courseId,
        organizationId,
        message,
        lang
      );

      res.status(200).json({
        success: true,
        message: "Message sent successfully",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Get chat history for a specific course
   */
  static async getChatHistory(req: Request, res: Response): Promise<void> {
    try {
      const { courseId } = req.params;
      const { page = 1, limit = 50 } = req.query;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: "User authentication required",
        });
        return;
      }

      const result = await AIService.getChatHistory(
        userId,
        courseId
      );

      res.status(200).json({
        success: true,
        message: "Chat history retrieved successfully",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Get all chat histories for a user
   */
  static async getUserChatHistories(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10 } = req.query;
      const userId = req.user?.id;
      const organizationId = req.user?.organizationId;

      if (!userId || !organizationId) {
        res.status(401).json({
          success: false,
          message: "User authentication required",
        });
        return;
      }

      const result = await AIService.getUserChatHistories(
        userId,
        organizationId
      );

      res.status(200).json({
        success: true,
        message: "User chat histories retrieved successfully",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Clear chat history for a specific course
   */
  static async clearChatHistory(req: Request, res: Response): Promise<void> {
    try {
      const { courseId } = req.params;
      const userId = req.user?.id;

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
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Clear all chat histories for a user
   */
  static async clearAllChatHistory(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const organizationId = req.user?.organizationId;

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
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Direct AI Teaching Agent query
   */
  static async queryAITeachingAgent(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
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
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}