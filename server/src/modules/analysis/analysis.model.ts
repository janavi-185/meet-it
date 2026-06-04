import { z } from "zod";

export const CitationSchema = z.object({
  timestamp: z.string(),
});
export type Citation = z.infer<typeof CitationSchema>;

export const SummaryItemSchema = z.object({
  text: z.string(),
  citations: z.array(CitationSchema),
});
export type SummaryItem = z.infer<typeof SummaryItemSchema>;

export const ActionItemAnalysisSchema = z.object({
  task: z.string(),
  assignee: z.string(),
  citations: z.array(CitationSchema),
});
export type ActionItem = z.infer<typeof ActionItemAnalysisSchema>;

export const DecisionItemSchema = z.object({
  text: z.string(),
  citations: z.array(CitationSchema),
});
export type DecisionItem = z.infer<typeof DecisionItemSchema>;

export const FollowUpItemSchema = z.object({
  text: z.string(),
  citations: z.array(CitationSchema),
});
export type FollowUpItem = z.infer<typeof FollowUpItemSchema>;

export const AnalysisResponseSchema = z.object({
  summary: z.array(SummaryItemSchema),
  actionItems: z.array(ActionItemAnalysisSchema),
  decisions: z.array(DecisionItemSchema),
  followUps: z.array(FollowUpItemSchema),
});
export type AnalysisResponse = z.infer<typeof AnalysisResponseSchema>;

export const MeetingAnalysisSchema = z.object({
  id: z.string(),
  meeting_id: z.string(),
  summary: z.array(SummaryItemSchema),
  action_items: z.array(ActionItemAnalysisSchema),
  decisions: z.array(DecisionItemSchema),
  follow_ups: z.array(FollowUpItemSchema),
  generated_at: z.date(),
});
export type MeetingAnalysis = z.infer<typeof MeetingAnalysisSchema>;
