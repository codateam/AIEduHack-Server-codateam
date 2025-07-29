import mongoose, { Schema, Document } from "mongoose";

// Exam Schema
export interface IExam extends Document {
  title: string;
  course: mongoose.Types.ObjectId;
  lecturer: mongoose.Types.ObjectId;
  organizationId: mongoose.Types.ObjectId;
  session: string;
  semester: "First" | "Second";
  examType: "regular" | "resit" | "makeup";
  duration: number;
  startTime: Date;
  endTime: Date;
  totalMarks: number;
  isPublished: boolean;
  createdAt: Date;
}

const examSchema = new Schema<IExam>(
  {
    title: { type: String, required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    lecturer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: [true, "Organization is required"],
    },
    session: { type: String, required: true },
    semester: { type: String, enum: ["First", "Second"], required: true },
    examType: {
      type: String,
      enum: ["regular", "resit", "makeup"],
      required: true,
    },
    duration: { type: Number, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    totalMarks: { type: Number, required: true },
    isPublished: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Indexes for organization-scoped queries
examSchema.index({ organizationId: 1, course: 1 });
examSchema.index({ organizationId: 1, lecturer: 1 });
examSchema.index({ organizationId: 1, session: 1, semester: 1 });

// Question Schema
export interface IQuestion extends Document {
  exam: mongoose.Types.ObjectId;
  // organizationId: mongoose.Types.ObjectId;
  type: "mcq" | "theory" | "german";
  text: string;
  options?: string[];
  correctAnswer?: string;
  mark: number;
}

const questionSchema = new Schema<IQuestion>(
  {
    exam: { type: Schema.Types.ObjectId, ref: "Exam", required: true },
    // organizationId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Organization",
    //   required: [true, "Organization is required"],
    // },
    type: {
      type: String,
      enum: ["mcq", "theory", "german"],
      required: true,
    },
    text: { type: String, required: true },
    options: [{ type: String }],
    correctAnswer: { type: String },
    mark: { type: Number, required: true },
  },
  { timestamps: true }
);

// Indexes for organization-scoped queries
questionSchema.index({ organizationId: 1, exam: 1 });

// Answer Schema
export interface IAnswer extends Document {
  student: mongoose.Types.ObjectId;
  exam: mongoose.Types.ObjectId;
  question: mongoose.Types.ObjectId;
  organizationId: mongoose.Types.ObjectId;
  selectedAnswer?: string;
  writtenAnswer?: string;
  score?: number;
  graded: boolean;
  remainingTime?: number;
  feedback?: string
}

const answerSchema = new Schema<IAnswer>(
  {
    student: { type: Schema.Types.ObjectId, ref: "User" },
    exam: { type: Schema.Types.ObjectId, ref: "Exam"},
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: [true, "Organization is required"],
    },
    selectedAnswer: { type: String },
    writtenAnswer: { type: String },
    score: { type: Number , default: 0 },
    graded: { type: Boolean, default: false },
    remainingTime: { type: Number },

    feedback: {type: String, default: ""}
  },
  { timestamps: true }
);

// Indexes for organization-scoped queries
answerSchema.index({ organizationId: 1, student: 1, exam: 1 });
answerSchema.index({ organizationId: 1, exam: 1, question: 1 });

export const Exam = mongoose.model<IExam>("Exam", examSchema);
export const Question = mongoose.model<IQuestion>("Question", questionSchema);
export const Answer = mongoose.model<IAnswer>("Answer", answerSchema);