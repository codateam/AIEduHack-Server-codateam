import express, { Request, Response, NextFunction } from "express";
import {
  createCourse,
  getCourses,
  getCourse,
  getMyCourses,
  updateCourse,
  deleteCourse,
  assignLecturer,
  queryAIAgent,
} from "./course.controller";
import {
  verifyUser,
  verifyAdmin,
  verifyLecturer,
} from "../../../utils/verifyToken/verifyToken";
import { asyncHandler } from "../../../utils/async-handler";

const router = express.Router();

router
  .route("/")
  .post(verifyUser, verifyLecturer, createCourse)
  .get(verifyUser, getCourses);

router.get("/mine", verifyUser, verifyLecturer, getMyCourses);

router
  .route("/:id")
  .get(verifyUser, getCourse)
  .put(verifyUser, verifyLecturer, updateCourse)
  .delete(verifyUser, verifyAdmin, deleteCourse);

router.post("/:id/assign-lecturer", verifyUser, verifyAdmin, assignLecturer);

router.post("/:id/ai-teaching-agent", verifyUser, verifyLecturer, queryAIAgent);

export default router;
