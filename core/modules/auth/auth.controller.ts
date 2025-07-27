import { createUser, getUsersByRole } from "./auth.service";
import passport from "passport";
import { generateToken } from "./token.service";
import { type NextFunction, type Request, type Response } from "express";
import { type PayloadType } from "./auth.type";
import { response } from "../../../utils/response-formater";
import { asyncHandler } from "../../../utils/async-handler";
export const registerStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userData = req.body;
    const data = await createUser(userData);
    const token = generateToken(data);
    response(res, "Student Signup Successfully", 201, { data, token });
  } catch (error: any) {
    res.status(402).json({ message: error.message });
  }
};

export const createAdmin = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    userData.password = "admin";
    userData.role = "admin";
    const data = await createUser(userData);

    response(res, "Admin Added Successfully", 201, data);
  } catch (error: any) {
    res.status(402).json({ message: error.message });
  }
};

export const createLecturer = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    userData.password = "lecturer";
    userData.role = "lecturer";
    const data = await createUser(userData);
    response(res, "Lecturer Added Successfully", 201, data);
  } catch (error: any) {
    res.status(402).json({ message: error.message });
  }
};

// create 3 function for lecturer, admin and student
export const getLecturers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page, limit, search } = req.query as {
      page: string;
      limit: string;
      search?: string;
    };
    const users = await getUsersByRole(
      "lecturer",
      parseInt(page, 10),
      parseInt(limit, 10),
      search,
    );
    response(res, "Lecturers Retrieved Successfully", 200, users);
  } catch (error: any) {
    res.status(402).json({ message: error.message });
  }
};

export const getStudents = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page, limit, search } = req.query as {
      page: string;
      limit: string;
      search?: string;
    };
    const users = await getUsersByRole(
      "student",
      parseInt(page, 10),
      parseInt(limit, 10),
      search,
    );
    response(res, "Students Retrieved Successfully", 200, users);
  } catch (error: any) {
    res.status(402).json({ message: error.message });
  }
};

export const getAdmins = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page, limit } = req.query as { page: string; limit: string };
    const users = await getUsersByRole(
      "admin",
      parseInt(page, 10),
      parseInt(limit, 10),
    );
    response(res, "Admins Retrieved Successfully", 200, users);
  } catch (error: any) {
    res.status(402).json({ message: error.message });
  }
};

export const loginWithEmailAndPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  passport.authenticate(
    "local",
    { session: false },
    (error: { message: any }, user: any, info: { message: any }) => {
      if (error) {
        return res.status(500).json({ message: error.message });
      }
      if (!user) {
        return res.status(500).json({ message: info.message });
      }

      const payload: any = {
        ...user._doc,
        id: user._doc._id,
      };
      const token = generateToken(payload);
      response(res, "successfully signed in", 200, { user, token });
    },
  )(req, res, next);
};
