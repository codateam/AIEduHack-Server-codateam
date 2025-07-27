import ErrorResponse from "../../../utils/error-response";
import Enrollment from "./enrollment.model";

export class EnrollmentService {
  // Create enrollment
  async createEnrollment(
    data: {
      student: string;
      course: string;
      level: string;
      semester: string;
      session: string;
    },
    userId: string,
    userRole: string,
    userOrganizationId?: string,
  ) {
    // Check if user is student enrolling themselves
    if (userRole === "student" && userId !== data.student) {
      throw new ErrorResponse("Students can only enroll themselves", 403);
    }

    const enrollment = await Enrollment.create({
      ...data,
      organizationId: userOrganizationId,
    });
    return enrollment;
  }

  // Get enrollments
  async getEnrollments(
    query: { student?: string; course?: string },
    userId: string,
    userRole: string,
  ) {
    const filter: any = {};

    // Students can only view their own enrollments
    if (userRole === "student") {
      filter.student = userId;
    } else if (query.student) {
      filter.student = query.student;
    } else if (query.course) {
      filter.course = query.course;
    }

    const enrollments = await Enrollment.find(filter)
      .populate("student", "name email")
      .populate("course", "title code");

    return enrollments;
  }

  // Update enrollment
  async updateEnrollment(
    id: string,
    data: {
      score?: number;
      grade?: string;
      status?: string;
    },
    userRole: string,
  ) {
    const enrollment = await Enrollment.findById(id);
    if (!enrollment) {
      throw new ErrorResponse("Enrollment not found", 404);
    }

    // Only allow updates to score and grade if user is admin or lecturer
    if (
      (data.score !== undefined || data.grade !== undefined) &&
      !["admin", "lecturer"].includes(userRole)
    ) {
      throw new ErrorResponse(
        "Only lecturers and admins can update scores and grades",
        403,
      );
    }

    if (data.score !== undefined) enrollment.score = data.score;
    if (data.grade !== undefined) enrollment.grade = data.grade;
    // if (data.status !== undefined) enrollment?.status = data.status;

    await enrollment.save();
    return enrollment;
  }

  // Drop enrollment
  async dropEnrollment(id: string) {
    const enrollment = await Enrollment.findById(id);
    if (!enrollment) {
      throw new ErrorResponse("Enrollment not found", 404);
    }

    enrollment.status = "dropped";
    await enrollment.save();
    return enrollment;
  }
}

export const enrollmentService = new EnrollmentService();
