import express from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { meetingRoutes } from "./modules/meetings/meeting.routes.js";
import { analysisRoutes } from "./modules/analysis/analysis.routes.js";
import { actionItemRoutes } from "./modules/action-items/actionItem.routes.js";
import { evaluationRoutes } from "./modules/evaluation/evaluation.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { traceMiddleware } from "./middleware/trace.middleware.js";
import { globalLimiter, authLimiter, aiLimiter } from "./config/ratelimiter.js";

const app = express();

// Middlewares
app.use(traceMiddleware);
app.use(globalLimiter);
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/meetings/:id/analyze", aiLimiter);
app.use("/api/meetings", analysisRoutes);
app.use("/api/action-items", actionItemRoutes);
app.use("/api/evaluation", evaluationRoutes);

app.get("/", (req, res) => {
  res.send(
    "This backedend server for meeting management system is running successfully.",
  );
});

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global Error Handler
app.use(errorHandler);

export default app;
