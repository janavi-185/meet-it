import { query } from "../config/db.js";
import { ActionItemService } from "../modules/action-items/actionItem.service.js";
import { MeetingService } from "../modules/meetings/meeting.service.js";
import { sendReminderEmail } from "../reminders/email.service.js";
import { sendDiscordReminder } from "../reminders/discord.service.js";
import {
  CreateReminderHistoryInput,
  ReminderHistory,
} from "./reminder.model.js";

const actionItemService = ActionItemService.getInstance();
const meetingService = MeetingService.getInstance();

const buildReminderMessage = (payload: {
  task: string;
  assignee: string;
  dueDate: Date | null;
  status: string;
  meetingTitle: string;
}): string => {
  return [
    "*Overdue Action Item Reminder*",
    "",
    `*Task:* ${payload.task}`,
    `*Assigned To:* ${payload.assignee}`,
    `*Due Date:* ${payload.dueDate ? new Date(payload.dueDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "N/A"}`,
    `*Status:* ${payload.status}`,
    `*Meeting:* ${payload.meetingTitle}`,
    "",
    "Please update the status or take action on this item.",
  ].join("\n");
};

const saveHistory = async (
  input: CreateReminderHistoryInput,
): Promise<ReminderHistory> => {
  const { meetingId, channel, recipient, message, status } = input;

  const sql = `
    INSERT INTO reminder_history (meeting_id, channel, recipient, message, status)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;

  const result = await query(sql, [
    meetingId,
    channel,
    recipient || null,
    message,
    status,
  ]);

  return result.rows[0];
};

export const processOverdueReminders = async () => {
  console.log(
    `[${new Date().toISOString()}] Starting overdue reminders process...`,
  );

  try {
    const overdueItems = await actionItemService.getOverdueItems();

    if (overdueItems.length === 0) {
      console.log("No overdue action items found.");
      return;
    }

    console.log(`Found ${overdueItems.length} overdue items.`);

    for (const item of overdueItems) {
      // Fetch meeting to get the title
      const meeting = await meetingService.getMeetingById(item.meeting_id);
      const meetingTitle = meeting ? meeting.title : "Unknown Meeting";

      const message = buildReminderMessage({
        task: item.task,
        assignee: item.assignee || "Unassigned",
        dueDate: item.due_date,
        status: "OVERDUE",
        meetingTitle: meetingTitle,
      });

      // Send Email if assignee exists (assumed to be a valid email)
      if (item.assignee && item.assignee.trim() !== "") {
        try {
          const emailSent = await sendReminderEmail(
            item.assignee,
            "Overdue Action Item Reminder",
            message,
          );
          await saveHistory({
            meetingId: item.meeting_id,
            channel: "EMAIL",
            recipient: item.assignee,
            message,
            status: emailSent ? "SENT" : "FAILED",
          });
        } catch (emailError) {
          console.error(
            `Failed to send email to ${item.assignee}:`,
            emailError,
          );
          await saveHistory({
            meetingId: item.meeting_id,
            channel: "EMAIL",
            recipient: item.assignee,
            message,
            status: "FAILED",
          });
        }
      } else {
        console.warn(
          `Skipping email for action item ${item.id}: No assignee email found.`,
        );
      }

      // Send Discord
      try {
        const discordSent = await sendDiscordReminder(message);
        await saveHistory({
          meetingId: item.meeting_id,
          channel: "DISCORD",
          recipient: "Discord Webhook",
          message,
          status: discordSent ? "SENT" : "FAILED",
        });
      } catch (discordError) {
        console.error("Failed to send Discord reminder:", discordError);
        await saveHistory({
          meetingId: item.meeting_id,
          channel: "DISCORD",
          recipient: "Discord Webhook",
          message,
          status: "FAILED",
        });
      }
    }
  } catch (error) {
    console.error("Critical error in reminder processing:", error);
  }
};
