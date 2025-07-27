import mongoose, { Document, Schema } from "mongoose";

export interface ICourse extends Document {
  code: string;
  title: string;
  description?: string;
  creditUnit: number;
  level: number;
  semester: "First" | "Second";
  department: string;
  lecturers: mongoose.Types.ObjectId[];
  createdAt: Date;
  courseMaterials: string[];
}

const courseSchema = new Schema<ICourse>(
  {
    code: {
      type: String,
      required: [true, "Course code is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    creditUnit: {
      type: Number,
      required: [true, "Credit unit is required"],
      min: [1, "Credit unit must be at least 1"],
    },
    level: {
      type: Number,
      required: [true, "Level is required"],
      enum: [100, 200, 300, 400, 500],
    },
    semester: {
      type: String,
      required: [true, "Semester is required"],
      enum: ["First", "Second"],
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },
    lecturers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "At least one lecturer is required"],
      },
    ],
    courseMaterials: [
      {
        type:String,
       default: [],
      },
    ]
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<ICourse>("Course", courseSchema);
