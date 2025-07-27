import { Request, Response } from "express";
import { Exam, Question, Answer } from "./exam.model";
import { asyncHandler } from "../../../utils/async-handler";
import ErrorResponse from "../../../utils/error-response";

// Create a new exam
export const createExam = asyncHandler(async (req: Request, res: Response) => {
  // Only admin and lecturer can create exams
  if (req.user?.role !== "admin" && req.user?.role !== "lecturer") {
    throw new ErrorResponse("Not authorized to create exams", 403);
  }

  const exam = await Exam.create({
    ...req.body,
    lecturer: req.user?.id,
  });

  res.status(201).json({
    success: true,
    data: exam,
  });
});

// Get all exams for a course
export const getExams = asyncHandler(async (req: Request, res: Response) => {
  const { course } = req.query;

  const query = course ? { course } : {};

  const exams = await Exam.find(query)
    .populate("course", "code title")
    .populate("lecturer", "firstName lastName");

  res.status(200).json({
    success: true,
    data: exams,
  });
});

// Get single exam
export const getExam = asyncHandler(async (req: Request, res: Response) => {
  const exam = await Exam.findById(req.params.id)
    .populate("course", "code title")
    .populate("lecturer", "firstName lastName");

  if (!exam) {
    throw new ErrorResponse("Exam not found", 404);
  }

  // Students can only view published exams
  // if (req.user?.role === "student" && !exam.isPublished) {
  //   throw new ErrorResponse("Not authorized to view this exam", 403);
  // }

  res.status(200).json({
    success: true,
    data: exam,
  });
});

// Update exam
export const updateExam = asyncHandler(async (req: Request, res: Response) => {
  let exam = await Exam.findById(req.params.id);

  if (!exam) {
    throw new ErrorResponse("Exam not found", 404);
  }

  // Only admin or the lecturer who created the exam can update it
  if (req.user?.role !== "admin" && exam.lecturer.toString() !== req.user?.id) {
    throw new ErrorResponse("Not authorized to update this exam", 403);
  }

  exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: exam,
  });
});

