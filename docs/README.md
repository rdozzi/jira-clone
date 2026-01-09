<h1> Jira-Clone (Portfolio MVP) </h1>

<h2> Table of Contents </h2>

<h2> 1. Introduction</h2>

This is a Jira-clone project management application MVP that I created as a part of a personal education project in my ongoing journey into fullstack web development and software engineering. The application is designed to manage tasks among teams of users representing tickets/issues in tabular, Kanban-like, and calendar views.

<h2> 2. Architecture Overview </h2>

<h3>Frontend</h3>
<ul style="padding-left: 1.25rem">
  <li>React - UI Framework
  <li>TypeScript - type-safe application logic
  <li>Ant Design - component library and design system
  <li>Vite - build tool and development server
</ul>

<h3> Backend </h3>
<ul style="padding-left: 1.25rem">
<li> Express.js - REST API Framework
<li> Node.js - Runtime environment
<li> Typescript - Application logic and contracts
<li> Prisma - ORM and migration tooling
</ul>

<h3> Database </h3>
<ul style="padding-left: 1.25rem">
<li> PostgreSQL - Primary relational datastore
<li> Redis - Ephemeral data (counters, caching)
</ul>

<h2> 3. Application Features </h2>

<h3> Authentication & Authorization </h3>
<ul style="padding-left: 1.25rem">
<li> User authentication with token-based access control (JWT)
<li> Role awareness scoped to organizations and projects
<li> Tenant-level data isolation across all resources
</ul>

<h3> Multi-Tenant Organization Model </h3>

<ul style="padding-left: 1.25rem">
<li> Organization-based hierarchy with user membership
<li> Separation of data between organizations
<li> Role-aware visibility of projects and tickets
</ul>

<h3> Entity Management </h3>
<ul style="padding-left: 1.25rem">
<li> Project, board, ticket, and comment hierarchy with full CRUD operations
<li> Board-level organization of tickets by status
<li> Assignments, due dates, priority, and status tracking for tickets
<li> Activity log generation and tracking for CRUD operations
</ul>

<h3> Multiple Task Views </h3>
<ul style="padding-left: 1.25rem">
<li> List view with filtering capabilities
<li> Kanban board view for workflow management
<li> Calendar view listing tickets by due date
</ul>

<h3> File Attachments </h3>
<ul style="padding-left: 1.25rem">
<li> Attachment upload and download capabilities for projects, boards, tickets, and comments
<li> Local and cloud (S3) storage layer
</ul>

<h3> User Experience (UX) & UI </h3>
<ul style="padding-left: 1.25rem">
<li> UI/UX features based on Ant Design component library
<li> Light and Dark Theme support
</ul>

<h3> System Foundations </h3>
<ul style="padding-left: 1.25rem">
<li> RESTful API architecture
<li> Centralized validation and error handling
<li> Environment-aware configuration for development and production
</ul>

<h2> 4. Testing Strategy </h2>

<h3>Summary</h3>

The testing strategy implements a conscious balance of engineering rigor, pragmatic considerations and MVP delivery constraints that includes:

<ul style="padding-left: 1.25rem">
<li> Active backend logic that impacts data integrity, protection, segregation. and security within a multi-tenant database architecture
<li> Non-critical or deferred, "skipped," functionality is excluded from the initial test suite
<li> Frontend automation tests are postponed in favor of rapid iteration and manual validation
</ul>

<h3> Backend Testing </h3>

The backend was tested primarily through integration tests designed to validate real application behavior across controllers, services, and the database.

Key Characteristics of the backend test approach include:

<h4>"Happy-path" coverage for deployed routes </h4>

Core API endpoints including authentication, project/board/ticket/comment workflows, and attachment handling were tested for successful execution using realistic payloads and seeded data.

<h4>Selective failure-mode validation</h4>
Tests include representative failure scenarios such as invalid input, unauthorized access, and missing resources to ensure correct HTTP status codes and error handling behavior.

<h4>Database-backed integration tests</h4>
Tests run against a dedicated test database, exercising Prisma queries, transactions, and relational constraints.

<h4>Intentional exclusion of non-deployed routes</h4>
Controller and routes that were deprecated, experimental, or explicitly deferred from the first deployment were skipped to keep test scope aligned with production functionality.

This approach ensures confidence in API correctness and data consistency without over-investing in test coverage for features not exposed in the MVP release.

<h3> Frontend Testing </h3>

No automated frontend tests were implemented for this MVP release.

This decision was intentional based on:

<ul style="padding-left: 1.25rem">
<li> The project is a portfolio MVP that prioritzes backend robustness and functionality.
<li> Time-constraint limits and the desire to reach a minimal deployment state (i.e. the MVP is "good enough" and "overdue" for deployment)

<li> Reliance on manual validation and qualitative smoke testing for UI flows, including:
</ul>

<ul style="padding-left: 2.50rem">
<li> Authentication and session handling
<li> Project, board, and ticket interactions
<li> File upload and download behavior
<li> State synchronization across views
</ul>

Frontend testing is intentionally deferred to post-deployment with future plans to introduce targeted component and integration tests.

<h2> 5. Environment Configuration </h2>

The environmental variables implemented within the application are separated between development, test, and production environments. Each environment uses its own database, cache, and storage configuration.

<h3>Environmental Variables (.env)</h3>

The backend requires the following environment variables to be defined:

