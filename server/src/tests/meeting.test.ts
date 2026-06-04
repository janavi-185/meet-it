import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../app.js";

const uniqueEmail = `test-meeting-${Date.now()}@example.com`;
const password = "password123";
let token: string;
let meetingId: string;

describe("Meeting Integration Tests", () => {
  beforeAll(async () => {
    // Register and Login to get token
    await request(app).post("/api/auth/register").send({
      name: "Meeting Tester",
      email: uniqueEmail,
      password: password,
    });

    const loginRes = await request(app).post("/api/auth/login").send({
      email: uniqueEmail,
      password: password,
    });

    token = loginRes.body.token;
  });

  it("should create a new meeting", async () => {
    const meetingPayload = {
      title: "Sprint Planning",
      participants: ["alice@example.com", "bob@example.com"],
      meetingDate: "2026-05-20T10:00:00Z",
      transcript: [
        {
          timestamp: "00:10",
          speaker: "John",
          text: "We should launch next Friday.",
        },
      ],
    };

    const response = await request(app)
      .post("/api/meetings")
      .set("Authorization", `Bearer ${token}`)
      .send(meetingPayload);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBeDefined();

    meetingId = response.body.data.id;
  });

  it("should get all meetings", async () => {
    const response = await request(app)
      .get("/api/meetings")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data.meetings)).toBe(true);
  });

  it("should get meeting by ID", async () => {
    const response = await request(app)
      .get(`/api/meetings/${meetingId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe(meetingId);
    expect(response.body.data.title).toBe("Sprint Planning");
  });
});
