# AI Implementation Strategy

The Hintron Meeting Intelligence Service relies on a robust integration with Google Gemini 1.5 Flash to extract actionable insights from unstructured transcripts. Our strategy focuses on accuracy, grounding, and verifiable output.

## 1. Prompt Design Architecture
The system utilizes a **strictly constrained prompt template** located in `src/modules/analysis/gemini/prompts.ts`.
- **Role Definition**: Establishes the AI as a "Meeting Analysis Assistant".
- **Strict Negative Constraints**: Explicitly forbids inventing attendees, action items, or decisions not found in the text.
- **Structural Enforcement**: Mandates a specific JSON schema to ensure downstream compatibility with our database and frontend.

## 2. Citation & Grounding Strategy
To prevent hallucinations and build trust, we implement a **Mandatory Citation Policy**:
- **Requirement**: Every summary point, decision, and action item *must* include at least one citation referencing a specific transcript `timestamp`.
- **Extraction**: The AI identifies the exact moment in the conversation where an item was discussed.
- **Verification**: The `GeminiService` includes a `validateResponse` method that rejects any AI output that lacks citations. This ensures 100% of the insights are grounded in the actual meeting data.

## 3. Hallucination Prevention
We use a multi-layered approach to minimize AI errors:
- **System-Level Constraints**: Using Gemini's "System Instructions" to hard-code boundaries.
- **JSON Output Mode**: Leveraging Gemini's native `responseMimeType: "application/json"` to prevent "chatty" responses or malformed data.
- **Post-Extraction Validation**: A Zod-based validation layer in the backend checks the AI's logic (e.g., "Does an action item have both a task and an assignee?").

## 4. Output Validation Workflow
1. **AI Generation**: Gemini processes the transcript and returns a JSON object.
2. **Schema Check**: Validates that all required arrays (`summary`, `actionItems`, `decisions`, `followUps`) exist.
3. **Item Integrity**: Ensures every insight has a `text` field and a non-empty `citations` array.
4. **Action Item Logic**: Specific check to ensure every extracted task is attributed to a person mentioned in the meeting.

## 5. Known Limitations & Future Work
- **Context Length**: While Gemini 1.5 handles huge contexts, extremely long (8hr+) meetings might eventually require transcript chunking.
- **Speaker Nuance**: The AI's accuracy is directly correlated with the transcript quality. Poor speaker labeling in the input leads to misattributed tasks.
- **Future Integration**: Planning to implement audio-to-text directly using Gemini's multi-modal capabilities.
