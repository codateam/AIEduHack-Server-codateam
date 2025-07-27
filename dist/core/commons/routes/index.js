"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const auth_router_1 = __importDefault(require("../../../core/modules/auth/auth.router"));
const course_routes_1 = __importDefault(require("../../modules/course/course.routes"));
const enrollment_routes_1 = __importDefault(require("../../modules/enrollment/enrollment.routes"));
const exam_routes_1 = __importDefault(require("../../modules/exam/exam.routes"));
const question_routes_1 = __importDefault(require("../../modules/exam/question.routes"));
const answer_routes_1 = __importDefault(require("../../modules/exam/answer.routes"));
// import productRouters from "../../modules/product/routes";
const router = express.Router();
router.get("/", (req, res) => {
    res.send({ message: "Welcome to server!" });
});
router.use("/auth", auth_router_1.default);
router.use("/courses", course_routes_1.default);
router.use("/enrollments", enrollment_routes_1.default);
router.use("/exams", exam_routes_1.default);
router.use("/questions", question_routes_1.default);
router.use("/answers", answer_routes_1.default);
exports.default = router;
