### 🔧 Stable version matrix

| Layer            | Package                         | Current **stable**                | Source                 |
| ---------------- | ------------------------------- | --------------------------------- | ---------------------- |
| Runtime (JS)     | **Node.js 22.17.0 (LTS “Jod”)** | Apr 24 2024 → Jun 24 2025 patches | ([nodejs.org][1])      |
| React framework  | **Next.js 15.3.4**              | Latest 15-series release          | ([nextjs.org][2])      |
| Language (JS)    | **TypeScript 5.8.3**            | April 7 2025 patch                | ([github.com][3])      |
| Styling          | **Tailwind CSS 4.0.0**          | Major v4 GA                       | ([tailwindcss.com][4]) |
| ORM              | **Prisma 6.10.1**               | Patch issued Jun 18 2025          | ([github.com][5])      |
| React core       | **React 19.1.0**                | Matches Next 15 bundle            | ([react.dev][6])       |
| Runtime (Py)     | **Python 3.13.2**               | Feb 4 2025 maintenance            | ([python.org][7])      |
| Web-API (Py)     | **FastAPI 0.115.13**            | Jun 17 2025                       | ([pypi.org][8])        |
| Container engine | **Docker Engine 27.5.1**        | Jan 22 2025 patch                 | ([docs.docker.com][9]) |
| Database         | **PostgreSQL 17.5**             | May 8 2025 security + bug fix     | ([postgresql.org][10]) |

All components satisfy each other’s minimum peer requirements (e.g., Node ≥ 18 for Next/Prisma, Python ≥ 3.8 for FastAPI, PostCSS 8 for Tailwind).

---

## 🗺️ End-to-end guide — terse edition (no code)

1. **Workstation setup**

   * Install Node 22 LTS (with nvm); enable *corepack* and pnpm 8.
   * Install Python 3.13 (pyenv or system).
   * Install Docker Desktop 27 and git ≥ 2.40.

2. **Repo layout**

   * Monorepo root using **pnpm workspaces**.
   * `apps/web` → Next 15 + Tailwind 4 frontend.
   * `apps/api` → FastAPI 0.115 backend.
   * `packages/prisma` → one Prisma schema + generated client shared by both services.

3. **Database layer**

   * Single `DATABASE_URL` (PostgreSQL 17.5).
   * Prisma migrations own the schema; FastAPI uses async psycopg 3 for reads/writes.
   * Both containers point at the same Postgres instance to avoid divergence.

4. **Containerisation**

   * **Docker Compose** with three services:

     * **db**: official `postgres:17.5-alpine`, health-checked via `pg_isready`.
     * **web**: `node:22-slim`, runs Next dev/build.
     * **api**: `python:3.13-slim`, runs Uvicorn.
   * Compose dependencies: web & api wait for db healthy.

5. **Configuration & secrets**

   * `.env` file for local; identically named variables in Vercel/Render for prod.
   * Besides `DATABASE_URL`, expose `NEXT_PUBLIC_API_BASE` to the browser.

6. **Local dev loop**

   * Bring up Postgres, run `prisma migrate dev` to create/seed.
   * Start Compose; hot-reload on both services.
   * Verify FastAPI at `/docs` and UI at `localhost:3000`.

7. **Deployment flow**

   * **Frontend** → Vercel (auto-detect Next 15).
   * **Backend** → Render (Docker web service) or similar.
   * **Database** → managed Postgres (Supabase, Neon, RDS).
   * Automatic Prisma migration on main branch (GitHub Action) before Vercel promotion.

8. **CI/CD essentials**

   * Lint & type-check with ESLint 9 + TypeScript 5.8 in GitHub Actions.
   * Run `prisma generate` and unit tests in a single job.
   * Separate job on `main` executes `prisma migrate deploy` against prod DB.
   * Enable Renovate (or Dependabot) to track weekly Prisma and monthly Node 22 patches.

9. **Operational tips**

   * Health-checks stop race conditions during cold starts.
   * Leave Turbopack disabled in production until Next marks it stable.
   * Watch React Compiler GA—will require React 19 semantics.
   * Raise Postgres connection limit (≥ 100) once you enable Prisma pooling.

Follow these nine steps and the matrix above: you’ll have a unified, containerised stack that compiles, runs, and deploys without version-mismatch surprises.

[1]: https://nodejs.org/en/about/previous-releases?utm_source=chatgpt.com "Node.js Releases"
[2]: https://nextjs.org/blog/next-15-3?utm_source=chatgpt.com "Next.js 15.3"
[3]: https://github.com/microsoft/typescript/releases?utm_source=chatgpt.com "Releases · microsoft/TypeScript - GitHub"
[4]: https://tailwindcss.com/blog/tailwindcss-v4?utm_source=chatgpt.com "Tailwind CSS v4.0"
[5]: https://github.com/prisma/prisma/releases?utm_source=chatgpt.com "Releases · prisma/prisma - GitHub"
[6]: https://react.dev/blog/2024/12/05/react-19?utm_source=chatgpt.com "React v19"
[7]: https://www.python.org/downloads/release/python-3132/?utm_source=chatgpt.com "Python Release Python 3.13.2"
[8]: https://pypi.org/project/fastapi/?utm_source=chatgpt.com "fastapi - PyPI"
[9]: https://docs.docker.com/engine/release-notes/27/?utm_source=chatgpt.com "Engine v27 - Docker Docs"
[10]: https://www.postgresql.org/about/news/postgresql-175-169-1513-1418-and-1321-released-3072/?utm_source=chatgpt.com "PostgreSQL 17.5, 16.9, 15.13, 14.18, and 13.21 Released!"
