# Playwright project: folder structure and what to put where

This document explains how the Transaction Management Playwright repo is organized and what your team should add in each place.

---

## 1. Big picture

| Area | Role |
|------|------|
| **`env/`** | **Environment files** live here: committed template + local `.env` (see §2). |
| **Root config** | How Playwright runs (browsers, timeouts, `baseURL`, reporters). |
| **`src/`** | Shared automation code: **page objects** and **environment config** (not test cases). |
| **`tests/transactions/`** | **All automated test cases**, one folder per testcase id (`TM_TC01` … `TM_TC16`). |
| **Generated** | `playwright-report/`, `test-results/` — created when you run tests; do not commit as source of truth. |

Playwright is configured so **`testDir`** is `tests/transactions`. Any file matching `*.spec.ts` under that folder (including inside `TM_TC**` subfolders) is a test file.

---

## 2. Repository tree (what matters day to day)

```text
project-root/
  package.json              ← npm scripts (npm test, etc.)
  playwright.config.ts      ← Playwright global settings
  tsconfig.json             ← TypeScript + path aliases (@src, @tests)

  env/
    .env.example            ← Committed template (variable names + safe defaults)
    .env                    ← Your machine only: copy from .env.example (gitignored)

  src/
    config.ts               ← Loads env/.env first, else root .env (see §3)
    pages/                  ← Page object classes (one screen/area per file when useful)
      home.page.ts          ← Example page object (replace/extend for your app)

  tests/
    transactions/           ← ONLY place for test specs (see below)
      utils/
        test-tags.ts        ← Shared tags like @smoke, @e2e, @api for filtering
      TM_TC01/
        TM_TC01.spec.ts     ← Testcase TM_TC01
      TM_TC02/
        TM_TC02.spec.ts
      …
      TM_TC16/
        TM_TC16.spec.ts

  .github/workflows/
    playwright.yml          ← CI: install deps, browsers, run tests
```

---

## 3. Root files

### `playwright.config.ts`

**Purpose:** Global test runner settings (parallelism, retries on CI, reporters, default `baseURL`, trace/screenshot/video on failure).

**Team:** Change only when you need different browsers, timeouts, or reporters. Day-to-day testcase work happens in spec files, not here.

### `tsconfig.json`

**Purpose:** TypeScript compilation and import shortcuts:

- `@src/*` → `src/*` (e.g. `import { config } from "@src/config"`).
- `@tests/*` → `tests/transactions/*` (e.g. `import { tags } from "@tests/utils/test-tags"`).

**Team:** Rarely edited; add path aliases only if you introduce new shared roots.

### `env/.env` and `env/.env.example`

**Purpose:** Keep environment configuration in one visible folder. No secrets in git.

| File | In git? | Who creates it |
|------|---------|----------------|
| **`env/.env.example`** | Yes | Maintainers update when new variables are added. |
| **`env/.env`** | No (gitignored) | Each developer: copy template → `.env`, then edit values. |

**Load order** (`src/config.ts`): `env/.env` if it exists, otherwise **legacy** `.env` at repo root (still supported), otherwise default `dotenv` behavior.

Typical variables (see `env/.env.example`):

- **`BASE_URL`** — Web app under test (used as Playwright `baseURL`; use relative paths in tests like `page.goto("/login")`).
- **`API_BASE_URL`** — Base URL for API checks in tests.
- **`HEADLESS`** — `true` / `false` for headed vs headless locally.
- **`CI`** — Usually set by CI; enables stricter behavior (e.g. `forbidOnly`, retries).

**Team:** After clone, run `copy env\.env.example env\.env` (Windows) or `cp env/.env.example env/.env` (macOS/Linux), then edit `env/.env`.

### `package.json` (scripts)

**Purpose:** Short commands for the team.

Common commands:

- **`npm test`** — Run all Playwright tests.
- **`npm run test:headed`** — Run with visible browser.
- **`npm run test:ui`** — Playwright UI mode (debugging).
- **`npm run test:api`** — Run only the `TM_TC16` folder (API example; adjust if you move API tests).
- **`npm run test:smoke` / `test:e2e`** — Filter by tag (`@smoke`, `@e2e`) when you use those tags in test titles.
- **`npm run report`** — Open the last HTML report.
- **`npm run pw:install`** — Install browser binaries (after clone or Playwright upgrade).

---

## 4. `src/` — automation code (not “test scripts”)

### `src/config.ts`

**Purpose:** Load `env/.env` (or legacy root `.env`) and expose a small `config` object (`baseUrl`, `apiBaseUrl`, `headless`, `isCI`).

