import mongoose from "mongoose";
import { Document } from "mongoose";

export interface IOrganization extends Document {
  id: string;
  name: string;
  code: string; // Unique identifier like "MIT", "HARVARD", etc.
  type: "university" | "school" | "college" | "institute" | "academy";
  description?: string;
  mainAdmin: mongoose.Types.ObjectId;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  contact?: {
    email?: string;
    phone?: string;
    website?: string;
  };
  settings: {
    allowSelfRegistration: boolean;
    requireApproval: boolean;
    maxStudents?: number;
    maxLecturers?: number;
  };
  isActive: boolean;
  isApproved: boolean;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const organizationSchema = new mongoose.Schema<IOrganization>(
  {
    name: {
      type: String,
      required: [true, "Organization name is required"],
      trim: true,
      maxlength: [100, "Organization name cannot exceed 100 characters"],
    },
    code: {
      type: String,
      required: [true, "Organization code is required"],
      unique: true,
      trim: true,
      uppercase: true,
      maxlength: [20, "Organization code cannot exceed 20 characters"],
      match: [/^[A-Z0-9_]+$/, "Organization code can only contain uppercase letters, numbers, and underscores"],
    },
    type: {
      type: String,
      required: [true, "Organization type is required"],
      enum: {
        values: ["university", "college", "school", "institute", "academy"],
        message: "Organization type must be one of: university, college, school, institute, academy",
      },
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    mainAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Main admin is required"],
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true },
      postalCode: { type: String, trim: true },
    },
    contact: {
      email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
      },
      phone: { type: String, trim: true },
      website: { type: String, trim: true },
    },
    settings: {
      allowSelfRegistration: {
        type: Boolean,
        default: true,
      },
      requireApproval: {
        type: Boolean,
        default: false,
      },
      maxStudents: {
        type: Number,
        min: [1, "Maximum students must be at least 1"],
      },
      maxLecturers: {
        type: Number,
        min: [1, "Maximum lecturers must be at least 1"],
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

// Indexes for better performance
organizationSchema.index({ code: 1 });
organizationSchema.index({ isActive: 1 });

const Organization = mongoose.model<IOrganization>("Organization", organizationSchema);

export default Organization;