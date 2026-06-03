import { Request, Response } from "express";
import { AuthService } from "./auth.service.js";

const authService = AuthService.getInstance();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      await authService.register(req.body);
      res.status(201).json({
        success: true,
        message: "User registered successfully",
      });
    } catch (error: unknown) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Registration failed",
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const token = await authService.login(email, password);
      res.status(200).json({
        success: true,
        token,
      });
    } catch (error: unknown) {
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : "Login failed",
      });
    }
  }
}
