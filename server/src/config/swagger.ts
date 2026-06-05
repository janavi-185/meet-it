import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./env.js";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Meeting Intelligence Service API",
      version: "1.0.0",
      description:
        "API documentation for the Meeting Intelligence Service backend",
    },
    servers: [
      {
        url: `http://localhost:${env.port}`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    paths: {
      "/api/auth/register": {
        post: {
          summary: "Register a new user",
          tags: ["Auth"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "email", "password"],
                  properties: {
                    name: { type: "string", example: "John Doe" },
                    email: { type: "string", example: "john@example.com" },
                    password: { type: "string", example: "password123" },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "User registered successfully",
            },
          },
        },
      },
      "/api/auth/login": {
        post: {
          summary: "Login a user",
          tags: ["Auth"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: { type: "string", example: "john@example.com" },
                    password: { type: "string", example: "password123" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Login successful, returns JWT token",
            },
          },
        },
      },
      "/api/auth/logout": {
        post: {
          summary: "Logout a user",
          tags: ["Auth"],
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Logged out successfully",
            },
          },
        },
      },
      "/api/meetings": {
        post: {
          summary: "Create a new meeting",
          tags: ["Meetings"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: [
                    "title",
                    "participants",
                    "meetingDate",
                    "transcript",
                  ],
                  properties: {
                    title: { type: "string", example: "Sprint Planning" },
                    participants: {
                      type: "array",
                      items: { type: "string", example: "alice@example.com" },
                      example: ["alice@example.com", "bob@example.com"],
                    },
                    meetingDate: {
                      type: "string",
                      format: "date-time",
                      example: "2026-05-20T10:00:00Z",
                    },
                    transcript: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          timestamp: { type: "string", example: "00:10" },
                          speaker: { type: "string", example: "John" },
                          text: {
                            type: "string",
                            example: "We should launch next Friday.",
                          },
                        },
                      },
                      example: [
                        {
                          timestamp: "00:10",
                          speaker: "John",
                          text: "We should launch next Friday.",
                        },
                        {
                          timestamp: "00:20",
                          speaker: "Alice",
                          text: "I will prepare release notes.",
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Meeting created successfully" },
          },
        },
        get: {
          summary: "Get paginated meetings",
          tags: ["Meetings"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "query",
              name: "page",
              schema: { type: "integer", default: 1, example: 1 },
            },
            {
              in: "query",
              name: "limit",
              schema: { type: "integer", default: 10, example: 10 },
            },
          ],
          responses: {
            200: { description: "List of meetings" },
          },
        },
      },
      "/api/meetings/{id}": {
        get: {
          summary: "Get meeting by ID",
          tags: ["Meetings"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: {
                type: "string",
                format: "uuid",
                example: "123e4567-e89b-12d3-a456-426614174000",
              },
            },
          ],
          responses: {
            200: { description: "Meeting details" },
            404: { description: "Meeting not found" },
          },
        },
      },
      "/api/meetings/{id}/analyze": {
        post: {
          summary: "Analyze a meeting transcript using AI",
          tags: ["Analysis"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: {
                type: "string",
                format: "uuid",
                example: "123e4567-e89b-12d3-a456-426614174000",
              },
            },
          ],
          responses: {
            200: {
              description: "Meeting analyzed successfully",
              content: {
                "application/json": {
                  example: {
                    success: true,
                    message: "Meeting analyzed successfully",
                    data: {
                      summary: [
                        {
                          text: "Team plans to launch next Friday.",
                          citations: [{ timestamp: "00:10" }],
                        },
                      ],
                      actionItems: [
                        {
                          task: "Prepare release notes",
                          assignee: "Alice",
                          citations: [{ timestamp: "00:20" }],
                        },
                      ],
                      decisions: [
                        {
                          text: "Launch next Friday",
                          citations: [{ timestamp: "00:10" }],
                        },
                      ],
                      followUps: [
                        {
                          text: "Confirm release readiness",
                          citations: [{ timestamp: "00:20" }],
                        },
                      ],
                    },
                  },
                },
              },
            },
            400: { description: "Analysis failed" },
          },
        },
      },
      "/api/meetings/{id}/analysis": {
        get: {
          summary: "Get existing analysis for a meeting",
          tags: ["Analysis"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: {
                type: "string",
                format: "uuid",
                example: "123e4567-e89b-12d3-a456-426614174000",
              },
            },
          ],
          responses: {
            200: {
              description: "Analysis retrieved successfully",
              content: {
                "application/json": {
                  example: {
                    success: true,
                    data: {
                      id: "uuid",
                      meeting_id: "uuid",
                      summary: [],
                      action_items: [],
                      decisions: [],
                      follow_ups: [],
                      generated_at: "timestamp",
                    },
                  },
                },
              },
            },
            404: { description: "Analysis not found" },
          },
        },
      },
      "/api/action-items": {
        post: {
          summary: "Create a new action item",
          tags: ["Action Items"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["meetingId", "task"],
                  properties: {
                    meetingId: {
                      type: "string",
                      format: "uuid",
                      example: "123e4567-e89b-12d3-a456-426614174000",
                    },
                    task: { type: "string", example: "Prepare release notes" },
                    assignee: { type: "string", example: "Alice" },
                    dueDate: {
                      type: "string",
                      format: "date-time",
                      example: "2026-05-25T18:00:00Z",
                    },
                    citation: {
                      type: "object",
                      properties: {
                        timestamp: { type: "string", example: "00:20" },
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Action item created successfully" },
          },
        },
        get: {
          summary: "Get filtered action items",
          tags: ["Action Items"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "query",
              name: "status",
              schema: {
                type: "string",
                enum: ["PENDING", "IN_PROGRESS", "COMPLETED"],
              },
            },
            {
              in: "query",
              name: "assignee",
              schema: { type: "string", example: "Alice" },
            },
            {
              in: "query",
              name: "meetingId",
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            200: { description: "List of action items" },
          },
        },
      },
      "/api/action-items/{id}/status": {
        patch: {
          summary: "Update action item status",
          tags: ["Action Items"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["status"],
                  properties: {
                    status: {
                      type: "string",
                      enum: ["PENDING", "IN_PROGRESS", "COMPLETED"],
                      example: "COMPLETED",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Status updated successfully" },
            404: { description: "Action item not found" },
          },
        },
      },
      "/api/action-items/overdue": {
        get: {
          summary: "Get overdue action items",
          tags: ["Action Items"],
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "List of overdue action items" },
          },
        },
      },
      "/api/evaluation": {
        get: {
          summary: "Get evaluation details",
          tags: ["Evaluation"],
          responses: {
            200: {
              description: "Evaluation details retrieved successfully",
              content: {
                "application/json": {
                  example: {
                    candidateName: "Janavi Chauhan",
                    email: "chauhanjanavi06@gmail.com",
                    repositoryUrl: "https://github.com/janavi-185/meet-it",
                    deployedUrl: "https://meet-it.onrender.com",
                    externalIntegration:
                      "Gemini AI, Discord Webhook, Nodemailer",
                    features: [
                      "Authentication (JWT with Logout)",
                      "AI Meeting Analysis (Gemini)",
                      "Action Item Management",
                      "Automated Overdue Reminders (Cron)",
                      "Discord & Email Notifications",
                      "Swagger API Documentation",
                    ],
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
