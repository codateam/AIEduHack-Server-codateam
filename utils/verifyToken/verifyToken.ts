import { NextFunction, Request, Response } from "express";
import ErrorResponse from "../error-response";
import {
  getTokenFromHeader,
  verifyToken,
} from "../../core/modules/auth/token.service";

export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
  const token = getTokenFromHeader(req);
  const user = verifyToken(token);
  console.log("User verified:", req.user);
  if (user !== null) {
    req.user = user?.data ? user.data : user;
    
    next();
  } else {
    throw new ErrorResponse("unauthenticated", 401);
  }
};

export const verifyAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { user } = req;

  console.log({ admin: user });
  if (user !== null && (user as { role?: string })?.role === "admin") {
    next();
  } else {
    throw new ErrorResponse("unauthorized access, only for admin", 401);
  }
};

export const verifyLecturer = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { user } = req;

  if (
    user !== null &&
    ((user as { role?: string })?.role === "admin" ||
      (user as { role?: string })?.role === "lecturer")
  ) {
    next();
  } else {
    throw new ErrorResponse(
      "unauthorized access, only for Lecturer and Admin",
      401,
    );
  }
};

// export const verifyStudent = (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   const { user } = req;

//   if (
//     user !== null &&
//     ((user as { role?: string })?.role === "student" ||
//       (user as { role?: string })?.role === "admin")
//   ) {
//     next();
//   } else {
//     throw new ErrorResponse("unauthorized access, only for student", 401);
//   }
// };
