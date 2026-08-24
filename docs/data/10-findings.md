# Findings (severity)

Evidence: live SQL, Supabase advisors 2026-08-24, `app/src/lib/supabase/*`, `supabase/config.toml`, Edge function tree. **No production mutations.**

## P0

None for a confirmed data leak. **P0 for the new runtime:** do not write production `mastra.*` until preview exists ([supa-fix-plan.md](./supa-fix-plan.md) §0.10).

## P1

### S-01 `get_brand_assets` anon EXECUTE — **not a proven leak**

**Problem:** Anonymous REST can still **EXECUTE** a SECURITY DEFINER RPC (`anon` grant live 2026-08-24).  
**Why it is not P0:** live body raises if `auth.uid() is null`, then checks brand owner / `is_org_member`, then shoot∈brand. Advisor overstated “data leak.”  
**Why still fix:** defense in depth; [Supabase function privileges](https://supabase.com/docs/guides/database/functions). Older migrations already revoked `public` + granted `authenticated`; `CREATE OR REPLACE` restored `anon`.  
**Fix:** see [supa-fix-plan.md](./supa-fix-plan.md) §0.1.  
**Effort:** S

### S-02 Chatbot tables RLS, zero policies

**Problem:** Fail-closed for JWT roles; only service role works. Easy to “fix” with `USING (true)`.  
**Why:** Next engineer wires a browser client and sees empty data or opens the table.  
**Evidence:** Advisor `rls_enabled_no_policy`; live grants: JWT roles have **no SELECT**; `service_role` has DML.  
**Fix:** Document as backend-only; optional `REVOKE ALL` from `anon`/`authenticated`. **Do not** add `USING (true)` or fake service-role policies.  
**Effort:** S

### S-03 Dual shoot models

**Problem:** `public.shoots` (designer_id, ~8 rows) vs `shoot.shoots` (org via brand).  
**Why:** New UI on the wrong table = empty or wrong security.  
**Evidence:** Catalog + policies.  
**Fix:** Types and queries only on `shoot`. Freeze public.  
**Effort:** M (app) / S (docs)

### S-04 Production Mastra bloat + version drift

**Problem:** 6k snapshots/triggers; new `@mastra/pg` may not match 34-table live contract.  
**Why:** `disableInit: false` on prod could migrate/destroy; Worker-style snapshots already hurt.  
**Evidence:** Counts; 01 audit.  
**Fix:** Preview store; pin package family; `disableInit: true` on prod.  
**Effort:** M

### S-05 Leaked password protection off

**Evidence:** Advisor `auth_leaked_password_protection`.  
**Fix:** Enable in Auth settings.  
**Effort:** S · dashboard only

### S-06 JWT-off Edge + definer RPC surface

**Problem:** Public Edge is fine with HMAC; combining with open RPCs is not.  
**Fix:** Inventory `GRANT EXECUTE` on public RPCs; webhook secrets rotation.  
**Effort:** M

## P2

- Unindexed FKs on planner assignments/tasks, talent booking actors (`03-indexes.md`).
- `planner.phases` ~64k vs ~5.8k workflows.
- Extensions in `public`; mutable `search_path` on timestamp triggers.
- Duplicate clients: Vite vs `app/` (IPI-89).
- Empty GitHub `amo-tech-ai/ipix` — nothing to audit there; PORT from this repo.

## P3

- FashionOS events/tickets still in `public`.
- Shopify/Amazon tables unused by MVP.
- Advisor noise on every authenticated DEFINER RPC (0029).

## What is correct (don’t redesign)

- Org membership RLS helpers.
- Planner RPCs + `planner_get_my_assignment`.
- `shoot` schema as product shoot SoT.
- `mastra` private schema + runtime role.
- Operator client = anon + user JWT (RLS applies).
- Mercur not cloned into Supabase.
- Node/CopilotKit starter + server `resourceId` (existing ADRs).
