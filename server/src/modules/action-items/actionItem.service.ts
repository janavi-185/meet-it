import { query } from "../../config/db.js";
import { MeetingService } from "../meetings/meeting.service.js";
import {
  ActionItem,
  ActionItemFilters,
  ActionItemStatus,
  CreateActionItemInput,
} from "./actionItem.model.js";

const meetingService = MeetingService.getInstance();

export class ActionItemService {
  private static instance: ActionItemService;

  public static getInstance(): ActionItemService {
    if (!ActionItemService.instance) {
      ActionItemService.instance = new ActionItemService();
    }
    return ActionItemService.instance;
  }

  async createActionItem(input: CreateActionItemInput): Promise<ActionItem> {
    const { meetingId, task, assignee, dueDate, citation } = input;

    // Verify meeting exists
    const meeting = await meetingService.getMeetingById(meetingId);
    if (!meeting) {
      throw new Error("Meeting not found");
    }

    const sql = `
      INSERT INTO action_items (meeting_id, task, assignee, due_date, citation)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const result = await query(sql, [
      meetingId,
      task,
      assignee || null,
      dueDate || null,
      citation ? JSON.stringify(citation) : null,
    ]);

    return result.rows[0];
  }

  async getActionItems(filters: ActionItemFilters): Promise<ActionItem[]> {
    const { status, assignee, meetingId } = filters;
    const values: unknown[] = [];
    let sql = "SELECT * FROM action_items";
    const whereClauses: string[] = [];

    if (status) {
      values.push(status);
      whereClauses.push(`status = $${values.length}`);
    }

    if (assignee) {
      values.push(assignee);
      whereClauses.push(`assignee = $${values.length}`);
    }

    if (meetingId) {
      values.push(meetingId);
      whereClauses.push(`meeting_id = $${values.length}`);
    }

    if (whereClauses.length > 0) {
      sql += " WHERE " + whereClauses.join(" AND ");
    }

    sql += " ORDER BY created_at DESC";

    const result = await query(sql, values);
    return result.rows;
  }

  async updateStatus(
    id: string,
    status: ActionItemStatus,
  ): Promise<ActionItem | null> {
    const sql = `
      UPDATE action_items
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;

    const result = await query(sql, [status, id]);
    return result.rows[0] || null;
  }

  async getOverdueItems(): Promise<ActionItem[]> {
    const sql = `
      SELECT * FROM action_items
      WHERE status != 'COMPLETED'
      AND due_date < NOW()
      ORDER BY due_date ASC
    `;

    const result = await query(sql);
    return result.rows;
  }
}
