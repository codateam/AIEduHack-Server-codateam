"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const exam_controller_1 = require("./exam.controller");
const verifyToken_1 = require("../../../utils/verifyToken/verifyToken");
const router = express_1.default.Router();
// Exam Creation & Management
router
    .route("/")
    .post(verifyToken_1.verifyUser, verifyToken_1.verifyLecturer, exam_controller_1.createExam)
    .get(verifyToken_1.verifyUser, exam_controller_1.getExams);
router
    .route("/:id")
    .get(verifyToken_1.verifyUser, exam_controller_1.getExam)
    .put(verifyToken_1.verifyUser, verifyToken_1.verifyLecturer, exam_controller_1.updateExam)
    .delete(verifyToken_1.verifyUser, verifyToken_1.verifyAdmin, exam_controller_1.deleteExam);
router.post("/:id/publish", verifyToken_1.verifyUser, verifyToken_1.verifyLecturer, exam_controller_1.publishExam);
// Question Management
router
    .route("/questions")
    .post(verifyToken_1.verifyUser, verifyToken_1.verifyLecturer, exam_controller_1.addQuestion)
    .get(verifyToken_1.verifyUser, exam_controller_1.getQuestions);
router
    .route("/questions/:id")
    .put(verifyToken_1.verifyUser, verifyToken_1.verifyLecturer, exam_controller_1.updateQuestion)
    .delete(verifyToken_1.verifyUser, verifyToken_1.verifyLecturer, exam_controller_1.deleteQuestion);
// Student Exam Participation
router.get("/student/exams", verifyToken_1.verifyUser, exam_controller_1.getExams);
router.post("/student/exams/:id/start", verifyToken_1.verifyUser, exam_controller_1.startExam);
router.post("/student/answers", verifyToken_1.verifyUser, exam_controller_1.submitAnswer);
router.post("/student/exams/:id/submit", verifyToken_1.verifyUser, exam_controller_1.finishExam);
router.get("/student/results/:examId", verifyToken_1.verifyUser, exam_controller_1.getResult);
// Grading
router.post("/:id/auto-grade", verifyToken_1.verifyUser, verifyToken_1.verifyLecturer, exam_controller_1.autoGrade);
router.post("/:id/llm-grade", verifyToken_1.verifyUser, verifyToken_1.verifyLecturer, exam_controller_1.llmGrade);
exports.default = router;
