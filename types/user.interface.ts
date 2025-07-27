import { Document, Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  middleName: string;
  userToken: string;
  email: string;
  password: string;
  profilepics?: string;
  role: "admin" | "lecturer" | "student" | "super_admin";
  organizationId?: Types.ObjectId;
  matricNo?: string;
  isApproved: boolean;
}
