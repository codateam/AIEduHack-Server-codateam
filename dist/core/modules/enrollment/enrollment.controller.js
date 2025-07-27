"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dropEnrollment = exports.updateEnrollment = exports.getEnrollments = exports.enrollStudent = void 0;
const enrollment_service_1 = require("./enrollment.service");
const response_formater_1 = require("../../../utils/response-formater");
const async_handler_1 = require("../../../utils/async-handler");
// @desc    Enroll a student in a course
// @route   POST /api/enrollments
// @access  Student or Admin
exports.enrollStudent = (0, async_handler_1.asyncHandler)(async (req, res) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const student = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : "";
    const { course, level, semester, session } = req.body;
    const enrollment = await enrollment_service_1.enrollmentService.createEnrollment({ student, course, level, semester, session }, (_e = (_d = (_c = req.user) === null || _c === void 0 ? void 0 : _c.id) === null || _d === void 0 ? void 0 : _d.toString()) !== null && _e !== void 0 ? _e : "", (_g = (_f = req.user) === null || _f === void 0 ? void 0 : _f.role) !== null && _g !== void 0 ? _g : "");
    (0, response_formater_1.response)(res, "Student enrolled successfully", 201, enrollment);
});
// @desc    Get enrollments (filtered by student or course)
// @route   GET /api/enrollments
// @access  All authenticated users
exports.getEnrollments = (0, async_handler_1.asyncHandler)(async (req, res) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { student, course } = req.query;
    const studentId = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === "student" ? id : student;
    const enrollments = await enrollment_service_1.enrollmentService.getEnrollments({ student: studentId, course: course }, (_e = (_d = (_c = req.user) === null || _c === void 0 ? void 0 : _c.id) === null || _d === void 0 ? void 0 : _d.toString()) !== null && _e !== void 0 ? _e : "", (_g = (_f = req.user) === null || _f === void 0 ? void 0 : _f.role) !== null && _g !== void 0 ? _g : "");
    (0, response_formater_1.response)(res, "Enrollments retrieved successfully", 200, {
        count: enrollments.length,
        enrollments,
    });
});
// @desc    Update enrollment (score, grade, or status)
// @route   PUT /api/enrollments/:id
// @access  Admin or Lecturer
exports.updateEnrollment = (0, async_handler_1.asyncHandler)(async (req, res) => {
    var _a, _b;
    const { id } = req.params;
    const { score, grade, status } = req.body;
    const enrollment = await enrollment_service_1.enrollmentService.updateEnrollment(id, { score, grade, status }, (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== null && _b !== void 0 ? _b : "");
    (0, response_formater_1.response)(res, "Enrollment updated successfully", 200, enrollment);
});
// @desc    Drop enrollment
// @route   PUT /api/enrollments/:id/drop
// @access  Student or Admin
exports.dropEnrollment = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const enrollment = await enrollment_service_1.enrollmentService.dropEnrollment(id);
    (0, response_formater_1.response)(res, "Enrollment dropped successfully", 200, enrollment);
});
