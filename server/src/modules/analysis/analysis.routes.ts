import { Router } from "express";
import { AnalysisController } from "./analysis.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = Router();
const analysisController = new AnalysisController();

// Registered at /api/meetings in app.ts
router.post("/:id/analyze", authMiddleware, analysisController.analyzeMeeting);
router.get("/:id/analysis", authMiddleware, analysisController.getAnalysis);

export const analysisRoutes = router;