**Team:** Use `import { config } from "@src/config"` in tests when you need URLs or flags. Do not hardcode production URLs in many files; prefer env + `config`.

### `src/pages/` (page objects)

**Purpose:** Encapsulate **how** to interact with a page: locators, navigation, reusable actions (e.g. `login()`, `openTransaction(id)`).

**Team should put here:**

- Selectors and user-like actions for a screen or feature.
- Assertions that belong to “the page is in state X” if they are reused.

**Team should not put here:**

- Full end-to-end scenarios that belong to a single testcase (those stay in `TM_TC**/*.spec.ts`).
- Raw copy-paste of 50 lines from a spec; refactor into methods on a page object instead.

**Naming:** One class per meaningful area, e.g. `LoginPage`, `TransactionListPage`. Import them from specs and call methods; keep specs readable (“what we verify”) and page objects detailed (“how we click/type”).

---

## 5. `tests/transactions/` — all test cases

### `tests/transactions/utils/`

**Purpose:** Small shared pieces **used by multiple testcases**, not tied to one `TM_TC**` folder.

**Examples:**

- `test-tags.ts` — Constants for `@smoke`, `@e2e`, `@api` so titles stay consistent.
- Later: shared helpers (date builders, tiny wait helpers) if truly cross-cutting.

**Team should put here:**

- Utilities imported by **several** testcase folders.

**Team should not put here:**

- Logic that belongs to one testcase only (keep it next to that testcase or in a page object).

---

### `tests/transactions/TM_TC01` … `TM_TC16`

**Purpose:** **One folder per testcase** from your test plan. This keeps ownership clear and avoids one giant file.

**What to write in each folder**

| You add | Description |
|---------|-------------|
| **`TM_TCxx.spec.ts`** | Main spec for that id (required naming pattern today: matches folder, e.g. `TM_TC01/TM_TC01.spec.ts`). |
| **Extra `*.spec.ts` files** | Optional: e.g. `TM_TC01/TM_TC01-negative.spec.ts` if one testcase has several spec files. |
| **Non-spec `.ts` files** | Optional: helpers used only by this testcase (e.g. `TM_TC01/data.ts`). Playwright does **not** run these as tests unless they are `*.spec.ts`. |

**What goes inside a spec file**

1. **`test.describe("TM_TCxx", () => { ... })`** — Groups tests for that testcase (recommended).
2. **`test("…", async ({ page }) => { … })`** — The actual steps and assertions.
3. Use **`page.goto("/…")`** with paths relative to `BASE_URL` when the app is web-based.
4. Prefer **`import { SomePage } from "@src/pages/…"`** and call page object methods instead of duplicating selectors.
5. For API-only steps, use **`request`** from Playwright’s API testing fixtures (`async ({ request }) => { … }`).
6. Remove **`test.skip`** once the testcase is implemented and stable.

**Tags (optional but useful)**

Include `@smoke` or `@e2e` in the **test title** string if you want to filter, e.g.:

`test("@smoke TM_TC01: login succeeds", async ({ page }) => { … });`

**Ownership**

- Assign each `TM_TC**` folder to a person or pair.
- Keep testcase documentation (preconditions, steps, expected result) in your test management tool or next to the spec in comments at the top of the file.

---

## 6. Generated folders (do not treat as source)

| Folder | Purpose |
|--------|---------|
| **`playwright-report/`** | HTML report after a run (`npm run report`). |
| **`test-results/`** | Traces, screenshots, videos for failures (depending on config). |

These are in `.gitignore`; they are outputs, not places to “write” tests.

---

## 7. Quick checklist for authors

1. Pick the right **`TM_TC**`** folder for your testcase id.
2. Implement steps in **`TM_TCxx.spec.ts`**; remove `skip` when ready.
3. Add or extend **`src/pages/*`** when selectors/actions are reused.
4. Use **`BASE_URL` / `API_BASE_URL`** via **`config`** and **`env/.env`**, not hardcoded servers.
5. Run **`npm test`** before opening a PR; use **`npm run test:ui`** when debugging.

---

## 8. Where to get help

- [Playwright documentation](https://playwright.dev/docs/intro)
- Project **`README.md`** — setup and high-level structure
- This file — **folder-by-folder responsibilities** for the team

If you change conventions (e.g. more than 16 testcases), add new folders **`TM_TC17`**, **`TM_TC18`**, … following the same pattern: one folder per id, primary spec `TM_TCxx.spec.ts`.
