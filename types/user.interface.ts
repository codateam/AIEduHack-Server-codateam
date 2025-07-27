import { Document } from "mongoose";

export interface IUser extends Document {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  matricNo: string;
  password: string;
  profilepics: string;
  role: "admin" | "lecturer" | "student";
  userToken: boolean;
  createdAt: Date;
  updatedAt: Date;
}
