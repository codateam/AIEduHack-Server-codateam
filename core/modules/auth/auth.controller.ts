import { createUser, createSuperAdmin, getUsersByRole, getUsersByOrganization } from "./auth.service";
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
    userData.role = "student";
    const data = await createUser(userData);
    const token = generateToken(data);
    response(res, "Student Signup Successfully", 201, { data, token });
  } catch (error: any) {
    res.status(402).json({ message: error.message });
  }
};

export const createOrgAdmin = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    userData.password = userData.password || "orgadmin123";
    userData.role = "admin";
    const data = await createUser(userData);

    response(res, "Organization Admin Added Successfully", 201, data);
  } catch (error: any) {
    res.status(402).json({ message: error.message });
  }
};

export const createLecturer = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    userData.password = userData.password || "lecturer";
    userData.role = "lecturer";
    const data = await createUser(userData);
    response(res, "Lecturer Added Successfully", 201, data);
  } catch (error: any) {
    res.status(402).json({ message: error.message });
  }
};

export const createSuperAdminEndpoint = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    
    // Validate required fields
    if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
      return res.status(400).json({ 
        message: "Email, password, firstName, and lastName are required" 
      });
    }

    const data = await createSuperAdmin(userData);
    response(res, "Super Admin Created Successfully", 201, data);
  } catch (error: any) {
    res.status(402).json({ message: error.message });
  }
};

// Organization-scoped user retrieval functions
export const getLecturers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page, limit, search, organizationId } = req.query as {
      page: string;
      limit: string;
      search?: string;
      organizationId?: string;
    };
    
    // If user is admin, filter by their organization
    const user = (req as any).user;
    const orgId = user?.role === 'admin' ? user.organizationId : organizationId;
    
    const users = await getUsersByRole(
      "lecturer",
      parseInt(page, 10),
      parseInt(limit, 10),
      search,
      orgId,
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
    const { page, limit, search, organizationId } = req.query as {
      page: string;
      limit: string;
      search?: string;
      organizationId?: string;
    };
    
    // If user is admin or lecturer, filter by their organization
    const user = (req as any).user;
    const orgId = (user?.role === 'admin' || user?.role === 'lecturer') ? user.organizationId : organizationId;
    
    const users = await getUsersByRole(
      "student",
      parseInt(page, 10),
      parseInt(limit, 10),
      search,
      orgId,
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
    const { page, limit, organizationId } = req.query as { 
      page: string; 
      limit: string;
      organizationId?: string;
    };
    
    const users = await getUsersByRole(
      "admin",
      parseInt(page, 10),
      parseInt(limit, 10),
      "",
      organizationId,
    );
    response(res, "Admins Retrieved Successfully", 200, users);
  } catch (error: any) {
    res.status(402).json({ message: error.message });
  }
};

export const getOrgAdmins = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page, limit, organizationId } = req.query as { 
      page: string; 
      limit: string;
      organizationId?: string;
    };
    
    const users = await getUsersByRole(
      "admin",
      parseInt(page, 10),
      parseInt(limit, 10),
      "",
      organizationId,
    );
    response(res, "Organization Admins Retrieved Successfully", 200, users);
  } catch (error: any) {
    res.status(402).json({ message: error.message });
  }
};

export const getUsersByOrg = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { organizationId } = req.params;
    const { page, limit, search, role } = req.query as {
      page: string;
      limit: string;
      search?: string;
      role?: string;
    };
    
    const users = await getUsersByOrganization(
      organizationId,
      parseInt(page, 10),
      parseInt(limit, 10),
      search,
      role,
    );
    response(res, "Organization Users Retrieved Successfully", 200, users);
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
