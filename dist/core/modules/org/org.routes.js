"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const validation_1 = require("../../middlewares/validation");
const org_controller_1 = require("./org.controller");
const verifyToken_1 = require("../../../utils/verifyToken/verifyToken");
const router = express_1.default.Router();
// Public routes
router.route("/active").get(org_controller_1.getActiveOrgs); // Public list of active organizations
// Public organization creation - anyone can create an organization
router.route("/").post((0, validation_1.validate)([
    (0, express_validator_1.body)("organization.name").notEmpty().withMessage("Organization name is required"),
    (0, express_validator_1.body)("organization.code").notEmpty().withMessage("Organization code is required"),
    (0, express_validator_1.body)("organization.type").isIn(["university", "school", "college", "institute", "academy"]).withMessage("Invalid organization type"),
    (0, express_validator_1.body)("mainAdmin.firstName").notEmpty().withMessage("Main admin first name is required"),
    (0, express_validator_1.body)("mainAdmin.lastName").notEmpty().withMessage("Main admin last name is required"),
    (0, express_validator_1.body)("mainAdmin.email").isEmail().withMessage("Valid main admin email is required"),
    (0, express_validator_1.body)("mainAdmin.password").isLength({ min: 6 }).withMessage("Main admin password must be at least 6 characters"),
]), org_controller_1.createOrg);
// Protected routes - require authentication
router.use(verifyToken_1.verifyUser);
// Super admin only routes
router.route("/all").get(verifyToken_1.verifySuperAdmin, org_controller_1.getAllOrgs); // Get all organizations including pending
router.route("/pending").get(verifyToken_1.verifySuperAdmin, org_controller_1.getPendingOrgs); // Get pending organizations
router.route("/:id/approve").patch(verifyToken_1.verifySuperAdmin, org_controller_1.approveOrg); // Approve organization
router.route("/:id/disapprove").patch(verifyToken_1.verifySuperAdmin, org_controller_1.disapproveOrg); // Disapprove organization
// General authenticated routes
router.route("/:id")
    .get(org_controller_1.getOrgById)
    .put(verifyToken_1.verifyAdmin, org_controller_1.updateOrg) // Only admins can update
    .delete(verifyToken_1.verifySuperAdmin, org_controller_1.deleteOrg); // Only super admin can delete
exports.default = router;
