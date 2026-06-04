import { z } from "zod";

export const ActionItemStatusSchema = z.enum([
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
]);
export type ActionItemStatus = z.infer<typeof ActionItemStatusSchema>;

export const ActionItemSchema = z.object({
  id: z.string(),
  meeting_id: z.string(),
  task: z.string(),
  assignee: z.string().nullable(),
  due_date: z.date().nullable(),
  status: ActionItemStatusSchema,
  citation: z.unknown(),
  created_at: z.date(),
  updated_at: z.date(),
});
export type ActionItem = z.infer<typeof ActionItemSchema>;

export const CreateActionItemSchema = z.object({
  meetingId: z.string(),
  task: z.string().min(1, "Task description is required"),
  assignee: z.string().optional(),
  dueDate: z.string().optional(), // ISO string
  citation: z.unknown().optional(),
});
export type CreateActionItemInput = z.infer<typeof CreateActionItemSchema>;

export const UpdateActionItemStatusSchema = z.object({
  status: ActionItemStatusSchema,
});
export type UpdateActionItemStatusInput = z.infer<
  typeof UpdateActionItemStatusSchema
>;

export const ActionItemFiltersSchema = z.object({
  status: ActionItemStatusSchema.optional(),
  assignee: z.string().optional(),
  meetingId: z.string().optional(),
});
export type ActionItemFilters = z.infer<typeof ActionItemFiltersSchema>;
