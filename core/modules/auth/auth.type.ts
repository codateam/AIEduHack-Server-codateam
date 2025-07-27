import { ObjectId } from "mongoose";

export interface PayloadType {
  userEmail: string;
  userId: string;
  role: boolean;
}
export interface RegisterPayloadType {
  userEmail?: string;
  userId: any;
  isAdmin?: boolean;
}
