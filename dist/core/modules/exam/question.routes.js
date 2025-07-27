"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const question_controller_1 = require("./question.controller");
const verifyToken_1 = require("../../../utils/verifyToken/verifyToken");
const router = express_1.default.Router();
// Protect all routes
// router.use(isAuth);
router
    .route("/")
    .post(verifyToken_1.verifyUser, verifyToken_1.verifyLecturer, question_controller_1.createQuestion) // Add question (admin, lecturer)
    .get(question_controller_1.getQuestions); // Get questions (filtered by role)
router.route("/multiple")
    .post(verifyToken_1.verifyUser, verifyToken_1.verifyLecturer, question_controller_1.createMultipleQuestions); // Add multiple questions (admin, lecturer)
router.route("/generate").post(verifyToken_1.verifyUser, verifyToken_1.verifyLecturer, question_controller_1.generateQuestions); // Generate questions using AI (admin, lecturer)
router
    .route("/:id")
    .put(verifyToken_1.verifyUser, verifyToken_1.verifyLecturer, question_controller_1.updateQuestion) // Update question (admin, lecturer)
    .delete(verifyToken_1.verifyUser, verifyToken_1.verifyLecturer, question_controller_1.deleteQuestion); // Delete question (admin, lecturer)
exports.default = router;
