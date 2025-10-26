# Getting Started
Follow these steps to set up and run the entire application locally using Docker.

### Prerequisites
* Node.js (v22.21.0 recommended)
* PNPM (v10.19.0 or recommended)
* Docker & Docker Compose

### 1. Clone the Repository
```bash
git clone https://github.com/levisantosp/taskhub.git
cd taskhub
```

### 2. Configure Environment Variables
You must create `.env` files for each service by copying the provided examples (`example.env` files).

#### Crucial

* **Database Credentials:** Ensure the `DB_PASS`, `DB_USER`, and `DB_NAME` values in all `.env` files exactly match the `POSTGRES_PASSWORD`, `POSTGRES_USER`, and `POSTGRES_DB` values in your `docker-compose.yml`.
* **JWT Secrets:** Ensure `JWT_SECRET` and `JWT_REFRESH_SECRET` are set and are consistent between `apps/api-gateway/.env` and `apps/auth-service/.env`.

### 3. Install Local Dependencies (Mandatory)
Before building the containers, you must install all monorepo dependencies locally. This is crucial for the Docker build process to correctly resolve and link the pnpm workspace packages (`@taskhub/entities`, etc.) from the root `node_modules`.
```bash
pnpm i
```

### 4. Build and Run with Docker
This command will build all services (using their respective `Dockerfile`s), run the database migrations (via the `tasks-service` CMD), and start all services in detached mode.
```bash
docker-compose up --build -d
```

### 5. Accessing the Services
* **Frontend Application:** http://localhost:3000
* **API Gateway (Swagger Docs):** http://localhost:3001/docs
* **RabbitMQ Management UI:** http://localhost:15672 (Credentials: `admin` / `admin` per ` docker-compose.yml`)

* **Health Checks:**
    * http://localhost:3002/health (Auth Service)

    * http://localhost:3003/health (Tasks Service)

    * http://localhost:3004/health (Notifications Service)

### 6. Stopping the Application
```bash
docker-compose down
```

# Architecture
This project is a monorepo (`turborepo` + `pnpm`) implementing a microservices architecture fully containerized with Docker. Communication between the client and the main server is via HTTP REST, while internal communication between services is decoupled using a RabbitMQ broker. Real-time updates are pushed back to the client via WebSockets.

### High-Level Diagram
```
              [ Client (Browser) ]
                 (React / Vite)
                   |           ^
 (HTTP REST)       |           | (WebSocket)
 [localhost:3000]  |           |
                   v           |
+------------------+-----------+-----------------------+
|                  |           |                       |
|         [ API Gateway ]      [ Notifications Service ]
|       (NestJS - Port 3001)   (NestJS - Port 3004)    |
|                  |           |                       |
+------------------+-----------+-----------------------+
      |      | (HTTP)      ^ (WS)
      |      +-----------> |
      |                  |
(RMQ Msgs) | (RMQ Events) | (Saves Notifications)
      |      <-----------+
      v                  |
+------------------+     |
|     RabbitMQ     |     |
|  (Message Broker)  |     |
+------------------+     |
  ^           ^          |
  |           |          |
(Emits Events)|(Sends Msgs)| (Saves Entities)
  |           |          |
+-V-----------+----------V---+      +-----------------------+
|  [ Tasks Service ]         |      |    [ Auth Service ]   |
| (NestJS Microservice)      |      | (NestJS Microservice) |
| (Listens: 'task.queue')    |      | (Listens: 'auth.queue')|
+----------------------------+      +-----------------------+
             |                                |
             +---------------V----------------+
                             |
                   +---------------------+
                   |  PostgreSQL (DB)  |
                   |   (taskhub_db)    |
                   +---------------------+
```

# Technical Decisions & Trade-offs
This section details the key design and architecture decisions made during the project's development.

* **Monorepo (Turborepo & pnpm Workspaces):**
    * **Decision:** Utilize a monorepo managed by `pnpm` and orchestrated by `Turborepo`.
    * **Rationale:** The mandatory stack involved multiple services and shared code (`@taskhub/entities`, `@taskhub/types`). A monorepo greatly simplified dependency management, ensured type consistency using `workspace:*`, and allowed for efficient code sharing. `Turborepo` was used to optimize build and linting scripts.

* **Runtime Migration (Bun to pnpm/Node.js):**
    * **Decision:** The project was initially attempted with `Bun` but was **migrated** to `pnpm` and the standard **Node.js** runtime.
    * **Rationale:** This was a critical decision driven by a technical blocker. The Bun runtime proved incompatible with NestJS's WebSocket dependencies (`socket.io` / `@nestjs/platform-socket.io`). The NestJS `IoAdapter` attempts to access standard Node.js server methods (like `server.listeners()`) that are not implemented in Bun's HTTP server, causing an immediate crash in the `notifications-service`. Migrating to `pnpm` and Node.js resolved this incompatibility and ensured the stability of the WebSocket service.

* **Microservice Communication (RabbitMQ):**
    * **Decision:** Use `RabbitMQ` (via `@nestjs/microservices`) for all internal communication initiated by the `api-gateway`.
    * **Rationale:** Instead of the Gateway making direct HTTP calls (tight coupling), RabbitMQ acts as a message broker. This decouples the services: the Gateway only dispatches a message (e.g., `'create.task'`) to a specific queue (`task.queue`) and the corresponding service (`tasks-service`) consumes it.
    * **Trade-off:** This increases infrastructure complexity (one more container) but provides greater resilience (if `tasks-service` is down, the message can wait in the queue) and scalability.

