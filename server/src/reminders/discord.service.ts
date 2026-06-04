import axios from "axios";
import { env } from "../config/env.js";

export const sendDiscordReminder = async (
  message: string,
): Promise<boolean> => {
  try {
    if (!env.discordWebhookUrl) {
      console.warn("Discord Webhook URL not configured");
      return false;
    }

    await axios.post(env.discordWebhookUrl, {
      content: message,
    });
    return true;
  } catch (error) {
    console.error("Failed to send Discord notification:", error);
    return false;
  }
};
