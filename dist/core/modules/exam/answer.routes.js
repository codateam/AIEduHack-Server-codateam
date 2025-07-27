"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const answer_controller_1 = require("./answer.controller");
const verifyToken_1 = require("../../../utils/verifyToken/verifyToken");
const async_handler_1 = require("../../../utils/async-handler");
const router = express_1.default.Router();
// Student answer submission and viewing
router.post("/submit", verifyToken_1.verifyUser, (0, async_handler_1.asyncHandler)(answer_controller_1.submitAnswer)); // Submit answer (student)
router.post("/progress", verifyToken_1.verifyUser, (0, async_handler_1.asyncHandler)(answer_controller_1.saveProgress)); // Save progress (student)
router.get("/exam/:examId", verifyToken_1.verifyUser, (0, async_handler_1.asyncHandler)(answer_controller_1.getStudentAnswers)); // Get student answers for exam
// Grading routes
router.put("/:answerId/grade", verifyToken_1.verifyUser, (0, async_handler_1.asyncHandler)(answer_controller_1.gradeTheoryAnswer)); // Grade theory answer (admin, lecturer)
router.post("/exam/:examId/auto-grade", verifyToken_1.verifyUser, (0, async_handler_1.asyncHandler)(answer_controller_1.autoGradeExam)); // Auto-grade MCQs (admin, lecturer)
exports.default = router;
