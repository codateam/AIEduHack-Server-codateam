import express from "express";
import { body } from "express-validator";
import passport from "passport";
import { storeRedirectToInSession } from "../../middlewares/store-redirect";
import { validate } from "../../middlewares/validation";
import {
  loginWithEmailAndPassword,
  createAdmin,
  createLecturer,
  registerStudent,
  getLecturers,
  getAdmins,
  getStudents,
} from "./auth.controller";
import { asyncHandler } from "../../../utils/async-handler";
import {
  verifyAdmin,
  verifyLecturer,
  verifyUser,
} from "../../../utils/verifyToken/verifyToken";

const router = express.Router();

router.route("/students/register").post(
  validate([
    body("email").notEmpty().isEmail(),
    body("password").notEmpty().isStrongPassword({
      minLength: 8,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
      minLowercase: 1,
      returnScore: true,
    }),
  ]),
  registerStudent,
);
router.route("/students").get(verifyUser, verifyLecturer, getStudents);

router.route("/lecturers").get(verifyUser, verifyLecturer, getLecturers);

router
  .route("/lecturers/add")
  .post(validate([body("email").notEmpty().isEmail()]), createLecturer);

router.route("/admins/add").post(
  verifyUser,
  verifyAdmin,

  validate([body("email").notEmpty().isEmail()]),
  createAdmin,
);

router.route("/admins").get(verifyUser, verifyAdmin, getAdmins);

router.route("/login").post(loginWithEmailAndPassword);

export default router;
