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
]), auth_controller_1.registerStudent);
router.route("/students").get(verifyToken_1.verifyUser, verifyToken_1.verifyLecturer, auth_controller_1.getStudents);
router.route("/lecturers").get(verifyToken_1.verifyUser, verifyToken_1.verifyLecturer, auth_controller_1.getLecturers);
router
    .route("/lecturers/add")
    .post((0, validation_1.validate)([(0, express_validator_1.body)("email").notEmpty().isEmail()]), auth_controller_1.createLecturer);
router.route("/admins/add").post(verifyToken_1.verifyUser, verifyToken_1.verifyAdmin, (0, validation_1.validate)([(0, express_validator_1.body)("email").notEmpty().isEmail()]), auth_controller_1.createAdmin);
router.route("/admins").get(verifyToken_1.verifyUser, verifyToken_1.verifyAdmin, auth_controller_1.getAdmins);
router.route("/login").post(auth_controller_1.loginWithEmailAndPassword);
exports.default = router;
