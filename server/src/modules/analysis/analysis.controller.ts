import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware.js";
import { AnalysisService } from "./analysis.service.js";

const analysisService = AnalysisService.getInstance();

export class AnalysisController {
  async analyzeMeeting(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const analysis = await analysisService.analyzeMeeting(id as string);

      res.status(200).json({
        success: true,
        message: "Meeting analyzed successfully",
        data: analysis,
      });
    } catch (error: unknown) {
      console.error("Analysis Controller Error:", error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Analysis failed",
      });
    }
  }

  async getAnalysis(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const analysis = await analysisService.getAnalysisByMeetingId(
        id as string,
      );

      if (!analysis) {
        return res.status(404).json({
          success: false,
          message: "Analysis not found for this meeting",
        });
      }

      res.status(200).json({
        success: true,
        data: analysis,
      });
    } catch (error: unknown) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch analysis",
      });
    }
  }
}
