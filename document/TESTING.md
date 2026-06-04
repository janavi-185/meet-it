# Testing Strategy & Execution

Hintron ensures production reliability through a tiered testing strategy, ranging from isolated unit tests to end-to-end integration tests.

## 1. Test Architecture
We use **Vitest** as our primary test runner and **Supertest** for API integration testing.
- **Sequenced Execution**: All integration tests run sequentially to avoid race conditions on the database.
- **Environment Isolation**: A dedicated `setup.ts` file ensures environment variables are properly loaded before tests execute.

## 2. Integration Test Scenarios

### Authentication Flow (`src/tests/auth.test.ts`)
- **User Registration**: Verified successful account creation with unique emails (timestamp-based).
- **Security Check**: Verified that duplicate registrations are blocked.
- **Login**: Verified JWT generation and correct response structure.

### Meeting Management (`src/tests/meeting.test.ts`)
- **Protected Access**: Verified that all meeting endpoints require a valid `Authorization` header.
- **Lifecycle**:
    - `POST /api/meetings`: Creating a meeting with a complex transcript.
    - `GET /api/meetings`: Verifying paginated results.
    - `GET /api/meetings/:id`: Retrieving specific meeting details.

### AI Analysis & Citations
- **Insight Extraction**: Verified that the system correctly triggers Gemini for analysis.
- **Citation Verification**: Verified that generated insights include valid transcript timestamps.

## 3. Defensive Programming & Edge Cases
- **Rate Limiting**: Tests confirmed that users are blocked after exceeding thresholds (Auth and AI endpoints).
- **Empty Transcripts**: Verified that the AI handles empty or nonsensical input without crashing.
- **Global Error Handler**: Verified that all errors return a consistent JSON schema with a `traceId`.

## 4. How to Run Tests
Integration tests require a valid `DATABASE_URL` in your `.env` file.

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm vitest
```

## 5. Known Limitations
- **Database Dependency**: Current integration tests run against the primary database (using unique emails to avoid conflicts). Future versions will implement a dedicated test-database setup.
- **External API Mocks**: AI analysis tests currently hit the real Gemini API. We plan to implement full mocking for faster, offline testing.
