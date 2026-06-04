import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    candidateName: "Janavi Chauhan",
    email: "chauhanjanavi06@gmail.com",
    repositoryUrl: "https://github.com/janavi-185/meet-it",
    deployedUrl: "https://meet-it.onrender.com",
    externalIntegration: "Gemini AI, Discord Webhook, Nodemailer",
    features: [
      "Authentication (JWT with Logout)",
      "AI Meeting Analysis (Gemini)",
      "Action Item Management",
      "Automated Overdue Reminders (Cron)",
      "Discord & Email Notifications",
      "Swagger API Documentation",
    ],
  });
});

export const evaluationRoutes = router;
