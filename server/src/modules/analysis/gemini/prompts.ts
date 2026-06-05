import { TranscriptItem } from "../../meetings/meeting.model.js";

export const buildAnalysisPrompt = (transcript: TranscriptItem[]): string => {
  const transcriptText = transcript
    .map((item) => `[${item.timestamp}] ${item.speaker}: ${item.text}`)
    .join("\n");

  return `
You are an expert meeting analysis assistant.

Your task is to analyze ONLY the transcript provided below.

STRICT RULES:

1. Use ONLY information explicitly present in the transcript.
2. Do NOT invent attendees.
3. Do NOT invent action items.
4. Do NOT invent decisions.
5. Do NOT invent follow-ups.
6. Do NOT infer information that is not clearly stated.
7. Every insight MUST contain at least one timestamp citation.
8. Citations MUST come directly from transcript timestamps.
9. If no information exists for a section, return an empty array.
10. Return ONLY valid JSON.

IMPORTANT:

- Do NOT return markdown.
- Do NOT use \`\`\`json.
- Do NOT use code fences.
- Do NOT include explanations.
- Do NOT include notes.
- Do NOT include any text before or after the JSON.
- Response must be valid JSON parsable by JSON.parse().

Expected JSON schema:

{
  "summary": [
    {
      "text": "string",
      "citations": [
        {
          "timestamp": "00:00"
        }
      ]
    }
  ],
  "actionItems": [
    {
      "task": "string",
      "assignee": "string",
      "citations": [
        {
          "timestamp": "00:00"
        }
      ]
    }
  ],
  "decisions": [
    {
      "text": "string",
      "citations": [
        {
          "timestamp": "00:00"
        }
      ]
    }
  ],
  "followUps": [
    {
      "text": "string",
      "citations": [
        {
          "timestamp": "00:00"
        }
      ]
    }
  ]
}

Transcript:

${transcriptText}

Return ONLY the JSON response.
`.trim();
};
