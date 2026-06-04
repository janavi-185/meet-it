# Technical Decisions

## 1. Database Choice: PostgreSQL (Neon)
**Decision**: PostgreSQL was selected as the primary relational database, deployed via Neon.
**Why**: 
- **Relational Integrity**: Essential for managing complex relationships between Users, Meetings, Action Items, and Analysis results.
- **JSONB Support**: Allows efficient storage and querying of meeting transcripts and structured AI analysis responses without sacrificing SQL power.
- **Serverless Postgres**: Neon's autoscaling and branching capabilities simplify development and ensure zero-downtime deployments.
**Alternatives Considered**: 
- **MongoDB**: Offers flexibility for transcripts but lacks the strict relational constraints needed for tracking action item assignments and historical reminders.
**Trade-offs**: 
- Requires more upfront schema design than NoSQL, but provides significantly higher data consistency.

## 2. Authentication: JWT with bcryptjs
**Decision**: Stateless authentication using JSON Web Tokens (JWT) and `bcryptjs` for secure password hashing.
**Why**: 
- **Statelessness**: Perfectly suited for distributed deployments (Render), avoiding the need for sticky sessions or shared session stores.
- **Security**: bcryptjs provides industry-standard hashing with configurable salt rounds.
- **Portability**: JWTs can be easily consumed by diverse frontends or external services if needed.
**Alternatives Considered**: 
- **Session-based Auth**: Avoided due to the infrastructure overhead of managing a centralized store like Redis for horizontally scaled environments.
**Trade-offs**: 
- Token revocation is more complex; handled via client-side logout and short-lived tokens.

## 3. External Integration: Google Gemini 1.5 Flash
**Decision**: Using Google Gemini 1.5 Flash for meeting transcript intelligence.
**Why**: 
- **Cost Efficiency**: significantly cheaper than GPT-4 for the high-volume text processing required for long transcripts.
- **Large Context Window**: Capable of handling lengthy meeting transcripts without the need for complex chunking logic.
- **Structured JSON Mode**: Built-in support for enforcing JSON response formats simplifies parsing and validation.
**Alternatives Considered**: 
- **OpenAI GPT-4o**: While highly capable, the cost-per-token was less justifiable for extraction-heavy tasks compared to Gemini Flash.
**Trade-offs**: 
- Dependency on Google Cloud Platform's availability.

## 4. Architecture: Domain-Driven Modular Structure
**Decision**: The project is organized into domain-specific modules (`src/modules/*`).
**Why**: 
- **Maintainability**: Each feature (Auth, Meetings, Analysis, Action Items) is encapsulated with its own routes, controllers, services, and models.
- **Scalability**: New features can be added by creating new modules without risk of "spaghetti code" in a centralized folder.
**Alternatives Considered**: 
- **Layered Architecture** (Folders for all controllers, all services, etc.): Can become difficult to navigate as the project grows to dozens of files.
**Trade-offs**: 
- Slightly higher initial boilerplate for small features.

## 5. Security & Stability: Rate Limiting & Trace IDs
**Decision**: Implemented `express-rate-limit` and unique Request Trace IDs.
**Why**: 
- **Protection**: Multi-tier limits (Global, Auth, AI) protect expensive resources (Gemini API) and sensitive endpoints (Auth).
- **Observability**: Trace IDs in every request header and error log allow for surgical debugging of production issues.
**Trade-offs**: 
- Trace IDs add a small amount of overhead to every request.
