# Live Supabase architecture pack

**Project:** `nvdlhrodvevgwdsneplk` (dashboard name: fashionos)  
**Dashboard:** https://supabase.com/dashboard/project/nvdlhrodvevgwdsneplk  
**Audit date:** 2026-08-24  
**Mode:** read-only (MCP SQL + advisors + repo). **No production writes.**

This folder is the **data/SoT pack** for the new iPix rebuild. Product/runtime decisions stay in `docs/new-plan/` (Node first, CopilotKit Mastra starter, `mastra` schema, preview storage before production threads).

| File | Contents |
|------|----------|
| [00-executive-report.md](./00-executive-report.md) | Scores, P0/P1, KEEP/PORT matrix, Core→MVP |
| [01-schemas-tables.md](./01-schemas-tables.md) | Schemas, all tables, grouping, KEEP/PORT |
| [02-relationships-erd.md](./02-relationships-erd.md) | FKs + Mermaid ERDs |
| [03-indexes.md](./03-indexes.md) | Index notes — do not create yet |
| [04-rls-security.md](./04-rls-security.md) | RLS, advisors, org isolation |
| [05-functions-rpcs.md](./05-functions-rpcs.md) | SECURITY DEFINER RPCs + triggers |
| [06-edge-functions.md](./06-edge-functions.md) | Deployed Edge Functions |
| [07-mastra-storage.md](./07-mastra-storage.md) | `mastra` schema vs `@mastra/pg` |
| [08-auth-org.md](./08-auth-org.md) | Auth journey + recommended new-app split |
| [09-wiring-flows.md](./09-wiring-flows.md) | UI→API→table maps + data-flow Mermaid |
| [10-findings.md](./10-findings.md) | Severity-ranked findings |
| [11-table-inventory.md](./11-table-inventory.md) | Full live table name list |
| [supa-fix-plan.md](./supa-fix-plan.md) | Wave 0 harden plan (re-verified 2026-08-24 vs live advisor; +0.11 seed) |

**Canonical live Mastra counts** still live in [../01-current-state-audit.md](../01-current-state-audit.md). Spot-check 2026-08-24: **34 `mastra.*` tables**, **45 threads**, **~101–103 messages**, **0 rows** in `mastra.mastra_workflow_definitions`. **No `public.mastra_*` tables.**

**Commerce** is Mercur Postgres, not this project. Do not duplicate product/order tables here.
