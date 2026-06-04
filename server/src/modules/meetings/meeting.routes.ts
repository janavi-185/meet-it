import { Router } from "express";
import { MeetingController } from "./meeting.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = Router();
const meetingController = new MeetingController();

router.post("/", authMiddleware, meetingController.createMeeting);

router.get("/", authMiddleware, meetingController.getMeetings);
router.get("/:id", authMiddleware, meetingController.getMeetingById);

export const meetingRoutes = router;
