# Schemas and tables

**Project:** `nvdlhrodvevgwdsneplk` · **2026-08-24** · read-only

## API exposure (`supabase/config.toml`)

```toml
schemas = ["public", "graphql_public", "planner"]
extra_search_path = ["public", "extensions"]
```

| Schema | On PostgREST? | Purpose |
|--------|---------------|---------|
| `public` | Yes | Orgs, brands, CRM, assets, FashionOS leftovers, RPC wrappers |
| `planner` | Yes | Production Planner workflows/instances/tasks |
| `graphql_public` | Yes | GraphQL |
| `shoot` | **No** (SQL/RPC) | Canonical fashion shoots |
| `talent` | **No** (SQL/RPC) | Talent profiles + bookings |
| `mastra` | **No** | Mastra PostgresStore. Grants: `postgres` + `hyperdrive_mastra_runtime` only |
| `auth` | GoTrue | Users |
| `storage` | Storage API | Legacy buckets (bytes: Cloudinary for MVP) |
| `realtime`, `vault`, `cron`, `extensions` | Platform | |

**Missing in new GitHub `amo-tech-ai/ipix`:** empty repo — **all of this is PORT from this codebase**, not from the empty starter.

---

## Auth / orgs

| Schema.Table | Purpose | PK | Important FKs | RLS | Role |
|--------------|---------|----|---------------|-----|------|
| `auth.users` | Login identity | id | — | GoTrue | Auth |
| `public.profiles` | App profile sync | user id | → auth.users | Yes | Operator |
| `public.organizations` | Tenant | id | — | Yes | All product |
| `public.org_members` | Membership + role | id | org_id, user_id | Yes | Tenancy |
| `public.organizer_teams` / `_members` | FashionOS teams | id | — | Yes | Legacy events |

Approx: orgs **~5837**, members **~5863**, profiles **~12818**.

**KEEP + HARDEN.** New app: server derives org from `org_members`.

---

## Brands

| Schema.Table | Purpose | RLS | Class |
|--------------|---------|-----|--------|
| `public.brands` | Operator brand | org member | KEEP |
| `public.brand_scores` | DNA scores | org | KEEP |
| `public.brand_crawls` / `brand_crawl_results` | Firecrawl | org | KEEP |
| `public.brand_intake_drafts` | HITL intake | org | KEEP |
| `public.brand_graph_nodes` / `_edges` | Intel graph | org | KEEP |
| `public.brand_competitors`, `brand_social_channels`, `brand_agent_results` | Intel | org | KEEP |
| `public.commerce_product_links` | Mercur id link | org | KEEP (no catalog in SB) |

Approx brands **~5833**.

---

## Shoots (two models — flag)

| Schema.Table | Purpose | RLS | Rows (approx) | Class |
|--------------|---------|-----|---------------|--------|
| **`shoot.shoots`** | Product shoot | brand → org member | ~4 | **KEEP (SoT)** |
| `shoot.shoot_assets`, `shoot_crew`, `shoot_deliverables`, `shot_list`, `shot_deliverable_links` | Shoot graph | via shoot | small | KEEP |
| `shoot.shoot_intake_drafts` | Drafts | `submitted_by = auth.uid()` | | KEEP |
| `shoot.shot_type_references` | Catalog | SELECT `true` (authenticated) | | KEEP catalog |
| **`public.shoots`** | Legacy booking/designer | **designer_id** | ~8 | **DEFER / don’t use in new UI** |
| `public.shoot_assets`, `shoot_items`, `shoot_payments` | Legacy | mixed | | DEFER |

---

## Assets

| Table | Purpose | RLS | Class |
|-------|---------|-----|--------|
| `public.assets` | Metadata + DNA | org; anon SELECT false | KEEP |
| `public.asset_variants`, `asset_links`, `asset_events` | Variants | org | KEEP |
| `public.cloudinary_assets` | Cloudinary ids | org | KEEP |
| `public.media_size_specs` | Specs | RLS **no policy** | HARDEN |

---

## CRM

| Table | Purpose | Class |
|-------|---------|--------|
| `public.crm_companies` | Accounts | KEEP |
| `public.crm_contacts` | People | KEEP |
| `public.crm_deals` | Pipeline | KEEP |
| `public.crm_activities` | Timeline | KEEP |

---

## Planner

| Table | Purpose | Approx rows | Class |
|-------|---------|-------------|--------|
| `planner.workflows` | Template per org | ~5865 | KEEP |
| `planner.phases` | Template phases | **~64k** | KEEP (watch size) |
| `planner.instances` | Live plans | ~42 | KEEP |
| `planner.tasks` | Work items | ~131 | KEEP |
| `planner.assignments` | Instance roles | | KEEP |
| `planner.dependencies` | Task graph | | KEEP |
| `planner.gate_approvals` / `gate_conditions` | HITL | | KEEP |
| `planner.events` | Audit-ish | | KEEP |
| `planner.notification_rules`, `view_configs` | Config | | KEEP |

API-exposed: yes (`planner` in schemas).

---

## Talent / booking

| Table | Purpose | Approx | Class |
|-------|---------|--------|--------|
| `talent.talent_profiles` | Talent | ~5935 | KEEP |
| `talent.bookings` | Booking FSM | ~6183 | KEEP |
| `talent.talent_availability`, `talent_shortlists`, `_items`, `agency_talent`, `booking_status_history` | Support | | KEEP |
| `public.model_profiles`, `designer_availability`, `model_agencies` | FashionOS | | DEFER |

---

## Campaigns / commerce-adjacent

| Table | Class |
|-------|--------|
| `public.campaigns`, `campaign_deliverables` | KEEP if product uses them |
| Shopify / Amazon / Facebook / Instagram connection tables | DEFER unless MVP needs them |

---

## AI / Mastra

See [07-mastra-storage.md](./07-mastra-storage.md). 34 tables in `mastra` only. `public.ai_agent_logs`, `agent_decision_log`, `agent_context_snapshots` — **app logs, not Mastra memory**. Class: KEEP logs; do not treat as thread store.

---

## Other / FashionOS (do not extend for MVP)

`events`, `venues`, `ticket_tiers`, `registrations`, `payments`, `event_*`, `stakeholders`, `fashion_brands`, `platforms`, `call_times`, `tasks`/`task_assignees` (public, not planner).

**REMOVE from new product surface.** Keep in DB until a dedicated deprecation issue.

---

## Chatbot / marketing

`chatbot_conversations`, `chatbot_messages`, `chatbot_events`, `lead_intake_drafts`, `processed_firecrawl_webhooks` — Edge `capture-lead` / Firecrawl. RLS on, **no policies** → deny for anon/authenticated via API.

---

## Duplicate sources of truth

| Topic | Duplicates | Winner for new iPix |
|-------|------------|---------------------|
| Shoots | `public.shoots` vs `shoot.shoots` | **`shoot.shoots`** |
| Tasks | `public.tasks` vs `planner.tasks` | **`planner.tasks`** |
| AI memory | public agent_* vs `mastra.*` | **`mastra.*` (preview first)** |
| Commerce | Shopify tables vs Mercur | **Mercur** |
