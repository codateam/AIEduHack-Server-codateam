"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const course_controller_1 = require("./course.controller");
const verifyToken_1 = require("../../../utils/verifyToken/verifyToken");
const router = express_1.default.Router();
router
    .route("/")
    .post(verifyToken_1.verifyUser, verifyToken_1.verifyLecturer, course_controller_1.createCourse)
    .get(verifyToken_1.verifyUser, course_controller_1.getCourses);
router.get("/mine", verifyToken_1.verifyUser, verifyToken_1.verifyLecturer, course_controller_1.getMyCourses);
router
    .route("/:id")
    .get(verifyToken_1.verifyUser, course_controller_1.getCourse)
    .put(verifyToken_1.verifyUser, verifyToken_1.verifyLecturer, course_controller_1.updateCourse)
    .delete(verifyToken_1.verifyUser, verifyToken_1.verifyAdmin, course_controller_1.deleteCourse);
router.post("/:id/assign-lecturer", verifyToken_1.verifyUser, verifyToken_1.verifyAdmin, course_controller_1.assignLecturer);
exports.default = router;
