import { Express } from "express-serve-static-core";

declare global {
  namespace Express {
    interface User {
      id: string;
      _id: string;
      role: string;
    }
  }
}
