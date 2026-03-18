## Horus‑Site — API Documentation & Logic Overview

### Scope
This document summarizes the **current** SSR + API architecture and audits the Express API surface under `/api`.
It is intended for lead engineer review (implementation-oriented, minimal marketing language).

---

## 1) Core Logic Implementation (SSR + API Separation)

### 1.1 Current SSR Architecture (Angular SSR on Express)
The application is built as an **Angular SSR** app hosted by **Express 5**.

- **SSR entrypoint**: `src/server.ts`
- **SSR runtime**: `AngularNodeAppEngine` (`@angular/ssr/node`)
- **Build mode**: `outputMode: "server"` (Angular produces both server + browser outputs)

**How requests are handled (high-level):**
- Static assets are served from the browser dist folder.
- All other requests are rendered via Angular SSR (`angularApp.handle(req)`).

### 1.2 Why we separated API process from Angular SSR dev server
During development, the Angular SSR dev server can accidentally import or bundle server-only dependencies (Mongo/Mongoose/Node-only libraries) when backend code is reachable from the SSR runtime. This can cause:
- SSR evaluation crashes
- Node-only modules leaking into the browser/SSR bundle
- unstable dev behavior

**Mitigation implemented:**
- Run API separately on port `4000` (`npm run dev:api`)
- Run Angular dev server on `4200` with API disabled in SSR (`SSR_DISABLE_API=1`)
- Use an HTTP proxy to forward `/api` calls from `4200 → 4000`

### 1.3 `proxy.conf.json` and data flow
`proxy.conf.json` proxies all `/api` requests to the API server:
- Frontend calls: `GET /api/courses`, `POST /api/enroll`, etc. (same origin from `localhost:4200`)
- Dev server forwards to: `http://localhost:4000`

This avoids CORS and ensures Angular code only talks to the backend via `HttpClient` rather than importing backend modules.

### 1.4 Key configuration points (`angular.json`, `package.json`, `src/server.ts`)
**`angular.json`**
- SSR build enabled:
  - `build.options.server: "src/main.server.ts"`
  - `build.options.outputMode: "server"`
  - `build.options.ssr.entry: "src/server.ts"`
- Dev proxy enabled:
  - `serve.options.proxyConfig: "proxy.conf.json"`
- Bundle safety:
  - `externalDependencies: ["mongoose", "express"]` to prevent server-only deps from being bundled into browser output.

**`package.json`**
- `dev` runs two processes concurrently:
  - `dev:api` → `tsx dev/api-server.ts`
  - `dev:web` → `SSR_DISABLE_API=1 && ng serve --proxy-config proxy.conf.json`

**`src/server.ts`**
- Conditionally mounts the API router + DB connection:
  - When `SSR_DISABLE_API=1`, backend code is not imported by the SSR dev server.

---

## 2) Environment Specs (Versions + ESM)

### 2.1 Versions (from `package.json`)
- **Angular**: `^20.3.0`
- **Angular SSR**: `@angular/ssr ^20.3.18`
- **Express**: `^5.1.0`
- **Mongoose**: `^9.3.0`
- **Zod**: `^4.3.6`
- **Node tooling**: `tsx` used to run TypeScript servers in dev.

### 2.2 ESM + SSR runtime
The SSR host is ESM-oriented:
- Uses `import.meta.dirname` in `src/server.ts`
- Uses `AngularNodeAppEngine` from `@angular/ssr/node`

This aligns with modern Angular SSR outputs (`server.mjs`) and Express 5 runtime compatibility.

---

## 3) API Endpoint Table (`routes/` audit)

### 3.1 Response conventions
Controllers use shared helpers from `controllers/_http.ts` for consistent JSON shapes:
- Success: `{ "success": true, "data": <T> }`
- Failure: `{ "success": false, "error": <CODE> }`
- Validation errors often include `details` from Zod/Mongoose.

### 3.2 Endpoints
All endpoints below are mounted by `routes/api.ts` and are reachable under `/api/*`.

| Method | Endpoint Path | Purpose | Validation / Middleware | Logic Summary |
|---|---|---|---|---|
| GET | `/api/courses` | List courses | — | Queries MongoDB via `CourseModel.find().sort({ createdAt: -1 }).lean()` and returns array. |
| GET | `/api/courses/:slug` | Get course by slug | — | Normalizes slug (`toLowerTrimmed`), fetches via `findOne({ slug }).lean()`, returns 404 if missing. |
| POST | `/api/enroll` | Create enrollment lead | **Zod** (`controllers/enroll.validation.ts`) | Validates lead fields, finds course by slug, stores `course` ObjectId + `courseSlug`. |
| GET | `/api/admin/enrollments` | Admin: list enrollment leads | **Admin key middleware** (`routes/admin.middleware.ts`) | Requires `x-admin-key` or `Authorization: Bearer <key>`; sorts by newest first. |
| POST | `/api/admin/courses` | Admin: create course | **Zod** (`controllers/admin.validation.ts`) + admin middleware | Validates course payload including curriculum arrays; creates course document. |
| PUT | `/api/admin/courses/:id` | Admin: update course | **Zod (partial)** (`updateCourseSchema`) + admin middleware | Validates partial updates; uses `findByIdAndUpdate(..., runValidators:true)`; returns 404 if missing. |
| DELETE | `/api/admin/courses/:id` | Admin: delete course | admin middleware | Deletes via `findByIdAndDelete`; returns 404 if missing. |

---

## 4) Project Structure (API + SSR entry points)

### 4.1 SSR entry points
- `src/server.ts`: SSR host (Express + Angular SSR engine).
- `src/main.server.ts`: Angular server entry for build.
- `src/app/app.routes.server.ts` + `src/app/app.config.server.ts`: server routing/render mode configuration.

### 4.2 API entry points
- `dev/api-server.ts`: standalone API server for local dev (port 4000) + MongoDB connection.
- `routes/api.ts`: API router aggregator; mounts sub-routers under `/api`.
- `routes/courses.routes.ts`, `routes/enroll.routes.ts`, `routes/admin.routes.ts`: route definitions.
- `controllers/*.controller.ts`: business logic for each route.
- `controllers/*.validation.ts`: Zod schemas.
- `src/config/db.ts`: MongoDB connection bootstrap.
- `models/*.ts`: Mongoose models (Course/Instructor/EnrollmentLead).

---

## 5) Operational Notes / Known Risks
- **Admin middleware scope**: ensure admin middleware only guards `/api/admin/*` endpoints (avoid accidentally protecting non-admin endpoints).
- **SSR dev stability**: keep backend imports out of the Angular SSR dev process; rely on `/api` proxy + separate API process.

