import { type NextFunction, type Request, type Response } from "express";
import { validationResult } from "express-validator";

export const validate = (validations: any[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      next();
      return;
    }

    res.status(400).json({ errors: errors.array() });
  };
};

// create expressjs validation middleware

// // Example usage
// app.post(
//   "/users",
//   validate([
//     body("name").notEmpty().isString(),
//     body("email").notEmpty().isEmail(),
//   ]),
//   async (req, res) => {
//     // Route handler logic goes here
//   }
// );
