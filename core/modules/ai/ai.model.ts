import mongoose, { Document, Schema } from "mongoose";

export interface IAIChatHistory extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  organizationId: mongoose.Types.ObjectId;
  messages: {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
  }[];
  lang: string;
  createdAt: Date;
  updatedAt: Date;
}

const aiChatHistorySchema = new Schema<IAIChatHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course ID is required"],
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: [true, "Organization ID is required"],
    },

    messages: [
      {
        role: {
          type: String,
          enum: ["user", "assistant"],
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    lang: {
      type: String,
      required: [true, "Language is required"],
      default: "en",
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
aiChatHistorySchema.index({ userId: 1, courseId: 1 }, { unique: true });
aiChatHistorySchema.index({ organizationId: 1, createdAt: -1 });

export default mongoose.model<IAIChatHistory>("AIChatHistory", aiChatHistorySchema);