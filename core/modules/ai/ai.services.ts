import axios from "axios";
import { IGeneratedQuestion } from "../../../types/question";
import { config } from "../../../config";

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
