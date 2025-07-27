"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.response = void 0;
const response = (res, message, status, data) => {
    res.status(status).json({
        message,
        // token: token,
        data,
    });
};
exports.response = response;
