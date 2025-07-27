import { Request, Response } from "express";
import { enrollmentService } from "./enrollment.service";
import { response } from "../../../utils/response-formater";
import { asyncHandler } from "../../../utils/async-handler";

// @desc    Enroll a student in a course
// @route   POST /api/enrollments
// @access  Student or Admin
export const enrollStudent = asyncHandler(
  async (req: Request, res: Response) => {
    const student = req.user?.id ?? "";
    const { course, level, semester, session } = req.body;

    const enrollment = await enrollmentService.createEnrollment(
      { student, course, level, semester, session },
      req.user?.id?.toString() ?? "",
      req.user?.role ?? "",
      req.user?.organizationId?.toString(),
    );

    response(res, "Student enrolled successfully", 201, enrollment);
  },
);

// @desc    Get enrollments (filtered by student or course)
// @route   GET /api/enrollments
// @access  All authenticated users
export const getEnrollments = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.user?.id;
    const { student, course } = req.query;
    const studentId = req.user?.role === "student" ? id : student;

    const enrollments = await enrollmentService.getEnrollments(
      { student: studentId as string, course: course as string },
      req.user?.id?.toString() ?? "",
      req.user?.role ?? "",
    );

    response(res, "Enrollments retrieved successfully", 200, {
      count: enrollments.length,
      enrollments,
    });
  },
);

// @desc    Update enrollment (score, grade, or status)
// @route   PUT /api/enrollments/:id
// @access  Admin or Lecturer
export const updateEnrollment = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { score, grade, status } = req.body;

    const enrollment = await enrollmentService.updateEnrollment(
      id,
      { score, grade, status },
      req.user?.role ?? "",
    );

    response(res, "Enrollment updated successfully", 200, enrollment);
  },
);

// @desc    Drop enrollment
// @route   PUT /api/enrollments/:id/drop
// @access  Student or Admin
export const dropEnrollment = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const enrollment = await enrollmentService.dropEnrollment(id);

    response(res, "Enrollment dropped successfully", 200, enrollment);
  },
);
