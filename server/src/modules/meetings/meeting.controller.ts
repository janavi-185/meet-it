import { Response } from "express";
import { AuthRequest, UserPayload } from "../../middleware/auth.middleware.js";
import { MeetingService } from "./meeting.service.js";

const meetingService = MeetingService.getInstance();

export class MeetingController {
  async createMeeting(req: AuthRequest, res: Response) {
    try {
      const user = req.user as UserPayload;
      const userId = user.id;
      const meeting = await meetingService.createMeeting(req.body, userId);
      res.status(201).json({
        success: true,
        message: "Meeting created successfully",
        data: meeting,
      });
    } catch (error: unknown) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to create meeting",
      });
    }
  }

  async getMeetingById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const meeting = await meetingService.getMeetingById(id as string);

      if (!meeting) {
        return res.status(404).json({
          success: false,
          message: "Meeting not found",
        });
      }

      res.status(200).json({
        success: true,
        data: meeting,
      });
    } catch (error: unknown) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch meeting",
      });
    }
  }

  async getMeetings(req: AuthRequest, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await meetingService.getMeetings(page, limit);

      res.status(200).json({
        success: true,
        data: {
          meetings: result.meetings,
          pagination: {
            page,
            limit,
            total: result.total,
            totalPages: result.totalPages,
          },
        },
      });
    } catch (error: unknown) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch meetings",
      });
    }
  }
}
