import type { Request, Response } from "express";
import morgan from "morgan";
import winston from "winston";

const { combine, timestamp, align, printf } = winston.format;

const formater = {
  format: combine(
    timestamp({
      format: "YYYY-MM-DD hh:mm:ss.SSS A",
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
  ),
};

export const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.File({
      filename: "info.log",
      format: formater.format,
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: "exception.log",
      format: formater.format,
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: "rejections.log",
      format: formater.format,
    }),
  ],
});

export const morganMiddleware = morgan(
  function (tokens: any, req: Request, res: Response) {
    return JSON.stringify({
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: Number.parseFloat(tokens.status(req, res)),
      content_length: tokens.res(req, res, "content-length"),
      response_time: Number.parseFloat(tokens["response-time"](req, res)),
    });
  },
  {
    stream: {
      // Configure Morgan to use our custom logger with the http severity
      write: (message) => {
        const data = JSON.parse(message);
        logger.info(`incoming-request`, data);
      },
    },
  },
);
