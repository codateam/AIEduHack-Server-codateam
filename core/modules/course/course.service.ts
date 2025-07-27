import mongoose from "mongoose";
import Course, { ICourse } from "./course.model";
import ErrorResponse from "../../../utils/error-response";

export interface CourseCreateInput {
  code: string;
  title: string;
  description?: string;
  creditUnit: number;
  level: number;
  semester: "First" | "Second";
  department: string;
  lecturers: mongoose.Types.ObjectId[];
}

export interface CourseUpdateInput {
  title?: string;
  description?: string;
  creditUnit?: number;
  level?: number;
  semester?: "First" | "Second";
  department?: string;
}

export class CourseService {
  static async createCourse(courseData: CourseCreateInput): Promise<ICourse> {
    const existingCourse = await Course.findOne({ code: courseData.code });
    if (existingCourse) {
      throw new ErrorResponse("Course with this code already exists", 400);
    }
    return await Course.create(courseData);
  }

  static async getCourseById(courseId: string): Promise<ICourse | null> {
    return await Course.findById(courseId).populate("lecturers", "name email");
  }

  static async updateCourse(
    courseId: string,
    updateData: CourseUpdateInput
  ): Promise<ICourse | null> {
    return await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
      runValidators: true,
    }).populate("lecturers", "name email");
  }

  static async deleteCourse(courseId: string): Promise<boolean> {
    const course = await Course.findById(courseId);
    if (!course) return false;
    await course.deleteOne();
    return true;
  }

  static async assignLecturer(
    courseId: string,
    lecturerId: mongoose.Types.ObjectId
  ): Promise<ICourse | null> {
    const course = await Course.findById(courseId);
    if (!course) return null;

    if (course.lecturers.includes(lecturerId)) {
      throw new ErrorResponse("Lecturer already assigned to this course", 400);
    }

    course.lecturers.push(lecturerId);
    await course.save();
    return course;
  }

  static async getLecturerCourses(
    lecturerId: mongoose.Types.ObjectId
  ): Promise<ICourse[]> {
    return await Course.find({ lecturers: lecturerId }).populate(
      "lecturers",
      "name email"
    );
  }

  static async getAllCourses(): Promise<ICourse[]> {
    return await Course.find().populate("lecturers", "name email");
  }
}