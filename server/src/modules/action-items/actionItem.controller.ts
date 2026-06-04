import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware.js";
import { ActionItemService } from "./actionItem.service.js";
import { ActionItemStatus } from "./actionItem.model.js";

const actionItemService = ActionItemService.getInstance();

export class ActionItemController {
  async createActionItem(req: AuthRequest, res: Response) {
    try {
      const actionItem = await actionItemService.createActionItem(req.body);
      res.status(201).json({
        success: true,
        message: "Action item created successfully",
        data: actionItem,
      });
    } catch (error: unknown) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create action item",
      });
    }
  }

  async getActionItems(req: AuthRequest, res: Response) {
    try {
      const filters = {
        status: req.query.status as ActionItemStatus,
        assignee: req.query.assignee as string,
        meetingId: req.query.meetingId as string,
      };

      const actionItems = await actionItemService.getActionItems(filters);
      res.status(200).json({
        success: true,
        data: actionItems,
      });
    } catch (error: unknown) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch action items",
      });
    }
  }

  async updateStatus(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!["PENDING", "IN_PROGRESS", "COMPLETED"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status value",
        });
      }

      const updatedItem = await actionItemService.updateStatus(
        id as string,
        status as ActionItemStatus,
      );

      if (!updatedItem) {
        return res.status(404).json({
          success: false,
          message: "Action item not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Status updated successfully",
        data: updatedItem,
      });
    } catch (error: unknown) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to update status",
      });
    }
  }

  async getOverdueItems(req: AuthRequest, res: Response) {
    try {
      const overdueItems = await actionItemService.getOverdueItems();
      res.status(200).json({
        success: true,
        data: overdueItems,
      });
    } catch (error: unknown) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch overdue items",
      });
    }
  }
}
