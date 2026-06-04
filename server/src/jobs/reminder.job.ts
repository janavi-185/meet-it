import cron from "node-cron";
import { processOverdueReminders } from "./reminder.service.js";

export const startReminderJob = () => {
  console.log("Initializing reminder cron job...");

  // Schedule: Every hour (0 * * * *)
  cron.schedule("0 * * * *", async () => {
    try {
      await processOverdueReminders();
    } catch (error) {
      console.error("Error running reminder cron job:", error);
    }
  });

  console.log("Reminder cron job scheduled: Every hour");
};
