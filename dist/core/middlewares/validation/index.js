"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_validator_1 = require("express-validator");
const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map((validation) => validation.run(req)));
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.isEmpty()) {
            next();
            return;
        }
        res.status(400).json({ errors: errors.array() });
    };
};
exports.validate = validate;
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
