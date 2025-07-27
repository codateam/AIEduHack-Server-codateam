import express from "express";
import {
  submitAnswer,
  saveProgress,
  getStudentAnswers,
  gradeTheoryAnswer,
  autoGradeExam,
} from "./answer.controller";
import { isAuth } from "../../middlewares/is-auth";
import { verifyUser } from "../../../utils/verifyToken/verifyToken";
import { asyncHandler } from "../../../utils/async-handler";

const router = express.Router();


// Student answer submission and viewing
router.post("/submit", verifyUser, asyncHandler(submitAnswer)); // Submit answer (student)
router.post("/progress", verifyUser, asyncHandler(saveProgress)); // Save progress (student)
router.get("/exam/:examId", verifyUser, asyncHandler(getStudentAnswers)); // Get student answers for exam

// Grading routes
router.put("/:answerId/grade", verifyUser, asyncHandler(gradeTheoryAnswer)); // Grade theory answer (admin, lecturer)
router.post("/exam/:examId/auto-grade",  verifyUser, asyncHandler(autoGradeExam)); // Auto-grade MCQs (admin, lecturer)

export default router;
