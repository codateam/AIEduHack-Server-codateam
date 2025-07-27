export interface User {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  matricNo: string;
  password: string;
  profilepics: string;
  role: "admin" | "lecturer" | "student";
  userToken: boolean;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

declare global {
  namespace Express {
    interface User {
      id: string;
      role: string;
      data?: any;
    }
  }
}