import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          errors: error.issues.map((err) => {
            return {
              path: err.path[1] || err.path[0],
              message: err.message,
            };
          }),
        });
        return;
      }
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
      return;
    }
  };
};
