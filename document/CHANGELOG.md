# Changelog

## [1.1.0] - 2026-06-03

### Refactored
- **Dynamic Reminders**: Refactored the reminder engine to route emails directly to action item assignees.
- **Environment Cleanup**: Removed the hardcoded `REMINDER_EMAIL` dependency from the configuration.

### errors
- **Linting**: Resolved all ESLint warnings in `error.middleware.ts` (unused variables, explicit `any`).
- **Documentation**: Standardized all Markdown files by removing emojis for a more professional tone.

## [1.0.0] - 2026-06-04

### AI & Intelligence
- **Deep Integration**: Integrated Google Gemini 1.5 Flash for meeting intelligence.
- **Evidence Layer**: Implemented a mandatory citation system; insights are now linked to transcript timestamps.
- **Output Validation**: Added a multi-tier validation layer (Zod + Manual Check) to ensure AI output integrity.

### Security & Stability
- **Multi-Tier Rate Limiting**: Added `express-rate-limit` to protect Global, Auth, and AI endpoints.
- **Observability**: Implemented Request Trace IDs and a Global Error Handler for surgical production debugging.
- **Authentication**: Robust JWT-based auth flow with registration, login, and logout.

### Features & Modules
- **Meeting Module**: Full CRUD for meeting transcripts with pagination.
- **Action Items**: Lifecycle management for tasks extracted by AI.
- **Reminders Engine**: Hourly cron job with multi-channel support (Discord Webhooks & SMTP Email).
- **Evaluation API**: Created `GET /api/evaluation` for easy project verification.

### Quality Assurance
- **Integration Testing**: Added a comprehensive suite using Vitest and Supertest.
- **ESM Migration**: Fully converted the project to TypeScript ESM for modern Node.js compliance.
- **CI/CD**: Configured GitHub Actions for automated build and linting.

### Bug Fixes
- Resolved ESM module resolution issues (missing `.js` extensions).
- Fixed GitHub Actions pnpm version conflicts.
- Corrected Render deployment entry point (`dist/server.js`).
