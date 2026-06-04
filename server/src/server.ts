import app from "./app.js";
import { env } from "./config/env.js";
import { testConnection } from "./config/db.js";
import { startReminderJob } from "./jobs/reminder.job.js";

const startServer = async () => {
  try {
    // Test DB connection before starting server
    await testConnection();

    // Start reminder cron job
    startReminderJob();

    app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
