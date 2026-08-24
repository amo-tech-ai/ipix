# Indexes (audit only — do not create)

Advisors 2026-08-24: many `unindexed_foreign_keys` at INFO. No index DDL in this audit.

## What is already in good shape

- Org-scoped tables typically index `org_id` / `brand_id` (brands, CRM, assets, campaigns).
- Planner: `workflows(org_id)`, `instances(org_id)`, `tasks(instance_id)`.
- `shoot.shoots(brand_id)`.
- Mastra: store-owned indexes (`mastra_threads_resourceid_createdat_idx`, message thread+created, snapshots, spans). **Do not add `public` Mastra indexes.**

## Missing FK indexes (advisor + targeted SQL)

High-value for Planner / talent / org queries:

| Table | Column | Why |
|-------|--------|-----|
| `planner.assignments` | `user_id` | “My instances” |
| `planner.tasks` | `phase_id`, `parent_task_id` | Phase board, subtasks |
| `planner.instances` | `owner_user_id` | Owner dashboards |
| `talent.bookings` | `requested_by`, `approved_by`, `cancelled_by` | Actor filters |
| `shoot.shoots` | `created_by` | Creator lists |

Low priority until EXPLAIN shows seq scans: FashionOS event FKs.

## Mastra / chat lookups

Existing: `resourceId` + `createdAt` on threads. New Core queries should use that, not a new `public.threads` table.

Do **not** index `mastra` from app migrations; ownership is Mastra `disableInit: true` + DBA.

## Unused / duplicate

Not proven without `pg_stat_user_indexes`. Treat advisor unused-index lints as **unverified** until staging stats.

## New iPix

1. Ship Core with current indexes.
2. After Planner UI in preview, EXPLAIN org-scoped instance/task lists.
3. Add covering indexes in a **dedicated** migration (one concern).
