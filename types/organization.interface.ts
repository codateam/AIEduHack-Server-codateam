import { Types } from "mongoose";

export interface IOrganization {
  _id: Types.ObjectId;
  name: string;
  code: string;
  type: "university" | "college" | "school" | "institute" | "academy";
  description?: string;
  mainAdmin: Types.ObjectId;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  settings?: {
    allowSelfRegistration?: boolean;
    requireApproval?: boolean;
    maxStudents?: number;
    maxLecturers?: number;
  };
  isActive: boolean;
  isApproved: boolean;
  approvedBy?: Types.ObjectId;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrganizationRequest {
  name: string;
  code: string;
  type: "university" | "college" | "school" | "institute" | "academy";
  description?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  settings?: {
    allowSelfRegistration?: boolean;
    requireApproval?: boolean;
    maxStudents?: number;
    maxLecturers?: number;
  };
  mainAdminData?: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };
}

export interface UpdateOrganizationRequest {
  name?: string;
  code?: string;
  type?: "university" | "college" | "school" | "institute" | "academy";
  description?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  settings?: {
    allowSelfRegistration?: boolean;
    requireApproval?: boolean;
    maxStudents?: number;
    maxLecturers?: number;
  };
  isActive?: boolean;
}