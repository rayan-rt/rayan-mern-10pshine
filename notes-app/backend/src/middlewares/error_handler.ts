import { type NextFunction, type Request, type Response } from "express";
import { logger } from "../configs/logger.js";
// --

export const errorMiddleware = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const errors = err.errors || [];

  if (statusCode >= 500) {
    logger.error(err);
  } else {
    logger.warn(message);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    ...(process.env["NODE_ENV"] === "development" && { stack: err.stack }),
  });
};
