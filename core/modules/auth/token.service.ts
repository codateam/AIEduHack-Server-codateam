import { Request } from "express";
import { config } from "../../../config";
import * as jwt from "jsonwebtoken";
import { IUser } from "../../../types/user.interface";

// import { PayloadType } from "./auth.type";

const secret: string | undefined = config.jwt.secret;

export const generateToken = (payload: any): string | never | undefined => {
  console.log("payload", payload);
  // const expiresIn = config.jwt.maxAge;
  try {
    if (typeof secret === "string") {
      const token = jwt.sign({ data: payload }, secret, {
        expiresIn: "365d",
      });
      return token;
    }
  } catch (error: any) {
    throw new Error("Unauthenticated");
  }
};

export const verifyToken = (token: any): { data: any | jwt.JwtPayload } => {
  try {
    if (typeof secret !== "string") {
      throw new Error("Server error");
    }

    const tokenVerified = jwt.verify(token, secret) as {
      data: string | jwt.JwtPayload;
    };

    return tokenVerified;
  } catch (error) {
    throw new Error("Unauthenticated");
  }
};

export const getTokenFromHeader = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  return null;
};
