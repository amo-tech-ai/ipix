# New iPix plan — ordered todo

**How to use:** work **top to bottom**. Do not skip Wave 0. Production `app/` stays live.  
**Detail tickets:** [12-task-roadmap.md](./12-task-roadmap.md)  
**Supabase evidence:** [data/00-executive-report.md](./data/00-executive-report.md) · **Wave 0 plan:** [data/supa-fix-plan.md](./data/supa-fix-plan.md)

Status: `todo` · `doing` · `blocked` · `done`

---

## Wave 0 — Harden live Supabase first (do this before new app work)

Like taking the spare lookbook key off the public hook, labeling the real shoot binder, then giving the new crew a **preview studio**.

**SQL and proof steps:** [data/supa-fix-plan.md](./data/supa-fix-plan.md)

| # | Task | What to do (plain English) | Done when | Status |
|---|------|----------------------------|-----------|--------|
| **0.1** | **IPI-V2-000 · SB-FIX-001 — Remove unnecessary anonymous execution from brand assets RPC** | Start here. Live advisor: `get_brand_assets` still anon-executable DEFINER. `REVOKE` from `public`/`anon`; keep `authenticated` + membership checks. | Anon EXECUTE denied; Org A own assets OK; Org B denied. | **todo ← start here** |
| **0.2** | **IPI-V2-000 · SB-FIX-002 — Audit public SECURITY DEFINER function grants** | Broader than “kill advisor noise”: 34 authenticated DEFINER RPCs (planner, bookings, talent, CRM, shoot). Matrix: browser need? EXECUTE role? DEFINER necessary? search_path? `auth.uid()`? org ownership? write idempotency? Do **not** mass-revoke. | PR table with those columns; only extras revoked. | todo |
| **0.3** | **IPI-V2-000 · SB-FIX-003 — Enable leaked-password protection** | Auth dashboard HaveIBeenPwned. | Advisor leaked-password warning gone. | todo |
| **0.4** | **IPI-V2-000 · SB-FIX-004 — Document backend-only deny-all tables** | Chatbot/Firecrawl already fail-closed. Optional `REVOKE ALL` from JWT roles. **Do not** add `USING (true)` or fake policies. | Comment in repo; Edge still uses service role. | todo |
| **0.5** | **IPI-V2-000 · SB-FIX-005 — Declare `shoot.shoots` the canonical shoot source** | New code uses `shoot.*` + shoot RPCs only. Freeze `public.shoots`. | Types/docs: no new `public.shoots` queries. | todo |
| **0.6** | **IPI-V2-000 · SB-FIX-006 — Verify every JWT-off Edge Function authentication gate** | Firecrawl HMAC = PASS. `capture-lead` proxy secret = PASS (later: distributed rate limit). `health` = no secrets. | Checklist in the PR. | todo |
| **0.8** | **IPI-V2-000 · SB-FIX-008 — Make future RPC execution fail closed by default** | Default privileges belong to the **creating role**. Live: `postgres` is tight; `supabase_admin` still grants anon/authenticated EXECUTE. Set `ALTER DEFAULT PRIVILEGES FOR ROLE …`. Prove with a test function on **preview**, not prod (`pg_default_acl`). | New function inaccessible until granted; creating role listed. | todo |
| **0.9** | **IPI-V2-000 · SB-FIX-009 — Lock mutable function search paths** | Fix **all three** advisor hits: `stamp_analysis_locked_at`, `set_updated_at`, `trigger_set_timestamps`. Inspect body; qualify relations if needed; `search_path = ''`. | Triggers still stamp; advisor path warnings gone. | todo |
| **0.7** | **IPI-V2-000 · SB-FIX-007 — Re-run advisors and RLS tests** | Isolation tests + classified advisor register. Success is **not** “dashboard all green.” Extensions in `public` and remaining DEFINER API notices may stay if justified. | Zero unexplained P0/P1; leftovers classified; 0.1 anon flag gone. | todo |
| **0.10** | **IPI-V2-000 · SB-FIX-010 — Create isolated persistent Supabase preview** | Persistent branch `ipix-v2`. Own DB/keys/Auth/Storage. **Empty by default — do not copy prod.** Billable compute. | Preview URL in Infisical; Wave 1 points here. | todo |
| **0.11** | **IPI-V2-000 · SB-FIX-011 — Seed deterministic preview orgs and test data** | After 0.10: QA user, Org A, Org B, brand, shoot, planner instance. Enables RLS + Copilot/Mastra gold tests. | Seed applied on preview only; Org B denied on Org A thread. | todo |

---

## Wave 1 — New app foundation (after Wave 0)

