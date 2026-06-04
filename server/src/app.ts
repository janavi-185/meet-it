import express from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { meetingRoutes } from "./modules/meetings/meeting.routes.js";
import { analysisRoutes } from "./modules/analysis/analysis.routes.js";
import { actionItemRoutes } from "./modules/action-items/actionItem.routes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/meetings", analysisRoutes);
app.use("/api/action-items", actionItemRoutes);

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

export default app;
