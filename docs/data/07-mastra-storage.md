# Mastra storage (`mastra` schema)

**Live:** 34 tables · ~45 threads · ~101 messages · ~6140 `mastra_workflow_snapshot` · ~6078 `mastra_schedule_triggers` · `mastra_workflow_definitions` **exists, 0 rows** · **0** `public.mastra_*`

## Tables (all `mastra.*`)

Threads/messages/memory: `mastra_threads`, `mastra_messages`, `mastra_resources`, `mastra_observational_memory`  
Workflows: `mastra_workflow_snapshot`, `mastra_workflow_definitions`  
Agents/skills/prompts/MCP/datasets/experiments/workspaces/schedules/spans/favorites/scorers/channels/background_tasks — see 01 table list.

**No Postgres FKs.** RLS on; policy `hyperdrive_mastra_runtime_all` **USING true** for runtime role.

**Grants:** not `anon` / `authenticated`. Runtime = `postgres` or `hyperdrive_mastra_runtime`.

## vs installed `@mastra/pg`

Do **not** assume dashboard schema matches a newly installed major. **IPI-V2-005B:** diff live columns vs `PostgresStore` types **after** pin.

This repo’s production wiring (verify at implement time):

- `schemaName: process.env.MASTRA_SCHEMA` (**required**, never silent `public`)
- `disableInit: true` (no auto-migrate production)

Official docs may say `schema` / `disableInit` — **installed types win**.

## New iPix

| Decision | Choice |
|----------|--------|
| Preview writes | **Separate branch/project or `mastra_preview` schema** — not production threads day one |
| Migration owner | Mastra CLI/store in **preview only** until contract matches; prod stays `disableInit: true` |
| `public.mastra_*` | Forbidden |
| Dispatcher snapshot bloat | Do **not** port Worker snapshot fan-out; 6k snapshots are a cost/risk signal |

**KEEP AS-IS (prod schema)** + **new app DEFER connect** until golden test on preview.
