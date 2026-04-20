# Playwright Starter (Scalable)

A simple, team-friendly Playwright + TypeScript test framework with folder conventions you can scale.

**Team guide (folder structure and what to write where):** [docs/PLAYWRIGHT_TEAM_GUIDE.md](docs/PLAYWRIGHT_TEAM_GUIDE.md)

## Stack

- Playwright Test
- TypeScript
- Dotenv for environment settings
- GitHub Actions for CI

## Project Structure

All Playwright tests live under **`tests/transactions/`**. Each testcase has its own folder **`TM_TC01` … `TM_TC16`** and one primary spec file (you can add more `.spec.ts` files in the same folder if needed).

```text
env/
  .env.example             ← committed template
  .env                     ← local only (gitignored); copy from .env.example
tests/
  transactions/
    utils/                 ← tags, helpers (optional)
    TM_TC01/
      TM_TC01.spec.ts
    TM_TC02/
      TM_TC02.spec.ts
    … TM_TC16/
src/
  pages/
  config.ts                ← loads env/.env (or root .env as fallback)
```

Also:

- `playwright.config.ts`: `testDir` points at `tests/transactions`

## Setup

1. Install dependencies:
   - `npm install`
2. Install browser binaries:
   - `npm run pw:install`
3. Copy `env/.env.example` to `env/.env` and update values (see [docs/PLAYWRIGHT_TEAM_GUIDE.md](docs/PLAYWRIGHT_TEAM_GUIDE.md)).

## Run Tests

- All tests: `npm test`
- Smoke (tag `@smoke`): `npm run test:smoke`
- E2E-style (tag `@e2e`): `npm run test:e2e`
- API only: `npm run test:api`
- Headed mode: `npm run test:headed`
- UI mode: `npm run test:ui`
- Open report: `npm run report`

## Scaling Tips

- Keep selectors inside page objects (`src/pages`), not inside spec files.
- Use Playwright’s built-in `test.extend` in a small helper file if many tests share the same setup.
- Tag tests consistently (`@smoke`, `@e2e`, `@api`) for easier filtering.
- Add more projects in `playwright.config.ts` for cross-browser coverage when needed.
