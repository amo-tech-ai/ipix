# Agent instructions

This is the canonical iPix CopilotKit + Mastra runtime: [amo-tech-ai/ipix](https://github.com/amo-tech-ai/ipix).

- Cursor rules: `.cursor/rules/`
- Claude skills: `.claude/skills/` (Cursor reads the same tree via `.cursor/skills` → symlink)
- Graphify graph: `graphify-out/graph.json` (query before broad codebase search)
- Dev servers: `npm run dev:ui` and `npm run dev:agent` in separate terminals. Combined `npm run dev` is blocked (DEV-STAB-001).
- Do not write production Supabase during audits or Core Mastra work.
- One concern per commit and per PR.
