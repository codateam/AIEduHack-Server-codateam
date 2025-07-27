import express from "express";
import {
  createQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
  createMultipleQuestions,
  generateQuestions,
} from "./question.controller";
import { isAuth } from "../../middlewares/is-auth";
import { verifyAdmin, verifyLecturer, verifyUser } from "../../../utils/verifyToken/verifyToken";

const router = express.Router();

// Protect all routes
// router.use(isAuth);

router
  .route("/")
  .post(verifyUser, verifyLecturer, createQuestion) // Add question (admin, lecturer)
  .get(getQuestions); // Get questions (filtered by role)

router.route("/multiple")
  .post(verifyUser, verifyLecturer, createMultipleQuestions); // Add multiple questions (admin, lecturer)

router.route("/generate").post(verifyUser, verifyLecturer, generateQuestions); // Generate questions using AI (admin, lecturer)

router
  .route("/:id")
  .put(verifyUser, verifyLecturer, updateQuestion) // Update question (admin, lecturer)
  .delete(verifyUser, verifyLecturer, deleteQuestion); // Delete question (admin, lecturer)

export default router;
