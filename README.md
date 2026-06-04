# Task - Meeting Intelligence Service

[![Build Status](https://github.com/janavi-185/meet-it/actions/workflows/backend.yml/badge.svg)](https://github.com/janavi-185/meet-it/actions)

**Hintron** is a sophisticated backend engine designed to bridge the gap between spoken meetings and documented action. By leveraging the **Google Gemini 1.5 Flash** model, it automatically transforms raw transcripts into structured summaries, verifiable decisions, and assigned action items.

---

## 🔗 Live Resources
- **Live API**: [https://meet-it.onrender.com](https://meet-it.onrender.com)
- **Interactive Swagger Docs**: [https://meet-it.onrender.com/api-docs](https://meet-it.onrender.com/api-docs)
- **Repository**: [https://github.com/janavi-185/meet-it](https://github.com/janavi-185/meet-it)

---

## ✨ Core Features
- **🤖 AI Intelligence**: Automatic extraction of meeting insights with **high-fidelity grounding**.
- **🔗 Evidence-Based**: Every AI insight includes **citations** (timestamps) linked directly to the transcript.
- **🔐 Secure Access**: JWT-based authentication with password hashing and session management (Login/Logout).
- **📅 Action Item Lifecycle**: Track tasks from extraction to completion.
- **⏰ Smart Reminders**: Automated hourly detection of overdue tasks with notifications.
- **📢 Multi-Channel Alerts**: Real-time reminders delivered via **Discord Webhooks** and **Email**.
- **🛡️ Multi-Tier Security**: Granular rate limiting for Global, Auth, and AI endpoints.
- **🔍 Observability**: Unified error handling with unique **Request Trace IDs** for production debugging.

---

## 🛠 Tech Stack
- **Backend**: Node.js, Express.js (TypeScript ESM)
- **Database**: PostgreSQL (Neon Serverless)
- **AI Engine**: Google Generative AI (Gemini 1.5 Flash)
- **Validation**: Zod & Express-Validator
- **Testing**: Vitest & Supertest
- **Documentation**: Swagger/OpenAPI 3.0
- **CI/CD**: GitHub Actions

---

## 📂 Project Structure
```text
server/
├── src/
│   ├── config/          # Global configurations (DB, Env, Swagger, Rate Limits)
│   ├── middleware/      # Auth, TraceID, Global Error Handler, Validation
│   ├── modules/         # Domain-driven modules
│   │   ├── auth/        # Authentication logic
│   │   ├── meetings/    # Transcript storage & retrieval
│   │   ├── analysis/    # Gemini AI integration & grounding
│   │   ├── action-items/# Task management & overdue tracking
│   │   └── evaluation/  # Public metadata endpoint
│   ├── jobs/            # Scheduled tasks (Cron reminders)
│   ├── tests/           # Integration & Unit tests
│   ├── app.ts           # Express app configuration
│   └── server.ts        # Server entry point
└── document/            # Detailed technical documentation
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **pnpm** (v10+)
- **Node.js** (v22+)
- **PostgreSQL** instance

### 2. Environment Setup
Create `server/.env`:
```env
PORT=5002
NODE_ENV=development
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d
GEMINI_API_KEY=your_google_ai_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=your_email@gmail.com
REMINDER_EMAIL=recipient@example.com
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

### 3. Installation & Run
```bash
cd server
pnpm install
pnpm dev
```

### 4. Run Tests
```bash
pnpm test
```

---

## 📖 API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Create a new account |
| `POST` | `/api/auth/login` | Authenticate & receive JWT |
| `POST` | `/api/auth/logout` | Securely logout |
| `POST` | `/api/meetings` | Create meeting & store transcript |
| `GET` | `/api/meetings` | List all meetings (Paginated) |
| `GET` | `/api/meetings/:id` | Get meeting details |
| `POST` | `/api/meetings/:id/analyze`| Trigger AI Intelligence (Rate limited) |
| `GET` | `/api/meetings/:id/analysis` | Retrieve existing AI analysis |
| `POST` | `/api/action-items` | Manually create a task |
| `GET` | `/api/action-items` | List tasks (Filter by status/assignee) |
| `PATCH`| `/api/action-items/:id/status`| Update task status (e.g. COMPLETED) |
| `GET` | `/api/action-items/overdue` | List all overdue action items |

### 🛠️ System
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/evaluation` | Public project & candidate info |
| `GET` | `/health` | Server health check |
| `GET` | `/api-docs` | Interactive Swagger UI |

---

## 🛡️ Security & Observability
- **Rate Limiting**: 100 req/15min (Global), 5 req/15min (Auth), 3 req/15min (AI).
- **Trace IDs**: Every request is assigned a `traceId`. If an error occurs, this ID is logged and returned to the client for easy log correlation.
- **Global Error Handling**: Catch-all middleware ensures no raw errors are leaked to the client and responses are always uniform.

---

## 📄 Documentation
For deeper dives into our technical choices and strategies, see the `document/` folder:
- [AI Strategy](./document/AI_APPROACH.md)
- [Technical Decisions](./document/DECISIONS.md)
- [Testing Strategy](./document/TESTING.md)
- [Changelog](./document/CHANGELOG.md)
- [Submission Checklist](./document/CHECKLIST.md)
