"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyLecturer = exports.verifyAdmin = exports.verifyUser = void 0;
const error_response_1 = __importDefault(require("../error-response"));
const token_service_1 = require("../../core/modules/auth/token.service");
const verifyUser = (req, res, next) => {
    const token = (0, token_service_1.getTokenFromHeader)(req);
    const user = (0, token_service_1.verifyToken)(token);
    console.log("User verified:", req.user);
    if (user !== null) {
        req.user = (user === null || user === void 0 ? void 0 : user.data) ? user.data : user;
        next();
    }
    else {
        throw new error_response_1.default("unauthenticated", 401);
    }
};
exports.verifyUser = verifyUser;
const verifyAdmin = (req, res, next) => {
    const { user } = req;
    console.log({ admin: user });
    if (user !== null && (user === null || user === void 0 ? void 0 : user.role) === "admin") {
        next();
    }
    else {
        throw new error_response_1.default("unauthorized access, only for admin", 401);
    }
};
exports.verifyAdmin = verifyAdmin;
const verifyLecturer = (req, res, next) => {
    const { user } = req;
    if (user !== null &&
        ((user === null || user === void 0 ? void 0 : user.role) === "admin" ||
            (user === null || user === void 0 ? void 0 : user.role) === "lecturer")) {
        next();
    }
    else {
        throw new error_response_1.default("unauthorized access, only for Lecturer and Admin", 401);
    }
};
exports.verifyLecturer = verifyLecturer;
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
