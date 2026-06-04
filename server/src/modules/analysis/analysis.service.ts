import { query } from "../../config/db.js";
import { MeetingService } from "../meetings/meeting.service.js";
import { GeminiService } from "./gemini/gemini.service.js";
import { buildAnalysisPrompt } from "./gemini/prompts.js";
import { AnalysisResponse, MeetingAnalysis } from "./analysis.model.js";

const meetingService = MeetingService.getInstance();
const geminiService = new GeminiService();

export class AnalysisService {
  private static instance: AnalysisService;

  public static getInstance(): AnalysisService {
    if (!AnalysisService.instance) {
      AnalysisService.instance = new AnalysisService();
    }
    return AnalysisService.instance;
  }

  async analyzeMeeting(meetingId: string): Promise<MeetingAnalysis> {
    // 1. Fetch meeting from database
    const meeting = await meetingService.getMeetingById(meetingId);
    if (!meeting) {
      throw new Error("Meeting not found");
    }

    // 2. Get transcript
    const transcript = meeting.transcript;
    if (!transcript || transcript.length === 0) {
      throw new Error("Meeting has no transcript to analyze");
    }

    // 3. Send transcript to Gemini & 4. Receive structured JSON response
    const prompt = buildAnalysisPrompt(transcript);
    const analysisData = await geminiService.generateAnalysis(prompt);

    // 5. Save analysis to meeting_analysis table
    const analysis = await this.saveAnalysis(meetingId, analysisData);

    return analysis;
  }

  private async saveAnalysis(
    meetingId: string,
    data: AnalysisResponse,
  ): Promise<MeetingAnalysis> {
    const sql = `
      INSERT INTO meeting_analysis (meeting_id, summary, action_items, decisions, follow_ups)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (meeting_id) DO UPDATE SET
        summary = EXCLUDED.summary,
        action_items = EXCLUDED.action_items,
        decisions = EXCLUDED.decisions,
        follow_ups = EXCLUDED.follow_ups,
        generated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;

    const result = await query(sql, [
      meetingId,
      JSON.stringify(data.summary),
      JSON.stringify(data.actionItems),
      JSON.stringify(data.decisions),
      JSON.stringify(data.followUps),
    ]);

    return result.rows[0];
  }

  async getAnalysisByMeetingId(
    meetingId: string,
  ): Promise<MeetingAnalysis | null> {
    const sql = "SELECT * FROM meeting_analysis WHERE meeting_id = $1";
    const result = await query(sql, [meetingId]);
    return result.rows[0] || null;
  }
}
