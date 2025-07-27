import mongoose, { Schema, Document } from "mongoose";

export interface IEnrollment extends Document {
  student: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  organizationId: mongoose.Types.ObjectId;
  level: number;
  semester: "First" | "Second";
  session: string;
  status: "active" | "completed" | "dropped" | "failed";
  score?: number;
  grade?: string;
  enrolledAt: Date;
}

const enrollmentSchema = new Schema<IEnrollment>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: [true, "Organization is required"],
    },
    level: {
      type: Number,
      required: true,
      enum: [100, 200, 300, 400, 500],
    },
    semester: {
      type: String,
      required: true,
      enum: ["First", "Second"],
    },
    session: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "completed", "dropped", "failed"],
      default: "active",
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
    },
    grade: {
      type: String,
      enum: ["A", "B", "C", "D", "E", "F"],
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate enrollments within organization
enrollmentSchema.index(
  { organizationId: 1, student: 1, course: 1, semester: 1, session: 1 },
  { unique: true },
);

// Additional indexes for organization-scoped queries
enrollmentSchema.index({ organizationId: 1, student: 1 });
enrollmentSchema.index({ organizationId: 1, course: 1 });
enrollmentSchema.index({ organizationId: 1, status: 1 });

export default mongoose.model<IEnrollment>("Enrollment", enrollmentSchema);
