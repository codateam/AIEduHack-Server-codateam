"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrollmentService = exports.EnrollmentService = void 0;
const error_response_1 = __importDefault(require("../../../utils/error-response"));
const enrollment_model_1 = __importDefault(require("./enrollment.model"));
class EnrollmentService {
    // Create enrollment
    async createEnrollment(data, userId, userRole) {
        // Check if user is student enrolling themselves
        if (userRole === "student" && userId !== data.student) {
            throw new error_response_1.default("Students can only enroll themselves", 403);
        }
        const enrollment = await enrollment_model_1.default.create(data);
        return enrollment;
    }
    // Get enrollments
    async getEnrollments(query, userId, userRole) {
        const filter = {};
        // Students can only view their own enrollments
        if (userRole === "student") {
            filter.student = userId;
        }
        else if (query.student) {
            filter.student = query.student;
        }
        else if (query.course) {
            filter.course = query.course;
        }
        const enrollments = await enrollment_model_1.default.find(filter)
            .populate("student", "name email")
            .populate("course", "title code");
        return enrollments;
    }
    // Update enrollment
    async updateEnrollment(id, data, userRole) {
        const enrollment = await enrollment_model_1.default.findById(id);
        if (!enrollment) {
            throw new error_response_1.default("Enrollment not found", 404);
        }
        // Only allow updates to score and grade if user is admin or lecturer
        if ((data.score !== undefined || data.grade !== undefined) &&
            !["admin", "lecturer"].includes(userRole)) {
            throw new error_response_1.default("Only lecturers and admins can update scores and grades", 403);
        }
        if (data.score !== undefined)
            enrollment.score = data.score;
        if (data.grade !== undefined)
            enrollment.grade = data.grade;
        // if (data.status !== undefined) enrollment?.status = data.status;
        await enrollment.save();
        return enrollment;
    }
    // Drop enrollment
    async dropEnrollment(id) {
        const enrollment = await enrollment_model_1.default.findById(id);
        if (!enrollment) {
            throw new error_response_1.default("Enrollment not found", 404);
        }
        enrollment.status = "dropped";
        await enrollment.save();
        return enrollment;
    }
}
exports.EnrollmentService = EnrollmentService;
exports.enrollmentService = new EnrollmentService();
