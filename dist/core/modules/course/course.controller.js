"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignLecturer = exports.deleteCourse = exports.updateCourse = exports.getMyCourses = exports.getCourse = exports.getCourses = exports.createCourse = void 0;
const course_model_1 = __importDefault(require("./course.model"));
const error_response_1 = __importDefault(require("../../../utils/error-response"));
const async_handler_1 = require("../../../utils/async-handler");
const response_formater_1 = require("../../../utils/response-formater");
const ai_services_1 = require("../ai/ai.services");
// import asyncHandler from "../../../utils/async-handler";
// @desc    Create a new course
// @route   POST /api/courses
// @access  Admin only
exports.createCourse = (0, async_handler_1.asyncHandler)(async (req, res) => {
    var _a, _b;
    const { user } = req;
    const courseData = Object.assign(Object.assign({}, req.body), { lecturers: [(_b = (_a = user === null || user === void 0 ? void 0 : user.id) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : ""], organizationId: user === null || user === void 0 ? void 0 : user.organizationId });
    const course = await course_model_1.default.create(courseData);
    if (course && courseData.courseMaterials && courseData.courseMaterials.length > 0) {
        const data = await (0, ai_services_1.uploadCourseMaterials)(course._id.toString(), courseData.courseMaterials);
        console.log("AI Service Response:", data);
    }
    (0, response_formater_1.response)(res, "Course created successfully", 201, course);
});
// @desc    Get all courses
// @route   GET /api/courses
// @access  All authenticated users
exports.getCourses = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const courses = await course_model_1.default.find().populate("lecturers", "name email");
    (0, response_formater_1.response)(res, "Courses retrieved successfully", 200, {
        count: courses.length,
        courses,
    });
});
// @desc    Get single course
// @route   GET /api/courses/:id
// @access  All authenticated users
exports.getCourse = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const course = await course_model_1.default.findById(req.params.id).populate("lecturers", "name email");
    if (!course) {
        throw new error_response_1.default("Course not found", 404);
    }
    (0, response_formater_1.response)(res, "Course retrieved successfully", 200, course);
});
// @desc    Get courses for current lecturer
// @route   GET /api/courses/mine
// @access  Lecturer only
exports.getMyCourses = (0, async_handler_1.asyncHandler)(async (req, res) => {
    var _a, _b, _c;
    const courses = await course_model_1.default.find({
        lecturers: (_c = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id) === null || _b === void 0 ? void 0 : _b.toString()) !== null && _c !== void 0 ? _c : "",
    }).populate("lecturers", "name email");
    (0, response_formater_1.response)(res, "Courses retrieved successfully", 200, {
        count: courses.length,
        courses,
    });
});
// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Admin and course lecturer
exports.updateCourse = (0, async_handler_1.asyncHandler)(async (req, res) => {
    let course = await course_model_1.default.findById(req.params.id);
    if (!course) {
        throw new error_response_1.default("Course not found", 404);
    }
    // Check if user is admin or course lecturer
    // const isAdmin = (req.user as { role?: string })?.role === "admin";
    // const isLecturer = course.lecturers.includes(req.user?.id?.toString() ?? '');
    // if (!isAdmin && !isLecturer) {
    //   throw new ErrorResponse("Not authorized to update this course", 401);
    // }
    // Prevent updating lecturers through this endpoint
    delete req.body.lecturers;
    course = await course_model_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    (0, response_formater_1.response)(res, "Course retrieved successfully", 200, course);
});
// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Admin only
exports.deleteCourse = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const course = await course_model_1.default.findById(req.params.id);
    if (!course) {
        throw new error_response_1.default("Course not found", 404);
    }
    await course.deleteOne();
    (0, response_formater_1.response)(res, "Course deleted successfully", 200, {});
});
// @desc    Assign lecturer to course
// @route   POST /api/courses/:id/assign-lecturer
// @access  Admin only
exports.assignLecturer = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { lecturerId } = req.body;
    if (!lecturerId) {
        throw new error_response_1.default("Please provide a lecturer ID", 400);
    }
    const course = await course_model_1.default.findById(req.params.id);
    if (!course) {
        throw new error_response_1.default("Course not found", 404);
    }
    // Check if lecturer is already assigned
    if (course.lecturers.includes(lecturerId)) {
        throw new error_response_1.default("Lecturer already assigned to this course", 400);
    }
    course.lecturers.push(lecturerId);
    await course.save();
    res.status(200).json({
        success: true,
        data: course,
    });
});