* **Notification Flow (Event-Driven):**
    * **Decision:** The `tasks-service` (which handles business logic) does not send notifications directly. It **emits an event** (e.g., `task.created`) to a separate queue (`notifications.queue`). A dedicated `notifications-service` consumes these events.
    * **Rationale:** This follows the Single Responsibility Principle. The `tasks-service` only needs to report "something happened." The `notifications-service` is responsible for processing this event: creating/persisting a `Notification` entity and formatting the correct payload to be sent to the specific client via WebSocket.

* **Validation (Zod + class-validator):**
    * **Decision:** Use `zod` on the frontend (with `react-hook-form`) and `class-validator` on the backend (NestJS DTOs).
    * **Rationale:** Client-side validation provides immediate user feedback, while server-side validation is essential for security and data integrity. `class-validator` integrates seamlessly with NestJS's `ValidationPipe` at both the Gateway (global pipe) and Microservice (`@Payload()` pipe) levels.

* **Database Migrations (TypeORM CLI):**
    * **Decision:** Switched from `synchronize: true` to `synchronize: false` and set up TypeORM's migration CLI.
    * **Rationale:** `synchronize: true` is unsafe for production as it can drop data. Using migrations provides a safe and version-controlled way to update the database schema.
    * **Trade-off:** To prevent race conditions during `docker compose up` (where multiple services would try to create the `migrations` table simultaneously), the migration execution (`pnpm migration:run`) was **centralized** to run only in the `tasks-service` container before startup.

* **Build (Production in Docker):**
    * **Decision:** Dockerfiles are configured for a production build. They run `pnpm install`, then `pnpm build` (which calls `tsc`), and the final `CMD` uses `node` to run the compiled JavaScript from the `dist/` folder.
    * **Rationale:** This provides the best performance in production, as no real-time TypeScript transpilation (`ts-node` or `tsx`) is required by the running container.

# Known Issues & Future Improvements
Given the time constraints of the challenge, the current implementation successfully covers all mandatory functional requirements. However, there are several known limitations and areas for future improvement.

### Known Issues (Current Limitations)
* **1. Lack of Automated Testing:** This is the most significant omission. The project currently has no unit, integration, or E2E tests, which is a critical technical debt.
* **2. No Client-Side Pagination:** While the backend API (`GET /tasks` and `GET /tasks/:id/comments`) is built to support pagination (returning `page`, `size`, `total`), the frontend UI currently fetches all items (or a hardcoded limit) and does not have any pagination controls (e.g., "Next Page" buttons).
* **3. Inefficient Search:** The search input on the Tasks page fires an API request on every single keystroke (`onChange`). This is inefficient and should be debounced.
* **4. Basic WebSocket Notification Logic:** The real-time notification logic is simple. For example, when a new comment is posted, the notification is only sent to the author of the comment, not to *all* users assigned to that task.
* **5. In-Memory WebSocket State:** The `NotificationsGateway` tracks connected users (`userId` -> `socket`) using an in-memory `Map`. This will not work if the service is scaled horizontally (i.e., running more than one instance).

### Future Improvements
* **1. Implement TanStack Query:** Refactor all `useState`/`useEffect` data-fetching logic (`findTasks`, `fetchTask`, `fetchComments`) to use TanStack Query. This was a listed "differentiator" and would greatly improve caching, state management, and removal of optimistic/manual UI updates.
* **2. Implement Password Reset:** Add the "password reset" flow (email, token, reset form), which was listed as a differential.
* **3. Implement Structured Logging:** Replace the basic `new Logger()` from NestJS and `console.log` with a structured logging library like **Winston** or **Pino** for better production-level monitoring (a listed differentiator).
* **4. Implement Full Pagination UI:** Add the frontend components (`<Pagination>` from shadcn/ui) to interact with the API's pagination data.
* **5. Add Search Debouncing:** Wrap the `setSearchTerm` state or the `findTasks` call in a `useDebounce` hook to reduce API spam.
* **6. Robust WebSocket Scaling:** Replace the in-memory `Map` in `NotificationsGateway` with a **Redis** instance (e.g., Redis Pub/Sub) to manage socket state across multiple service instances.
* **7. Complete Task Assignment UI:** The backend supports `assignedUsers`, but the frontend UI (create/edit forms) does not yet include a multi-select dropdown to manage task assignments to other users.

# Time Spent (Approximate)

This project was developed over the 14-day period. Below is an approximate breakdown of the time spent on each major component of the application.

* **Initial Setup (Monorepo, Docker, Base Config):** `2 hours`
* **Backend - Auth Service (Logic, JWT, DTOs):** `48 hours`
* **Backend - Tasks Service (Entities, CRUD, QueryBuilder, Events):** `12 hours`
* **Backend - Notifications Service (Consumer, WebSocket Gateway):** `12 hours`
* **Backend - API Gateway (Proxy, Guards, DTOs):** `48 hours`
* **Frontend - UI Setup (Routing, Shadcn/ui, Components, Forms):** `2 hours`
* **Frontend - State & Logic (AuthContext, API Service, Modals, WS Listeners):** `5 hours`
* **DevOps & Migration (Bun to pnpm, Dockerfile debugging):** `30 minutes`
* **Database (TypeORM Migrations Setup):** `20 minutes`
* **Debugging (Cross-service issues, 400/500 Errors, WS Connection):** `30 minutes`
* **Final Documentation (Swagger, Health Checks, README):** `1 hour`