import { Request, Response } from "express";



import { Answer, Question, Exam, IAnswer } from "./exam.model";
import { asyncHandler } from "../../../utils/async-handler";
import ErrorResponse from "../../../utils/error-response";
import { response } from "../../../utils/response-formater";
import { Types } from "mongoose";
import { formatAnswerForAIGrading } from "../../../utils/helper-func/formatAnswer";
import { batchGradeAnswers } from "../ai/ai.services";

// Temporarily save answers for progress tracking
export const saveProgress = asyncHandler(
  async (req: Request, res: Response) => {
    const { answers, examId, remainingTime } = req.body;
    const studentId = req.user?.id;

    if (!Array.isArray(answers) || answers.length === 0) {
      throw new ErrorResponse("Answers must be a non-empty array", 400);
    }

    // Verify exam exists and is published
    const exam = await Exam.findById(examId);
    if (!exam) {
      throw new ErrorResponse("Exam not found", 404);
    }
    if (!exam.isPublished) {
      throw new ErrorResponse("Exam is not published", 400);
    }

    // Only students can save progress
    if (req.user?.role !== "student") {
      throw new ErrorResponse("Only students can save progress", 403);
    }

    // Check if exam is within time window
    // const now = new Date();
    // if (now < exam.startTime || now > exam.endTime) {
    //   throw new ErrorResponse("Exam is not currently active", 400);
    // }



    const savedAnswers = [];

    for (const ans of answers) {
      const { question: questionId, selectedAnswer, writtenAnswer } = ans;

      // Verify question exists
      const question = await Question.findById(questionId);
      if (!question) {
        throw new ErrorResponse(`Question with id ${questionId} not found`, 404);
      }

      if (question.exam.toString() !== examId) {
          throw new ErrorResponse(`Question with id ${questionId} does not belong to the specified exam`, 400);
      }

      // Create or update answer
      let answer = await Answer.findOne({
        student: studentId,
        question: questionId,
        exam: examId,
      });

      if (answer) {
        // Update existing answer
        answer.selectedAnswer = selectedAnswer;
        answer.writtenAnswer = writtenAnswer;
        answer.remainingTime = remainingTime;
        await answer.save();
      } else {
        // Create new answer
        answer = await Answer.create({
          student: studentId,
          question: questionId,
          exam: examId,
          selectedAnswer,
          writtenAnswer,
          remainingTime,
        });
      }
      savedAnswers.push(answer);
    }

    response(res, "Progress saved successfully", 200, savedAnswers);
  },
);

// Submit answer
export const submitAnswer = asyncHandler(
  async (req: Request, res: Response) => {
    const { answers, examId } = req.body;
    const studentId = req.user?.id;

    if (!Array.isArray(answers) || answers.length === 0) {
      throw new ErrorResponse("Answers must be a non-empty array", 400);
    }

    // Verify exam exists and is published
    const exam = await Exam.findById(examId);
    if (!exam) {
      throw new ErrorResponse("Exam not found", 404);
    }
    // if (!exam.isPublished) {
    //   throw new ErrorResponse("Exam is not published", 400);
    // }

    // Check if exam has ended
    // const now = new Date();
    // if (now > exam.endTime) {
    //   throw new ErrorResponse("Exam has ended and can no longer be submitted", 400);
    // }

    const submittedAnswers: (IAnswer & { _id: Types.ObjectId; })[] = [];
    let totalOriginalMarks = 0;
    const nonMCQQuestions = [];
    const nonMCQAnswers = []

    for (const ans of answers) {
      const { question: questionId, selectedAnswer, writtenAnswer } = ans;

      // Verify question exists
      const question = await Question.findById(questionId);
      if (!question) {
        console.error(`Question with id ${questionId} not found. Skipping.`);
        continue;
      }

      if (question.exam.toString() !== examId) {
        console.error(`Question with id ${questionId} does not belong to exam ${examId}. Skipping.`);
        continue;
      }

      totalOriginalMarks += question.mark;

      // Create or update answer
      let answer = await Answer.findOne({
        student: studentId,
        question: questionId,
        exam: examId,
      });

      if (answer) {
        // Update existing answer
        answer.selectedAnswer = selectedAnswer;
        answer.writtenAnswer = writtenAnswer;
        answer.graded = false; // Reset graded status on update
      } else {
        // Create new answer
        answer = new Answer({
          student: studentId,
          question: questionId,
          exam: examId,
          selectedAnswer,
          writtenAnswer,
        });
      }

      // Auto-grade MCQ questions
      if (question.type === "mcq" && selectedAnswer) {
        answer.score =
          selectedAnswer === question.correctAnswer ? question.mark : 0;
        answer.graded = true;
        
      await answer.save();
      submittedAnswers.push(answer);
      } 


      if(question.type !== "mcq"){
        nonMCQQuestions.push(question)
        nonMCQAnswers.push(answer)
      }

    }

   
    // Only send non-MCQ questions for AI grading
    if (nonMCQQuestions.length > 0) {
      const aiRequests = formatAnswerForAIGrading(nonMCQQuestions, nonMCQAnswers, exam.course.toString());
      const aiResponses = await batchGradeAnswers(aiRequests);
      
      // Update answers with AI scores
      for (const aiResponse of aiResponses) {
        const answer = nonMCQAnswers.find(
          a => a.question.toString() === aiResponse.question_id
        );
        if (answer) {
          answer.score = aiResponse.score;
          answer.feedback = aiResponse.feedback;
          answer.graded = true;
          // await answer.save();
          await answer.save();
          submittedAnswers.push(answer);
        }
      }
    }

    const totalMarks = submittedAnswers.reduce(
      (sum, ans) => sum + (ans.score || 0),
      0
    );

    response(res, "Answers submitted successfully", 200, {answers: submittedAnswers, totalMarks, totalOriginalMarks});
  },
);