// Delete exam
export const deleteExam = asyncHandler(async (req: Request, res: Response) => {
  const exam = await Exam.findById(req.params.id);

  if (!exam) {
    throw new ErrorResponse("Exam not found", 404);
  }

  // Only admin or the lecturer who created the exam can delete it
  if (req.user?.role !== "admin" && exam.lecturer.toString() !== req.user?.id) {
    throw new ErrorResponse("Not authorized to delete this exam", 403);
  }

  await exam.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// Publish exam
export const publishExam = asyncHandler(async (req: Request, res: Response) => {
  const exam = await Exam.findById(req.params.id);

  if (!exam) {
    throw new ErrorResponse("Exam not found", 404);
  }

  // Only admin or the lecturer who created the exam can publish it
  if (req.user?.role !== "admin" && exam.lecturer.toString() !== req.user?.id) {
    throw new ErrorResponse("Not authorized to publish this exam", 403);
  }

  exam.isPublished = true;
  await exam.save();

  res.status(200).json({
    success: true,
    data: exam,
  });
});

// Add a question to an exam
export const addQuestion = asyncHandler(async (req: Request, res: Response) => {
  const exam = await Exam.findById(req.body.exam);

  if (!exam) {
    throw new ErrorResponse("Exam not found", 404);
  }

  // Only admin or the lecturer who created the exam can add questions
  if (req.user?.role !== "admin" && exam.lecturer.toString() !== req.user?.id) {
    throw new ErrorResponse(
      "Not authorized to add questions to this exam",
      403,
    );
  }

  const question = await Question.create({
    ...req.body,
    exam: exam._id,
  });

  res.status(201).json({
    success: true,
    data: question,
  });
});

// Get questions for an exam
export const getQuestions = asyncHandler(
  async (req: Request, res: Response) => {
    const { exam } = req.query;

    if (!exam) {
      throw new ErrorResponse("Please provide an exam ID", 400);
    }

    const questions = await Question.find({ exam });

    res.status(200).json({
      success: true,
      data: questions,
    });
  },
);

// Update a question
export const updateQuestion = asyncHandler(
  async (req: Request, res: Response) => {
    let question = await Question.findById(req.params.id);

    if (!question) {
      throw new ErrorResponse("Question not found", 404);
    }

    const exam = await Exam.findById(question.exam);

    if (!exam) {
      throw new ErrorResponse("Exam not found", 404);
    }

    // Only admin or the lecturer who created the exam can update questions
    if (
      req.user?.role !== "admin" &&
      exam.lecturer.toString() !== req.user?.id
    ) {
      throw new ErrorResponse("Not authorized to update this question", 403);
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

// Delete a question
export const deleteQuestion = asyncHandler(
  async (req: Request, res: Response) => {
    const question = await Question.findById(req.params.id);

    if (!question) {
      throw new ErrorResponse("Question not found", 404);
    }

    const exam = await Exam.findById(question.exam);

    if (!exam) {
      throw new ErrorResponse("Exam not found", 404);
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

// Start an exam
export const startExam = asyncHandler(async (req: Request, res: Response) => {
  const exam = await Exam.findById(req.params.id);

  if (!exam) {
    throw new ErrorResponse("Exam not found", 404);
  }

  if (!exam.isPublished) {
    throw new ErrorResponse("This exam is not yet published", 400);
  }

  const now = new Date();
  if (now < exam.startTime) {
    throw new ErrorResponse("This exam has not started yet", 400);
  }

  if (now > exam.endTime) {
    throw new ErrorResponse("This exam has already ended", 400);
  }

  res.status(200).json({
    success: true,
    data: {
      exam,
      startTime: now,
      remainingTime: Math.floor(
        (exam.endTime.getTime() - now.getTime()) / 1000,
      ), // in seconds
    },
  });
});

// Submit an answer
export const submitAnswer = asyncHandler(
  async (req: Request, res: Response) => {
    const { examId, questionId, answer } = req.body;

    const exam = await Exam.findById(examId);
    if (!exam) {
      throw new ErrorResponse("Exam not found", 404);
    }

    const question = await Question.findById(questionId);
    if (!question) {
      throw new ErrorResponse("Question not found", 404);
    }

    const now = new Date();
    if (now > exam.endTime) {
      throw new ErrorResponse("This exam has already ended", 400);
    }

    let answerDoc = await Answer.findOne({
      student: req.user?.id,
      exam: examId,
      question: questionId,
    });

    if (answerDoc) {
      // Update existing answer
      if (question.type === "mcq") {
        answerDoc.selectedAnswer = answer;
      } else {
        answerDoc.writtenAnswer = answer;
      }
      await answerDoc.save();
    } else {
      // Create new answer
      answerDoc = await Answer.create({
        student: req.user?.id,
        exam: examId,
        question: questionId,
        ...(question.type === "mcq"
          ? { selectedAnswer: answer }
          : { writtenAnswer: answer }),
      });
    }

    res.status(200).json({
      success: true,
      data: answerDoc,
    });
  },
);

// Finish exam
export const finishExam = asyncHandler(async (req: Request, res: Response) => {
  const exam = await Exam.findById(req.params.id);

  if (!exam) {
    throw new ErrorResponse("Exam not found", 404);
  }

  const answers = await Answer.find({
    student: req.user?.id,
    exam: exam._id,
  });

  res.status(200).json({
    success: true,
    data: {
      exam,
      answersSubmitted: answers.length,
      submissionTime: new Date(),
    },
  });
});

// Get exam result
export const getResult = asyncHandler(async (req: Request, res: Response) => {
  const exam = await Exam.findById(req.params.examId);

  if (!exam) {
    throw new ErrorResponse("Exam not found", 404);
  }

  const answers = await Answer.find({
    student: req.user?.id,
    exam: exam._id,
  }).populate("question");

  const totalScore = answers.reduce(
    (acc, answer) => acc + (answer.score || 0),
    0,
  );

  res.status(200).json({
    success: true,
    data: {
      exam,
      answers,
      totalScore,
      totalMarks: exam.totalMarks,
      percentage: (totalScore / exam.totalMarks) * 100,
    },
  });
});

// Auto-grade MCQ questions
export const autoGrade = asyncHandler(async (req: Request, res: Response) => {
  const exam = await Exam.findById(req.params.id);

  if (!exam) {
    throw new ErrorResponse("Exam not found", 404);
  }

  // Only admin or the lecturer who created the exam can grade
  if (req.user?.role !== "admin" && exam.lecturer.toString() !== req.user?.id) {
    throw new ErrorResponse("Not authorized to grade this exam", 403);
  }

  const mcqQuestions = await Question.find({ exam: exam._id, type: "mcq" });
  const mcqAnswers = await Answer.find({
    exam: exam._id,
    question: { $in: mcqQuestions.map((q) => q._id) },
  });

  // Grade MCQ answers
  for (const answer of mcqAnswers) {
    const question = mcqQuestions.find((q) => q._id.equals(answer.question));
    if (question && answer.selectedAnswer === question.correctAnswer) {
      answer.score = question.mark;
    } else {
      answer.score = 0;
    }
    answer.graded = true;
    await answer.save();
  }

  res.status(200).json({
    success: true,
    data: {
      gradedAnswers: mcqAnswers.length,
    },
  });
});

// LLM-based grading for theory questions
export const llmGrade = asyncHandler(async (req: Request, res: Response) => {
  const exam = await Exam.findById(req.params.id);

  if (!exam) {
    throw new ErrorResponse("Exam not found", 404);
  }

  // Only admin or the lecturer who created the exam can grade
  if (req.user?.role !== "admin" && exam.lecturer.toString() !== req.user?.id) {
    throw new ErrorResponse("Not authorized to grade this exam", 403);
  }

  // Note: This is a placeholder for LLM integration
  // In a real implementation, you would:
  // 1. Get all theory questions and their answers
  // 2. Send them to an LLM service for grading
  // 3. Update the scores based on LLM response

  res.status(200).json({
    success: true,
    message: "LLM grading feature is under development",
  });
});
