import { z } from "zod";

/**
 * SQL Schema for reminder_history:
 *
 * CREATE TABLE reminder_history (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
 *   channel VARCHAR(50) NOT NULL,
 *   recipient VARCHAR(255),
 *   message TEXT NOT NULL,
 *   sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   status VARCHAR(30) DEFAULT 'SENT'
 * );
 */

export const ReminderChannelSchema = z.enum(["EMAIL", "DISCORD"]);
export type ReminderChannel = z.infer<typeof ReminderChannelSchema>;

export const ReminderStatusSchema = z.enum(["SENT", "FAILED"]);
export type ReminderStatus = z.infer<typeof ReminderStatusSchema>;

export const ReminderHistorySchema = z.object({
  id: z.string().uuid(),
  meeting_id: z.string().uuid(),
  channel: ReminderChannelSchema,
  recipient: z.string().nullable(),
  message: z.string(),
  sent_at: z.date(),
  status: ReminderStatusSchema,
});
export type ReminderHistory = z.infer<typeof ReminderHistorySchema>;

export const CreateReminderHistorySchema = z.object({
  meetingId: z.string().uuid(),
  channel: ReminderChannelSchema,
  recipient: z.string().optional(),
  message: z.string(),
  status: ReminderStatusSchema.default("SENT"),
});
export type CreateReminderHistoryInput = z.infer<
  typeof CreateReminderHistorySchema
>;