// Get student's answers for an exam (to restore progress)
export const getStudentAnswers = asyncHandler(
  async (req: Request, res: Response) => {
    const { examId } = req.params;
    const studentId = req.user?.id;

    const exam = await Exam.findById(examId);
    if (!exam) {
      throw new ErrorResponse("Exam not found", 404);
    }

    // Students can only view their own answers for a specific exam
    const query = { 
      exam: examId,
      student: studentId 
    };

    const answers = await Answer.find(query)
      .populate("question", "text type mark");

    // Find the most recently updated answer to get the latest remaining time
    const latestAnswerWithTime = await Answer.findOne(query).sort({ updatedAt: -1 }).select('remainingTime');
    const remainingTime = latestAnswerWithTime ? latestAnswerWithTime.remainingTime : null;

    const progress = {
      answers,
      remainingTime
    };

    response(res, "Progress retrieved successfully", 200, progress);
  },
);

// Grade theory answer
export const gradeTheoryAnswer = asyncHandler(
  async (req: Request, res: Response) => {
    const { answerId } = req.params;
    const { score } = req.body;

    const answer = await Answer.findById(answerId);
    if (!answer) {
      throw new ErrorResponse("Answer not found", 404);
    }

    const question = await Question.findById(answer.question);
    if (!question) {
      throw new ErrorResponse("Question not found", 404);
    }

    // Only admin and lecturers can grade answers
    if (req.user?.role !== "admin" && req.user?.role !== "lecturer") {
      throw new ErrorResponse("Not authorized to grade answers", 403);
    }

    // Validate score
    if (score < 0 || score > question.mark) {
      throw new ErrorResponse(
        `Score must be between 0 and ${question.mark}`,
        400,
      );
    }

    answer.score = score;
    answer.graded = true;
    await answer.save();

    response(res, "Answer submitted successfully", 200, answer);
  },
);

// Auto-grade MCQ answers for an exam
export const autoGradeExam = asyncHandler(
  async (req: Request, res: Response) => {
    const { examId } = req.params;

    const exam = await Exam.findById(examId);
    if (!exam) {
      throw new ErrorResponse("Exam not found", 404);
    }

    // Only admin and lecturers can auto-grade exams
    if (req.user?.role !== "admin" && req.user?.role !== "lecturer") {
      throw new ErrorResponse("Not authorized to auto-grade exams", 403);
    }

    // Get all MCQ questions for the exam
    const mcqQuestions = await Question.find({
      exam: examId,
      type: "mcq",
    });

    // Grade all MCQ answers
    for (const question of mcqQuestions) {
      const answers = await Answer.find({
        question: question._id,
        graded: false,
      });

      for (const answer of answers) {
        answer.score =
          answer.selectedAnswer === question.correctAnswer ? question.mark : 0;
        answer.graded = true;
        await answer.save();
      }
    }

    response(res, "Auto-grading completed", 200, {});
  },
);
