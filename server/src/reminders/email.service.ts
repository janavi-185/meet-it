import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: env.smtp.port === 465,
  auth: {
    user: env.smtp.user,
    pass: env.smtp.pass,
  },
});

export const sendReminderEmail = async (
  to: string,
  subject: string,
  message: string,
): Promise<boolean> => {
  try {
    await transporter.sendMail({
      from: env.smtp.from,
      to,
      subject,
      text: message,
    });
    return true;
  } catch (error) {
    console.error("Failed to send email reminder:", error);
    return false;
  }
};
