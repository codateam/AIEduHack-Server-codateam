import axios from "axios";
import { IGeneratedQuestion } from "../../../types/question";
import { config } from "../../../config";
import AIChatHistory, { IAIChatHistory } from "./ai.model";
import mongoose from "mongoose";

const AI_BASE_URL = config.AI_BASE_URL

/**
 * Upload multiple course materials (PDF URLs) to the AI service.
 * @param courseId - The course ID as a string.
 * @param pdfUrls - Array of PDF URLs (strings).
 * @returns Promise with AI service response.
 */
export async function uploadCourseMaterials(courseId: string, pdfUrls: string[]): Promise<any> {
  const params = new URLSearchParams();
  params.append("course_id", courseId);
  params.append("pdf_urls", pdfUrls.join(","));
  const response = await axios.post(
    `${AI_BASE_URL}/upload-multiple-course-materials`,
    params,
    {
      headers: {
        "accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return response.data;
}

/**
 * Autogenerate questions using the AI service.
 * @param payload - The request body as specified by the AI API.
 * @returns Promise with generated questions array.
 */


export async function  generateQuestionWithAI(payload: {
  course_id: string;
  subject: string;
  difficulty: string;
  question_types: string[];
  num_questions: number;
  additional_context?: string;
  mark?: number;
}): Promise<IGeneratedQuestion[]> {
  const response = await axios.post(
    `${AI_BASE_URL}/generate-questions`,
    {...payload, llm_config: {}},
    {
      headers: {
        "accept": "application/json",
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
}

/**
 * Auto-grade non-MCQ answers using the AI service.
 * @param answers - Array of answer objects as specified by the AI API.
 * @returns Promise with grading results.
 */

export interface AIRequestBody {
      id: string,
      question: string,
      course_id: string,
      expected_answer: string,
      student_answer: string,
      type: "mcq" | "essay" | "fill-in-the-blank",
      points: number,
}

interface AIResponse {
    question_id: string,
    score: number,
    max_score: number,
    percentage: number,
    feedback: string,
    detailed_analysis: {
      additionalProp1: {}
    }
  
}
export async function batchGradeAnswers(answers: AIRequestBody[]): Promise<AIResponse[]> {
  const response = await axios.post(
    `${AI_BASE_URL}/batch-grade-answers`,
    { answers },
    {
      headers: {
        "accept": "application/json",
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
}


export async function AITeachingAgent(data: {
  course_id: string,
  additional_info: string,
  lang: string,
}): Promise<string> { 
  const response = await axios.post(
    `${AI_BASE_URL}/ai-teaching-agent`,
    { 
      "course_id": data.course_id,
      "additional_info": data.additional_info,
      "lang":data.lang
     },
    {
      headers: {
        "accept": "application/json",
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
}

/**
 * Send a message to AI and save the conversation history
 */
export async function sendMessage(
  userId: string,
  courseId: string,
  organizationId: string,
  message: string,
  lang: string = "en"
): Promise<{ response: string; chatHistory: IAIChatHistory }> {
  try {
    // Get AI response
    const aiResponse = await AITeachingAgent({
      course_id: courseId,
      additional_info: message,
      lang,
    });

    // Find or create chat history
    let chatHistory = await AIChatHistory.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      courseId: new mongoose.Types.ObjectId(courseId),
    });

    if (!chatHistory) {
      chatHistory = new AIChatHistory({
        userId: new mongoose.Types.ObjectId(userId),
        courseId: new mongoose.Types.ObjectId(courseId),
        organizationId: new mongoose.Types.ObjectId(organizationId),
        messages: [],
        lang,
      });
    }

    // Add user message and AI response
    chatHistory.messages.push(
      {
        role: "user",
        content: message,
        timestamp: new Date(),
      },
      {
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      }
    );

    await chatHistory.save();

    return { response: aiResponse, chatHistory };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to send message"
    );
  }
}

/**
 * Get chat history for a specific course
 */
export async function getChatHistory(
  userId: string,
  courseId: string
): Promise<IAIChatHistory | null> {
  try {
    return await AIChatHistory.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      courseId: new mongoose.Types.ObjectId(courseId),
    }).populate("courseId", "title code");
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to get chat history"
    );
  }
}

/**
 * Get all chat histories for a user
 */
export async function getUserChatHistories(
  userId: string,
  organizationId: string
): Promise<IAIChatHistory[]> {
  try {
    return await AIChatHistory.find({
      userId: new mongoose.Types.ObjectId(userId),
      organizationId: new mongoose.Types.ObjectId(organizationId),
    })
      .populate("courseId", "title code")
      .sort({ updatedAt: -1 });
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to get user chat histories"
    );
  }
}

/**
 * Clear chat history for a specific course
 */
export async function clearChatHistory(
  userId: string,
  courseId: string
): Promise<boolean> {
  try {
    const result = await AIChatHistory.deleteOne({
      userId: new mongoose.Types.ObjectId(userId),
      courseId: new mongoose.Types.ObjectId(courseId),
    });
    return result.deletedCount > 0;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to clear chat history"
    );
  }
}

/**
 * Clear all chat histories for a user
 */
export async function clearAllUserChatHistory(
  userId: string,
  organizationId: string
): Promise<number> {
  try {
    const result = await AIChatHistory.deleteMany({
      userId: new mongoose.Types.ObjectId(userId),
      organizationId: new mongoose.Types.ObjectId(organizationId),
    });
    return result.deletedCount;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to clear all user chat history"
    );
  }
}