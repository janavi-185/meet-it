import { TranscriptItem } from "../../meetings/meeting.model.js";

export const buildAnalysisPrompt = (transcript: TranscriptItem[]): string => {
  const transcriptText = transcript
    .map((item) => `[${item.timestamp}] ${item.speaker}: ${item.text}`)
    .join("\n");

  return `
You are a meeting analysis assistant.

Analyze ONLY the provided transcript.

Do NOT invent attendees.
Do NOT invent action items.
Do NOT invent decisions.
Do NOT invent meeting outcomes.
Do NOT add information that is not explicitly present in the transcript.

Every generated insight must include at least one citation.
Citations must reference transcript timestamps.

Return JSON only in the following format:
{
  "summary": [
    {
      "text": "Insight text",
      "citations": [{ "timestamp": "00:00" }]
    }
  ],
  "actionItems": [
    {
      "task": "Task description",
      "assignee": "Name",
      "citations": [{ "timestamp": "00:00" }]
    }
  ],
  "decisions": [
    {
      "text": "Decision text",
      "citations": [{ "timestamp": "00:00" }]
    }
  ],
  "followUps": [
    {
      "text": "Follow-up text",
      "citations": [{ "timestamp": "00:00" }]
    }
  ]
}

TRANSCRIPT:
${transcriptText}
  `.trim();
};
