# Executive report — live Supabase (`nvdlhrodvevgwdsneplk`)

**Verdict:** reuse this project’s **org / brand / CRM / planner / shoot / talent** model and RPCs. Do **not** point a new CopilotKit+Mastra app at production `mastra.*` until preview storage + golden persist/403 pass. Do **not** copy the ~681-line Copilot runtime.

**Will the new setup succeed?** **YES AFTER FIXES**

**Confidence:** **82%** (catalog + advisors + repo clients verified; no RLS policy-unit tests executed in this pass; `@mastra/pg` contract still needs install-time type check IPI-V2-005B).

## Scores

| Area | /100 | Why |
|------|------|-----|
| Overall Supabase | **71** | Strong tenancy helpers and domain schemas; FashionOS leftovers and two shoot models drag the score. |
| Security | **72** | Org RLS is real. `get_brand_assets` checks `auth.uid()` (not a proven leak) but **anon EXECUTE** remains. Leaked-password off. JWT-off Edge is gated. Chatbot tables fail-closed. |
| Data model | **73** | `organizations` → `org_members` → `brands` is the product spine. Duplicate `public.shoots` vs `shoot.shoots`. Events/tickets are legacy FashionOS. |
| RLS | **74** | Member helpers + planner `is_at_least` are production-worthy. `mastra` `USING (true)` is OK because the schema is **not** on the Data API. `shoot.shot_type_references` SELECT `true` is a catalog, not tenant data. |
| Performance / indexes | **61** | Advisor: many unindexed FKs (`planner.assignments.user_id`, talent booking actor columns, `planner.tasks.phase_id`). `planner.phases` ~64k rows vs ~5.8k workflows. |
| New iPix reuse | **78** | Keep DB + RPCs + Edge brand crawl. Rebuild chat runtime. Isolate Mastra writes. |

## Top P0 / P1

| ID | Sev | Problem |
|----|-----|---------|
| S-01 | P1 | `public.get_brand_assets` is SECURITY DEFINER and still **anon-executable**; body already rejects null `auth.uid()` + checks org. Revoke grant anyway. |
| S-02 | P1 | Chatbot / firecrawl helper tables: RLS on, **no policies** (PostgREST sees empty; only service role works). Easy to mis-wire a client. |
| S-03 | P1 | `public.shoots` still uses **designer_id** RLS (8 rows) while product shoots live in **`shoot.shoots`** (org via brand). New app must not treat `public.shoots` as the shoot SoT. |
| S-04 | P1 | Production `mastra` has **~6k workflow snapshots** and **~6k schedule_triggers** vs **45 threads**. New store `disableInit: true` + preview schema/branch first. |
| S-05 | P1 | Auth leaked-password protection **disabled** (advisor). |
| S-06 | P1 | Edge: `health`, `capture-lead`, `firecrawl-webhook` JWT off — webhook/signature must stay the real gate. |

## Fixes in order (no production Mastra writes)

1. Revoke `anon`/`public` EXECUTE on `get_brand_assets` (defense in depth). Audit other DEFINER grants; do not disable Planner RPCs.
2. Name the shoot SoT: **`shoot.*` + RPCs**. Freeze `public.shoots`.
3. Default-revoke future function EXECUTE; enable leaked-password protection; document deny-all chatbot tables (no `USING (true)`).
4. Provision **preview** Postgres/`mastra` (branch preferred). Pin `@mastra/pg` on that env only.
5. New app: cookie SSR + server-derived org. Never trust client `orgId` for writes.
6. Port planner HITL through existing `planner_*` RPCs after golden chat.
7. Edge: keep Firecrawl + brand-intelligence; do not duplicate Gemini through both Edge and Mastra without a documented split.
8. Index pass **after** query plans from the new app (do not add indexes in this audit).

## KEEP / PORT / REBUILD (Supabase)

| Area | Class | Note |
|------|--------|------|
| Auth (GoTrue) + `profiles` + `organizations` + `org_members` | **KEEP + HARDEN** | Share production Auth only if preview uses same project with RLS; else branch. |
| `is_org_member` / owner / editor helpers | **KEEP** | `(SELECT auth.uid())` pattern. |
| `brands`, scores, crawl, graph | **KEEP** | Brand Intelligence Edge stays. |
| CRM (`crm_*`) + `crm_convert_deal` | **KEEP** | |
| `planner.*` + `planner_*` RPCs | **KEEP + HARDEN** | Exposed in API `schemas`. Assignments SELECT is manager+ — keep `planner_get_my_assignment`. |
| `shoot.*` + commit/get RPCs | **KEEP** | Canonical production shoots. |
| `talent.*` + booking RPCs | **KEEP** | |
| `mastra.*` | **DEFER writes** / **PORT contract** | Read-only reuse of shape; new runtime → preview first. |
| `public.shoots`, events, tickets, venues | **DEFER / REMOVE from new UI** | Do not extend for MVP. |
| Copilot 681-line route / Worker PG shims | **REMOVE** | Starter `createCopilotRuntimeHandler`. |
| Duplicate Vite `src/` Supabase client | **REMOVE** after IPI-89 | Canonical: `app/src/lib/supabase/{client,server,operator-client,session}.ts`. |

## Core → MVP → Post-MVP (data)

| Phase | Supabase |
|-------|----------|
| **Core** | Auth + org resolution from server. Read `brands` / CRM as needed. **Preview** `PostgresStore` (`mastra` schema, `disableInit: true`). Golden persist + Org B 403. |
| **MVP** | Planner instance RPCs + HITL writes. `shoot.shoots` UI. Brand crawl Edge. No production thread cutover. |
| **Post-MVP** | Talent booking RPCs. Realtime planner. Optional Auth share vs branch. Index/advisor cleanup. FashionOS table quarantine. |

## Production-ready checklist (new app)

- [ ] `get_brand_assets` anon EXECUTE revoked
- [ ] Shoot SoT documented in app types (`shoot` schema)
- [ ] Preview Mastra store proven; `MASTRA_SCHEMA` required (no silent `public`)
- [ ] Org from JWT/`org_members`, not client spoof
- [ ] Service role never in browser; Edge/webhooks only
- [ ] `npm run supabase:verify-rls` still green after any policy change
- [ ] Advisors re-run after migrations
- [ ] Installed `@mastra/pg` constructor matches live code (`schemaName`, `disableInit`)

## Codebase classification (this repo)

| Area | Class |
|------|--------|
| `app/src/lib/supabase/*` SSR split | **KEEP** |
| Service-role in API (bookings/webhooks) | **KEEP + HARDEN** — never leak to CF worker env (already tested) |
| Generated types | **PORT** — regenerate via **CLI** not MCP-only public schema |
| Migrations | **KEEP as canonical history**; new repo should **link** this project or dump selected schemas — do not invent a second org model |
| Hard-coded project IDs in app | **Not found** in client factories (env URL/key) |
