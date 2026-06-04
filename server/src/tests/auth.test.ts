import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

const uniqueEmail = `test-${Date.now()}@example.com`;
const password = "password123";
let token: string;

describe("Auth Integration Tests", () => {
  it("should register a new user", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: uniqueEmail,
      password: password,
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });

  it("should login the user and return a JWT token", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: uniqueEmail,
      password: password,
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();

    token = response.body.token;
  });

  // Export token for other tests if needed, or we can just relogin in other tests.
  // For integration testing sequentially, we might want to share state or just use global vars.
});

export { token, uniqueEmail };
