import express from "express";
import { body } from "express-validator";
import { validate } from "../../middlewares/validation";
import {
  createOrg,
  getAllOrgs,
  getOrgById,
  getActiveOrgs,
  getPendingOrgs,
  approveOrg,
  disapproveOrg,
  updateOrg,
  deleteOrg,
} from "./org.controller";
import {
  verifyUser,
  verifyAdmin,
  verifySuperAdmin,
} from "../../../utils/verifyToken/verifyToken";

const router = express.Router();

// Public routes
router.route("/active").get(getActiveOrgs); // Public list of active organizations

// Public organization creation - anyone can create an organization
router.route("/").post(
  validate([
    body("organization.name").notEmpty().withMessage("Organization name is required"),
    body("organization.code").notEmpty().withMessage("Organization code is required"),
    body("organization.type").isIn(["university", "school", "college", "institute", "academy"]).withMessage("Invalid organization type"),
    body("mainAdmin.firstName").notEmpty().withMessage("Main admin first name is required"),
    body("mainAdmin.lastName").notEmpty().withMessage("Main admin last name is required"),
    body("mainAdmin.email").isEmail().withMessage("Valid main admin email is required"),
    body("mainAdmin.password").isLength({ min: 6 }).withMessage("Main admin password must be at least 6 characters"),
  ]),
  createOrg
);

// Protected routes - require authentication
router.use(verifyUser);

// Super admin only routes
router.route("/all").get(verifySuperAdmin, getAllOrgs); // Get all organizations including pending
router.route("/pending").get(verifySuperAdmin, getPendingOrgs); // Get pending organizations
router.route("/:id/approve").patch(verifySuperAdmin, approveOrg); // Approve organization
router.route("/:id/disapprove").patch(verifySuperAdmin, disapproveOrg); // Disapprove organization

// General authenticated routes
router.route("/:id")
  .get(getOrgById)
  .put(verifyAdmin, updateOrg) // Only admins can update
  .delete(verifySuperAdmin, deleteOrg); // Only super admin can delete

export default router;