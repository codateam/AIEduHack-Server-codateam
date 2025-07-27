"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrollmentResponseFormatter = void 0;
class EnrollmentResponseFormatter {
    static success(res, data, statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            data,
        });
    }
    static error(res, message, statusCode = 400) {
        return res.status(statusCode).json({
            success: false,
            error: message,
        });
    }
}
exports.EnrollmentResponseFormatter = EnrollmentResponseFormatter;
