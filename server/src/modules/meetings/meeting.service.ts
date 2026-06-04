import { query } from "../../config/db.js";
import { CreateMeetingInput, Meeting } from "./meeting.model.js";

export class MeetingService {
  private static instance: MeetingService;

  public static getInstance(): MeetingService {
    if (!MeetingService.instance) {
      MeetingService.instance = new MeetingService();
    }
    return MeetingService.instance;
  }

  async createMeeting(
    input: CreateMeetingInput,
    userId: string,
  ): Promise<Meeting> {
    const { title, participants, meetingDate, transcript } = input;

    const sql = `
      INSERT INTO meetings (title, participants, meeting_date, transcript, created_by)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const result = await query(sql, [
      title,
      JSON.stringify(participants),
      meetingDate,
      JSON.stringify(transcript),
      userId,
    ]);

    return result.rows[0];
  }

  async getMeetingById(id: string): Promise<Meeting | null> {
    const sql = "SELECT * FROM meetings WHERE id = $1";
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  }

  async getMeetings(
    page: number,
    limit: number,
  ): Promise<{ meetings: Meeting[]; total: number; totalPages: number }> {
    const offset = (page - 1) * limit;

    const countSql = "SELECT COUNT(*) FROM meetings";
    const countResult = await query(countSql);
    const total = parseInt(countResult.rows[0].count, 10);

    const sql = `
      SELECT * FROM meetings
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await query(sql, [limit, offset]);

    const totalPages = Math.ceil(total / limit);

    return {
      meetings: result.rows,
      total,
      totalPages,
    };
  }
}
