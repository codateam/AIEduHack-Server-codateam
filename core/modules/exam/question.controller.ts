import { Request, Response } from "express";
import { Question, Exam } from "./exam.model";
import { asyncHandler } from "../../../utils/async-handler";
import ErrorResponse from "../../../utils/error-response";
import { CourseService } from "../course/course.service";
import { generateQuestionWithAI } from "../ai/ai.services";
import { formatQuestion } from "../../../utils/helper-func/formatQuestion";
// import { ErrorResponse } from "../../../utils/error-response";

// Add question to exam
export const createQuestion = asyncHandler(
  async (req: Request, res: Response) => {
    const exam = await Exam.findById(req.body.exam);

    if (!exam) {
      throw new ErrorResponse("Exam not found", 404);
    }

    // Only admin or the lecturer who created the exam can add questions
    if (
      req.user?.role !== "admin" &&
      exam.lecturer.toString() !== req.user?.id
    ) {
      throw new ErrorResponse(
        "Not authorized to add questions to this exam",
        403,
      );
    }

    // Validate question type and required fields
    if (
      req.body.type === "mcq" &&
      (!req.body.options || !req.body.correctAnswer)
    ) {
      throw new ErrorResponse(
        "MCQ questions require options and correct answer",
        400,
      );
    }

    const question = await Question.create(req.body);

    res.status(201).json({
      success: true,
      data: question,
    });
  },
);

// Create Multiple questions to exam 

export const createMultipleQuestions = asyncHandler(
  async (req: Request, res: Response) => {
    const exam = await Exam.findById(req.body.exam);

    if (!exam) {
      throw new ErrorResponse("Exam not found", 404);
    }

    // Only admin or the lecturer who created the exam can add questions
    if (
      req.user?.role !== "admin" &&
      exam.lecturer.toString() !== req.user?.id
    ) {
      throw new ErrorResponse(
        "Not authorized to add questions to this exam",
        403,
      );
    }

    const questions = await Question.create(req.body.questions);

    res.status(201).json({
      success: true,
      data: questions,
    });
  },
);

// Get questions for an exam
export const getQuestions = asyncHandler(
  async (req: Request, res: Response) => {
    const { exam } = req.query;

    const examDoc = await Exam.findById(exam);
    if (!examDoc) {
      throw new ErrorResponse("Exam not found", 404);
    }

    // Students can only view questions of published exams
    // if (req.user?.role === "student" && !examDoc.isPublished) {
    //   throw new ErrorResponse("Not authorized to view these questions", 403);
    // }

    const questions = await Question.find({ exam }).select(
      req.user?.role === "student" ? "-correctAnswer" : "+correctAnswer",
    );

    res.status(200).json({
      success: true,
      data: questions,
    });
  },
);

// Update question
export const updateQuestion = asyncHandler(
  async (req: Request, res: Response) => {
    let question = await Question.findById(req.params.id);

    if (!question) {
      throw new ErrorResponse("Question not found", 404);
    }

    const exam = await Exam.findById(question.exam);
    if (!exam) {
      throw new ErrorResponse("Associated exam not found", 404);
    }

    // Only admin or the lecturer who created the exam can update questions
    if (
      req.user?.role !== "admin" &&
      exam.lecturer.toString() !== req.user?.id
    ) {
      throw new ErrorResponse("Not authorized to update this question", 403);
    }

    // Validate question type and required fields
    if (
      req.body.type === "mcq" &&
      (!req.body.options || !req.body.correctAnswer)
    ) {
      throw new ErrorResponse(
        "MCQ questions require options and correct answer",
        400,
      );
    }

    question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: question,
    });
  },
);

// Delete question
export const deleteQuestion = asyncHandler(
  async (req: Request, res: Response) => {
    const question = await Question.findById(req.params.id);

    if (!question) {
      throw new ErrorResponse("Question not found", 404);
    }

    const exam = await Exam.findById(question.exam);
    if (!exam) {
      throw new ErrorResponse("Associated exam not found", 404);
    }

    // Only admin or the lecturer who created the exam can delete questions
    if (
      req.user?.role !== "admin" &&
      exam.lecturer.toString() !== req.user?.id
    ) {
      throw new ErrorResponse("Not authorized to delete this question", 403);
    }

    await question.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  },
);

export const generateQuestions = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      examId,
      course_id,
      difficulty,
      question_types,
      num_questions,
      additional_context,
      mark
    } = req.body;

const exam = await Exam.findById(examId);

if (!exam) {
      throw new ErrorResponse("Exam not found", 404);
    }

   // Only admin or the lecturer who created the exam can add questions
   if (
    req.user?.role !== "admin" &&
    exam.lecturer.toString() !== req.user?.id
  ) {
    throw new ErrorResponse(
      "Not authorized to add questions to this exam",
      403,
    );
  }


if(!course_id || !difficulty || !question_types || !num_questions){
    throw new ErrorResponse("Please provide all required fields", 400);
}

const course = await CourseService.getCourseById(course_id)
    // Call AI service to generate questions
    const generatedQuestions = await generateQuestionWithAI({
      course_id,
      subject: course?.title || "No suject title provided",
      difficulty,
      question_types,
      num_questions,
      additional_context,
      mark
    });

    if (!generatedQuestions || generatedQuestions.length === 0) {
      throw new ErrorResponse("No questions generated", 500);
    }


    const questions = await Question.create(formatQuestion(generatedQuestions, exam._id));



    // Save generated questions to the database
    res.status(200).json({
      success: true,
      data: questions,
    });
  })
