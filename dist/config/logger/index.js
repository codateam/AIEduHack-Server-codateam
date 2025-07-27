"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.morganMiddleware = exports.logger = void 0;
const morgan_1 = __importDefault(require("morgan"));
const winston_1 = __importDefault(require("winston"));
const { combine, timestamp, align, printf } = winston_1.default.format;
const formater = {
    format: combine(timestamp({
        format: "YYYY-MM-DD hh:mm:ss.SSS A",
    }), align(), printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)),
};
exports.logger = winston_1.default.createLogger({
    level: "info",
    transports: [
        new winston_1.default.transports.File({
            filename: "info.log",
            format: formater.format,
        }),
    ],
    exceptionHandlers: [
        new winston_1.default.transports.File({
            filename: "exception.log",
            format: formater.format,
        }),
    ],
    rejectionHandlers: [
        new winston_1.default.transports.File({
            filename: "rejections.log",
            format: formater.format,
        }),
    ],
});
exports.morganMiddleware = (0, morgan_1.default)(function (tokens, req, res) {
    return JSON.stringify({
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        status: Number.parseFloat(tokens.status(req, res)),
        content_length: tokens.res(req, res, "content-length"),
        response_time: Number.parseFloat(tokens["response-time"](req, res)),
    });
}, {
    stream: {
        // Configure Morgan to use our custom logger with the http severity
        write: (message) => {
            const data = JSON.parse(message);
            exports.logger.info(`incoming-request`, data);
        },
    },
});