| # | Task | What to do (plain English) | Done when | Status |
|---|------|----------------------------|-----------|--------|
| 1.1 | **IPI-V2-001 · BOOT-001 — Create the parallel Next.js app from the CopilotKit Mastra starter** | New tree (`app-v2/` or worktree). Official starter only. Do not copy the ~681-line route. | Dev server shows starter chat; no production `app/` mix. | todo |
| 1.2 | **IPI-V2-002 · BOOT-002 — Pin one CopilotKit + Mastra package family** | Install the **compatible set**, not each package’s latest. | `npm ls` + typecheck clean; versions written in the PR. | todo |
| 1.3 | **IPI-V2-003 · RT-001 — Thin official CopilotKit route** | Stock handler + auth hook later. | `/api/copilotkit` streams; no Worker shims. | todo |
| 1.4 | **IPI-V2-004 · RT-002 — One page with CopilotKit provider** | `useAgent` on a single page. | Browser streams tokens. | todo |
| 1.5 | **IPI-V2-005 · MS-001 — In-process Mastra** | Same Node process as Next. | One `npm run dev`; no Cloudflare in this file. | todo |

---

## Wave 2 — Preview database, auth, org

| # | Task | What to do (plain English) | Done when | Status |
|---|------|----------------------------|-----------|--------|
| 2.1 | **IPI-V2-005B · DB-001 — Diff `@mastra/pg` vs preview schema** | Compare installed store contract to preview DB. Do **not** connect production `mastra` yet. | MATCH / NEW / CHANGED table written. | todo |
| 2.2 | **IPI-V2-006 · PG-001 — PostgresStore on preview `mastra` only** | `schemaName` from env (required). `disableInit: true`. | Chat rows appear in **preview** `mastra.mastra_threads` / messages. | todo |
| 2.3 | **IPI-V2-007 · AUTH-001 — Supabase Auth on the new app** | Same Auth project; cookie SSR; no `demo-user`. | Unauthenticated Copilot route → 401. | todo |
| 2.4 | **IPI-V2-008 · AUTH-002 — Organization membership fail-closed** | Server reads `org_members`. Build `resourceId` as `org:{orgId}:user:{userId}`. | User with no org cannot chat; client `orgId` cannot spoof writes. | todo |

---

## Wave 3 — Planner chat + isolation proof

| # | Task | What to do (plain English) | Done when | Status |
|---|------|----------------------------|-----------|--------|
| 3.1 | **IPI-V2-009–017 · PLAN-CHAT — One Production Planner + thread locator + 403** | One planner agent. Tools call existing `planner_*` RPCs (user JWT), not service-role table writes. | Planner page chats; other org gets 403. | todo |
| 3.2 | **IPI-V2-018 · GOLD-001 — Golden persist test** | Unique `TEST-<uuid>` → stream → SQL → refresh → restart → Org B 403. | SQL + browser proof on **preview** storage. | todo |

**Stop line:** no Operator shell / Brand / Shoots UI port until 3.2 is green.

---

## Wave 4 — Product UI (port, don’t rewrite)

| # | Task | What to do (plain English) | Done when | Status |
|---|------|----------------------------|-----------|--------|
| 4.1 | **IPI-V2-UI-001 — Operator shell** | Port layout/nav from current iPix. | Signed-in operator lands in `/app`. | todo |
| 4.2 | **IPI-V2-UI-002 — Brand Hub** | Read `brands`; crawl via existing Edge. | Operator can open a brand lookbook. | todo |
| 4.3 | **IPI-V2-UI-003 — Shoots on `shoot.shoots`** | RPCs only; never `public.shoots`. | Shoot detail matches production shoot schema. | todo |
| 4.4 | **IPI-V2-UI-004 — Assets + CRM** | Existing tables + RLS. | Lists respect org. | todo |

---

## Wave 5 — HITL, bookings, polish (after golden chat)

| # | Task | What to do (plain English) | Done when | Status |
|---|------|----------------------------|-----------|--------|
| 5.1 | **IPI-V2-HITL-001 — Planner gate approve/discard** | `planner_approve_gate` / `planner_discard_gate` + idempotency key. | Approve in UI writes Supabase; refresh shows it. | todo |
| 5.2 | **IPI-V2-BOOK-001 — Talent booking RPCs** | `create_booking_request` / `transition_booking`. | Booking status changes via RPC. | todo |
| 5.3 | **IPI-V2-SB-IDX-001 — Index pass** | Only after EXPLAIN from the new app (`planner.assignments.user_id`, etc.). | Migration with measured queries. | todo |

---

## Explicitly later / not this list

| Do not do yet | Why |
|---------------|-----|
| Point new app at **production** `mastra.*` | Wave 2–3 must pass first |
| Cloudflare Worker chat | ADR: Node/Vercel first |
| New `public` AI thread tables | Mastra schema owns memory |
| Copy 681-line Copilot route | Starter replaces it |
| Add indexes in Wave 0 | Fix security first; indexes after real queries |

---

## Suggested first PRs (Wave 0)

Split is in [data/supa-fix-plan.md](./data/supa-fix-plan.md). **First git PR:** 0.1 revoke only. **Dashboard:** 0.3. **Last before BOOT:** 0.10 preview + **0.11 seed**. No `app-v2` code in Wave 0 PRs.
