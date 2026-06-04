import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

export interface TraceRequest extends Request {
  traceId?: string;
}

export const traceMiddleware = (
  req: TraceRequest,
  res: Response,
  next: NextFunction,
) => {
  const traceId = (req.headers["x-trace-id"] as string) || uuidv4();
  req.traceId = traceId;
  res.setHeader("x-trace-id", traceId);
  next();
};
