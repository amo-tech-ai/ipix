# Contributing

Canonical repository: [amo-tech-ai/ipix](https://github.com/amo-tech-ai/ipix).

## Local development

1. Copy `.env.example` to `.env` and set local keys (never commit `.env`).
2. `npm ci`
3. Run servers **separately**:
   - `npm run dev:ui` — Next.js on port 3000
   - `npm run dev:agent` — Mastra on port 4111
4. Do not run combined `npm run dev` (blocked until DEV-STAB-001 is fixed).
5. Do not run `npm run build` while either dev server is up.

## Pull requests

- One concern per PR and per commit.
- Prefer squash merge.
- CI must pass (`npm ci` + `npm run build`).
- Do not import the old `/home/sk/ipix` Worker/Mastra tree unless a current failure proves it is required.

See `AGENTS.md` for agent-facing conventions.
