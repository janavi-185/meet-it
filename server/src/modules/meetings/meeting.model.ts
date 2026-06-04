import { z } from "zod";

export const TranscriptItemSchema = z.object({
  timestamp: z.string(),
  speaker: z.string(),
  text: z.string(),
});
export type TranscriptItem = z.infer<typeof TranscriptItemSchema>;

export const MeetingSchema = z.object({
  id: z.string(),
  title: z.string(),
  participants: z.array(z.string()),
  meeting_date: z.date(),
  transcript: z.array(TranscriptItemSchema),
  created_by: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
});
export type Meeting = z.infer<typeof MeetingSchema>;

export const CreateMeetingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  participants: z.array(z.string()),
  meetingDate: z.string(),
  transcript: z.array(TranscriptItemSchema),
});
export type CreateMeetingInput = z.infer<typeof CreateMeetingSchema>;
