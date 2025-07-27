/* eslint-disable n/no-deprecated-api */
import { type NextFunction, type Request, type Response } from "express";
import url from "url";

export const storeRedirectToInSession = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const urlParts: any = url.parse(req.get("referer")!);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const redirectTo = urlParts.pathname;
  // req.session.redirectTo = redirectTo;
  next();
};
