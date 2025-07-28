import express from "express";
import { body } from "express-validator";
import passport from "passport";
import { storeRedirectToInSession } from "../../middlewares/store-redirect";
import { validate } from "../../middlewares/validation";
import {
  loginWithEmailAndPassword,
  createOrgAdmin,
  createLecturer,
  createSuperAdminEndpoint,
  registerStudent,
  getLecturers,
  getAdmins,
  getOrgAdmins,
  getStudents,
  getUsersByOrg,
} from "./auth.controller";
import { asyncHandler } from "../../../utils/async-handler";
import {
  verifyAdmin,
  verifyLecturer,
  verifyUser,
  verifySuperAdmin,
} from "../../../utils/verifyToken/verifyToken";

const router = express.Router();

// Student registration with organization selection
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
    body("organizationId").notEmpty().withMessage("Organization id is required"),
    // body("orgCode").notEmpty().withMessage("Organization code is required"),
  ]),
  registerStudent,
);

// User retrieval endpoints
router.route("/students").get(verifyUser, verifyLecturer, getStudents);
router.route("/lecturers").get(verifyUser, verifyLecturer, getLecturers);
router.route("/admins").get(verifyUser, verifyAdmin, getAdmins);
router.route("/org-admins").get(verifyUser, verifyAdmin, getOrgAdmins);

// Organization-specific user retrieval
router.route("/organizations/:organizationId/users").get(verifyUser, verifyAdmin, getUsersByOrg);

// User creation endpoints
router
  .route("/lecturers/add")
  .post(
    verifyUser,
    verifyAdmin,
    validate([
      body("email").notEmpty().isEmail(),
      // body("organizationId").notEmpty().withMessage("Organization is required"),
    ]),
    createLecturer
  );

router.route("/org-admins/add").post(
  verifyUser,
  verifyAdmin,
  validate([
    body("email").notEmpty().isEmail(),
    body("organizationId").notEmpty().withMessage("Organization is required"),
  ]),
  createOrgAdmin,
);

// Super admin creation endpoint - only existing super admin can create another (for replacement)
router.route("/super-admin/add").post(
  verifyUser,
  verifySuperAdmin,
  validate([
    body("email").notEmpty().isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().isStrongPassword({
      minLength: 8,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
      minLowercase: 1,
    }).withMessage("Password must be at least 8 characters with uppercase, lowercase, number and symbol"),
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
  ]),
  createSuperAdminEndpoint,
);

// Login endpoint
router.route("/login").post(loginWithEmailAndPassword);

export default router;
