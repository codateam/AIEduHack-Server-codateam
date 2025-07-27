"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseService = void 0;
const course_model_1 = __importDefault(require("./course.model"));
const error_response_1 = __importDefault(require("../../../utils/error-response"));
class CourseService {
    static async createCourse(courseData) {
        const existingCourse = await course_model_1.default.findOne({ code: courseData.code });
        if (existingCourse) {
            throw new error_response_1.default("Course with this code already exists", 400);
        }
        return await course_model_1.default.create(courseData);
    }
    static async getCourseById(courseId) {
        return await course_model_1.default.findById(courseId).populate("lecturers", "name email");
    }
    static async updateCourse(courseId, updateData) {
        return await course_model_1.default.findByIdAndUpdate(courseId, updateData, {
            new: true,
            runValidators: true,
        }).populate("lecturers", "name email");
    }
    static async deleteCourse(courseId) {
        const course = await course_model_1.default.findById(courseId);
        if (!course)
            return false;
        await course.deleteOne();
        return true;
    }
    static async assignLecturer(courseId, lecturerId) {
        const course = await course_model_1.default.findById(courseId);
        if (!course)
            return null;
        if (course.lecturers.includes(lecturerId)) {
            throw new error_response_1.default("Lecturer already assigned to this course", 400);
        }
        course.lecturers.push(lecturerId);
        await course.save();
        return course;
    }
    static async getLecturerCourses(lecturerId) {
        return await course_model_1.default.find({ lecturers: lecturerId }).populate("lecturers", "name email");
    }
    static async getAllCourses() {
        return await course_model_1.default.find().populate("lecturers", "name email");
    }
}
exports.CourseService = CourseService;
