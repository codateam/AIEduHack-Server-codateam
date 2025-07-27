import express from "express";
import {
  createExam,
  getExams,
  getExam,
  updateExam,
  deleteExam,
  publishExam,
  addQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
  startExam,
  submitAnswer,
  finishExam,
  getResult,
  autoGrade,
  llmGrade,
} from "./exam.controller";
import {
  verifyUser,
  verifyAdmin,
  verifyLecturer,
} from "../../../utils/verifyToken/verifyToken";
import { asyncHandler } from "../../../utils/async-handler";

const router = express.Router();

// Exam Creation & Management
router
  .route("/")
  .post(verifyUser, verifyLecturer, createExam)
  .get(verifyUser, getExams);

router
  .route("/:id")
  .get(verifyUser, getExam)
  .put(verifyUser, verifyLecturer, updateExam)
  .delete(verifyUser, verifyAdmin, deleteExam);

router.post("/:id/publish", verifyUser, verifyLecturer, publishExam);

// Question Management
router
  .route("/questions")
  .post(verifyUser, verifyLecturer, addQuestion)
  .get(verifyUser, getQuestions);

router
  .route("/questions/:id")
  .put(verifyUser, verifyLecturer, updateQuestion)
  .delete(verifyUser, verifyLecturer, deleteQuestion);

// Student Exam Participation
router.get("/student/exams", verifyUser, getExams);
router.post("/student/exams/:id/start", verifyUser, startExam);
router.post("/student/answers", verifyUser, submitAnswer);
router.post("/student/exams/:id/submit", verifyUser, finishExam);
router.get("/student/results/:examId", verifyUser, getResult);

// Grading
router.post("/:id/auto-grade", verifyUser, verifyLecturer, autoGrade);
router.post("/:id/llm-grade", verifyUser, verifyLecturer, llmGrade);

export default router;
