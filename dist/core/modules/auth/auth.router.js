"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const validation_1 = require("../../middlewares/validation");
const auth_controller_1 = require("./auth.controller");
const verifyToken_1 = require("../../../utils/verifyToken/verifyToken");
const router = express_1.default.Router();
// Student registration with organization selection
router.route("/students/register").post((0, validation_1.validate)([
    (0, express_validator_1.body)("email").notEmpty().isEmail(),
    (0, express_validator_1.body)("password").notEmpty().isStrongPassword({
        minLength: 8,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1,
        minLowercase: 1,
        returnScore: true,
    }),
    (0, express_validator_1.body)("organizationId").notEmpty().withMessage("Organization id is required"),
    // body("orgCode").notEmpty().withMessage("Organization code is required"),
]), auth_controller_1.registerStudent);
// User retrieval endpoints
router.route("/students").get(verifyToken_1.verifyUser, verifyToken_1.verifyLecturer, auth_controller_1.getStudents);
router.route("/lecturers").get(verifyToken_1.verifyUser, verifyToken_1.verifyLecturer, auth_controller_1.getLecturers);
router.route("/admins").get(verifyToken_1.verifyUser, verifyToken_1.verifyAdmin, auth_controller_1.getAdmins);
router.route("/org-admins").get(verifyToken_1.verifyUser, verifyToken_1.verifyAdmin, auth_controller_1.getOrgAdmins);
// Organization-specific user retrieval
router.route("/organizations/:organizationId/users").get(verifyToken_1.verifyUser, verifyToken_1.verifyAdmin, auth_controller_1.getUsersByOrg);
// User creation endpoints
router
    .route("/lecturers/add")
    .post(verifyToken_1.verifyUser, verifyToken_1.verifyAdmin, (0, validation_1.validate)([
    (0, express_validator_1.body)("email").notEmpty().isEmail(),
    // body("organizationId").notEmpty().withMessage("Organization is required"),
]), auth_controller_1.createLecturer);
router.route("/org-admins/add").post(verifyToken_1.verifyUser, verifyToken_1.verifyAdmin, (0, validation_1.validate)([
    (0, express_validator_1.body)("email").notEmpty().isEmail(),
    (0, express_validator_1.body)("organizationId").notEmpty().withMessage("Organization is required"),
]), auth_controller_1.createOrgAdmin);
// Super admin creation endpoint - only existing super admin can create another (for replacement)
router.route("/super-admin/add").post(verifyToken_1.verifyUser, verifyToken_1.verifySuperAdmin, (0, validation_1.validate)([
    (0, express_validator_1.body)("email").notEmpty().isEmail().withMessage("Valid email is required"),
    (0, express_validator_1.body)("password").notEmpty().isStrongPassword({
        minLength: 8,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1,
        minLowercase: 1,
    }).withMessage("Password must be at least 8 characters with uppercase, lowercase, number and symbol"),
    (0, express_validator_1.body)("firstName").notEmpty().withMessage("First name is required"),
    (0, express_validator_1.body)("lastName").notEmpty().withMessage("Last name is required"),
]), auth_controller_1.createSuperAdminEndpoint);
// Login endpoint
router.route("/login").post(auth_controller_1.loginWithEmailAndPassword);
exports.default = router;
