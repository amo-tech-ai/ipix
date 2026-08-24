# Functions, RPCs, triggers

All listed `SECURITY DEFINER` unless noted. New app should **call these**, not reimplement FSM in TypeScript.

## Reuse in Core / MVP (production-worthy)

| Function | Purpose | Caller | Authz | Notes |
|----------|---------|--------|-------|--------|
| `is_org_member` / `is_org_owner` / `is_org_editor_or_above` | RLS + RPC guards | Policies, other RPCs | uid vs `org_members` | KEEP |
| `planner_create_instance` | Start a plan | Operator API / Mastra tool | Must verify org | Idempotency key |
| `planner_update_task` | Patch task | Planner UI / agent | Instance membership | Optimistic `updated_at` |
| `planner_approve_gate` / `planner_discard_gate` | HITL | Planner / Copilot | Role + idempotency | **MVP after golden chat** |
| `planner_get_my_assignment` | Self role | UI | `auth.uid()` only | KEEP |
| `planner_invite_member` / `_update_role` / `_remove_assignment` | Sharing | UI | Manager/owner | KEEP |
| `planner_shift_task` | Date cascade | UI | Idempotency | KEEP |
| `commit_shoot_draft` / `get_shoot_detail` / `get_brand_assets` | Shoot graph | UI | Membership (**revoke anon** on get_brand_assets) | KEEP + HARDEN |
| `create_booking_request` / `transition_booking` / `confirm_booking` / `get_booking` / `list_bookings` | Booking FSM | UI | Org + talent | KEEP Post-MVP |
| `crm_convert_deal` | Pipeline | CRM | Org | KEEP |
| `search_brands` / `search_talent` | Retrieval | Agents | Org args | KEEP |
| `handle_new_user` / `auto_add_org_owner` | Signup | Triggers | DEFINER | KEEP |

## Triggers (important)

| Trigger fn | Purpose | Risk |
|------------|---------|------|
| `trg_organizations_ensure_planner_default` | Default workflow per org | KEEP |
| `block_brand_org_change` | Stop brand org hijack | KEEP |
| `crm_deals_guard_terminal_stage` | Deal FSM | KEEP |
| `talent.log_booking_status_change` | History | KEEP |
| `expire_stale_bookings` / `expire_stale_brand_analysis` | Cron-ish | KEEP |
| Planner: `prevent_task_instance_change`, `validate_dependency_instance`, `bootstrap_owner_assignment`, `broadcast_instance_change` | Integrity + realtime | KEEP |

## search_path

Many planner/public RPCs set `search_path = ''` or `planner, public` — **good**. Mutable path on timestamp triggers — **P2**.

## Do not duplicate in Mastra tools

Mastra tools should **RPC** `planner_*` / `transition_booking`, not write `planner.tasks` with service role.

## Skip / don’t expose in new Copilot surface

- FashionOS `create_default_event_phases`
- `identify_rls_policies_needing_optimization` (ops)
- Raw `capture_lead_write` except from Edge

## Failure / idempotency

Planner mutations take `p_idempotency_key`. New Copilot HITL must pass the same key on retry (operating rules).
