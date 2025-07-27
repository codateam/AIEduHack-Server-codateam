import { Response } from "express";

export const response = (
  res: Response,
  message: string,
  status: number,
  data: any
) => {
  res.status(status).json({
    message,
    // token: token,
    data,
  });
};
