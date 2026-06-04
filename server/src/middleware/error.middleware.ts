import { Response, NextFunction } from "express";
import { env } from "../config/env.js";
import { TraceRequest } from "./trace.middleware.js";

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error & { statusCode?: number },
  req: TraceRequest,
  res: Response,
  _next: NextFunction,
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error(
    `[TraceID: ${req.traceId}] [Error] ${req.method} ${req.path}:`,
    err,
  );

  res.status(statusCode).json({
    success: false,
    message,
    traceId: req.traceId,
    stack: env.nodeEnv === "development" ? err.stack : undefined,
  });
};