|     **Variable**      |                                **Description**                                | **Required?** |
| :-------------------: | :---------------------------------------------------------------------------: | :-----------: |
|       NODE_ENV        |                              Runtime environment                              |      Yes      |
|         PORT          |                Port number _string_ for the Express.js server                 |      Yes      |
|     DATABASE_URL      |                          Postgres connection string                           |      Yes      |
|        DB_USER        |                              Postgres user name                               |      Yes      |
|        DB_HOST        |                             Postgres host string                              |      Yes      |
|        DB_NAME        |                             Postgres name string                              |      Yes      |
|      DB_PASSWORD      |                              DB password string                               |      Yes      |
|        DB_PORT        |                        DB port string (typically 5432)                        |      Yes      |
|     STORAGE_TYPE      | Either "LOCAL" or "CLOUD." "LOCAL" in development and "CLOUD" for production. |      Yes      |
|      JWT_SECRET       |                          JS web token secret string                           |      Yes      |
|   AWS_ACCESS_KEY_ID   |                      AWS access key (cloud storage only)                      |  Conditional  |
| AWS_SECRET_ACCESS_KEY |                      AWS secret key (cloud storage only)                      |  Conditional  |
|  AWS_DEFAULT_REGION   |                          Your region defined by AWS                           |  Conditional  |
|    AWS_BUCKET_NAME    |                          S3 bucket for file uploads                           |  Conditional  |

Attachments and general storage can either be stored in the local storage or in the AWS cloud. Hence, all AWS-related variabled are conditional.

<h3>Test Environment (.env.test)</h3>

The test environment uses overrides a subset of the developement environment variables to ensure deterministic and side-effect-free execution.

| **Variable** |        **Notes**        |
| :----------: | :---------------------: |
|   NODE_ENV   |   Always set to test    |
| DATABASE_URL | Points to test database |
|  JWT_SECRET  |  Non-production secret  |

<h3>Frontend Environment</h3>

The frontend does not require environment-specific configuration for this MVP.

<h3> Redis </h3>
Redis runs inside a local Docker container and is exposed on port 6379. 
The Node.js application connects via localhost using the Redis TCP protocol.

<h2> 6. Deployment (Deferred) </h2>

Deployment configuration and infrastructure details will be documented once the application reaches production deployment. This section is intentionally deferred while the focus remains on completing and stabilizing the MVP.

<h2> 7. Known Limitations & Future Work </h2>

<h3> Known Limitations </h3>

<h4> Authentication & Authorization Architecture </h4>

<ul style="padding-left: 1.25rem">
<li> JWT-based auth<sup>1</sup>
<li> No refresh token rotation or server-side invaliation
<li> Route-level Role Based Access Control (RBAC); no fine-grained Authorization Control List (ACL)
</ul>

<sup>1</sup>For a browser-only MVP, a session-based authentication model would likely have reduced complexity around token invalidation and logout semantics. JWTs were selected to explore token-based patterns and for future API consumers.

<h4> Testing Coverage </h4>

<ul style="padding-left: 1.25rem">
<li> Backend integration tests only
<li> No frontend unit or E2E tests
</ul>

<h4> Scalability & Performance </h4>
<ul style="padding-left: 1.25rem">
<li> Tuned for small times; currently no load testing
<li> Limited Redis usage (no response caching)
</ul>

<h4> Storage & Infrastructure </h4>
<ul style="padding-left: 1.25rem">
<li>S3 tightly coupled; no storage abstraction
<li>No CDN for attachments
</ul>

<h4> UI/UX </h4>
<ul style="padding-left: 1.25rem">
<li> Desktop-first layout (not optimized for tablet or mobile)
<li> Partial accessibility coverage (ARIA attributes, keyboard navigation)
</ul>

<h3>Future Work</h3>

<h4> Authentication Enhancements </h4>
<ul style="padding-left: 1.25rem">
<li> Refresh token rotation and session invalidation (possible authentication overall to hybrid token and session-based systems)
<li> OAuth / SSO providers
<li> More robust organization-level permission models
</ul>

<h4> Testing & Quality </h4>
<ul style="padding-left: 1.25rem">
<li> Frontend unit testing
<li> E2E tesing for critical user flows
<li> Expanded backend test coverage
</ul>

<h4> Architecture & Scalability </h4>
<ul style="padding-left: 1.25rem">
<li> Abstract storage providers behind a service interface
<li> Introduce query caching optimizations and query optimization
<li> Add rate-limit tuning and app-admin observability (metrics, structured logging)
</ul>

<h4>Deployment & DevOps</h4>
<ul style="padding-left: 1.25rem">
<li> Containerized deployment with Docker
<li> CI/CD pipeline for automated testing and deployment
<li> Environment-specific configuration hardening
</ul>

<h4>Product Features</h4>
<ul style="padding-left: 1.25rem">
<li> Team communication: chats, polling, consistent asset update
<li> Notifications (email/in-app)
<li> Frontend toast notifications, improved frontend features
<li> Audit dashboards and organization usage analytics
</ul>

<h2> 8. Reporting and Contributing </h2>

<h3> Reporting Issues </h3>
If you encounter a bug, unexpected behavior, or any other anomaly, please open an issue in the GitHub Issues tab.

Try to include the following:

<ul style="padding-left: 1.25rem">
<li> Steps to reproduce
<li> Expected vs actual behavior
<li> Relevant screenshots or logs if applicable
</ul>

This project is maintained on a best-effort basis.

<h3> Contributing </h3>

Contributions are welcome for bug fixes, small enhancements, and documentation improvements.

For significant changes or new features, please open an issue first to discuss the proposal.

Basic workflow:

<ol style="padding-left: 1.25rem">
<li> Fork the repository
<li> Create a feature branch
<li> Commit clear and descriptive messages (My development workflow used the Conventional Commits extension)
<li> Submit a pull request with a brief explanation
</ol>

By contributing, you agree that your contributions will be licensed under the MIT License.
