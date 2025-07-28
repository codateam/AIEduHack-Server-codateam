import { Request, Response, NextFunction } from "express";
import Course from "./course.model";
import ErrorResponse from "../../../utils/error-response";
import { asyncHandler } from "../../../utils/async-handler";
import { response } from "../../../utils/response-formater";
import { uploadCourseMaterials } from "../ai/ai.services";
// import asyncHandler from "../../../utils/async-handler";

// @desc    Create a new course
// @route   POST /api/courses
// @access  Admin only
export const createCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const { user } = req;

    const courseData = { 
      ...req.body, 
      lecturers: [user?.id?.toString() ?? ""],
      organizationId: user?.organizationId
    };

    const course = await Course.create(courseData);
    if (course && courseData.courseMaterials && courseData.courseMaterials.length > 0) {
      const data = await uploadCourseMaterials(course._id.toString(), courseData.courseMaterials);
      console.log("AI Service Response:", data);
    }

    response(res, "Course created successfully", 201, course);
  },
);

// @desc    Get all courses
// @route   GET /api/courses
// @access  All authenticated users
export const getCourses = asyncHandler(async (req: Request, res: Response) => {
  const { organizationId }: any = req.user ;
  const courses = await Course.find({ organizationId }).populate("lecturers", "name email");

  response(res, "Courses retrieved successfully", 200, {
    count: courses.length,
    courses,
  });
});

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  All authenticated users
export const getCourse = asyncHandler(async (req: Request, res: Response) => {
  const course = await Course.findById(req.params.id).populate(
    "lecturers",
    "name email",
  );

  if (!course) {
    throw new ErrorResponse("Course not found", 404);
  }

  response(res, "Course retrieved successfully", 200, course);
});

// @desc    Get courses for current lecturer
// @route   GET /api/courses/mine
// @access  Lecturer only
export const getMyCourses = asyncHandler(
  async (req: Request, res: Response) => {
    const courses = await Course.find({
      lecturers: req.user?.id?.toString() ?? "",
    }).populate("lecturers", "name email");

    response(res, "Courses retrieved successfully", 200, {
      count: courses.length,
      courses,
    });
  },
);

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Admin and course lecturer
export const updateCourse = asyncHandler(
  async (req: Request, res: Response) => {
    let course = await Course.findById(req.params.id);

    if (!course) {
      throw new ErrorResponse("Course not found", 404);
    }

    // Check if user is admin or course lecturer
    // const isAdmin = (req.user as { role?: string })?.role === "admin";
    // const isLecturer = course.lecturers.includes(req.user?.id?.toString() ?? '');

    // if (!isAdmin && !isLecturer) {
    //   throw new ErrorResponse("Not authorized to update this course", 401);
    // }

    // Prevent updating lecturers through this endpoint
    delete req.body.lecturers;

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    response(res, "Course retrieved successfully", 200, course);
  },
);

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Admin only
export const deleteCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
      throw new ErrorResponse("Course not found", 404);
    }

    await course.deleteOne();

    response(res, "Course deleted successfully", 200, {});
  },
);

// @desc    Assign lecturer to course
// @route   POST /api/courses/:id/assign-lecturer
// @access  Admin only
export const assignLecturer = asyncHandler(
  async (req: Request, res: Response) => {
    const { lecturerId } = req.body;

    if (!lecturerId) {
      throw new ErrorResponse("Please provide a lecturer ID", 400);
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      throw new ErrorResponse("Course not found", 404);
    }

    // Check if lecturer is already assigned
    if (course.lecturers.includes(lecturerId)) {
      throw new ErrorResponse("Lecturer already assigned to this course", 400);
    }

    course.lecturers.push(lecturerId);
    await course.save();

    res.status(200).json({
      success: true,
      data: course,
    });
  },
);
