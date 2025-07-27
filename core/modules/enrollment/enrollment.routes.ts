import express from "express";
import {
  enrollStudent,
  getEnrollments,
  updateEnrollment,
  dropEnrollment,
} from "./enrollment.controller";
import {
  verifyUser,
  verifyAdmin,
  verifyLecturer,
} from "../../../utils/verifyToken/verifyToken";

const router = express.Router();

router
  .route("/")
  .post(verifyUser, enrollStudent)
  .get(verifyUser, getEnrollments);

router
  .route("/:id")
  .put(verifyUser, verifyLecturer, updateEnrollment)
  .delete(verifyUser, verifyLecturer, dropEnrollment);

export default router;