import { type NextFunction, type Request, type Response } from "express";
import { verifyToken } from "../../modules/auth/token.service";

export const isAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const token = req?.get("Authorization")?.split(" ")[1];
  const isAuthenticatedUser = verifyToken(token);

  if (isAuthenticatedUser != null) {
    next();
  } else {
    throw new Error("Unauthorized user");
  }
};
