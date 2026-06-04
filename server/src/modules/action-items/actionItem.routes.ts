import { Router } from "express";
import { ActionItemController } from "./actionItem.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = Router();
const actionItemController = new ActionItemController();

router.post("/", authMiddleware, actionItemController.createActionItem);
router.get("/", authMiddleware, actionItemController.getActionItems);
router.get("/overdue", authMiddleware, actionItemController.getOverdueItems);
router.patch("/:id/status", authMiddleware, actionItemController.updateStatus);

export const actionItemRoutes = router;
