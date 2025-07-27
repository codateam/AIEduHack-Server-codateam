"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../../../config/logger");
const error_response_1 = __importDefault(require("../../../utils/error-response"));
const errorHandler = (err, req, res, next) => {
    var _a, _b;
    let error = Object.assign({}, err);
    error.message = err.message;
    // Log to console for dev
    console.log(err);
    // Mongoose bad ObjectId
    if (err.name === "CastError") {
        const message = `Resource not found`;
        error = new error_response_1.default(message, 404);
    }
    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = "Duplicate field value entered";
        error = new error_response_1.default(message, 400);
    }
    // Mongoose validation error
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map((val) => val.message);
        error = new error_response_1.default(message, 400);
    }
    logger_1.logger.error(error.message);
    const errorStatus = (_a = error.statusCode) !== null && _a !== void 0 ? _a : 500;
    res.status(errorStatus).json({
        success: false,
        error: (_b = error.message) !== null && _b !== void 0 ? _b : "Server Error",
    });
};
exports.default = errorHandler;
