# Wiring and data flows

## Frontend → backend map

| UI | Path | Table / fn | Update |
|----|------|------------|--------|
| Login | Auth callback | `auth.users`, `profiles` | Session cookie |
| Brand Hub | RSC + `operator-client` + Edge `brand-intelligence` / crawl | `brands`, crawl tables | Refresh query |
| Assets | Client + `audit-asset-dna` | `assets` | DNA columns |
| CRM | Client CRUD + `crm_convert_deal` | `crm_*` | Board |
| Planner | Client + `planner_*` RPCs | `planner.*` | Realtime optional |
| Shoot | `commit_shoot_draft` / `get_shoot_detail` | `shoot.*` | Detail page |
| Booking | `create_booking_request` / `transition_booking` | `talent.bookings` | Status |
| Copilot | **Today:** fat route · **New:** starter handler → Mastra → `PostgresStore` | `mastra.*` | Thread persist |
| HITL | RPC `planner_approve_gate` | `gate_approvals`, tasks | Board |

**Unnecessary hop today:** Copilot route reimplements storage/auth. **Replace** with official handler; keep RPCs for domain writes.

Mastra tools that `UPDATE planner.tasks` via service role = **wrong hop**. Use RPC as the user.

---

## 1. Login + org

```mermaid
flowchart TD
  A[Operator opens login] --> B[Supabase Auth PKCE]
  B --> C[auth.users]
  C --> D[handle_new_user profiles]
  D --> E[Read org_members]
  E --> F{Membership?}
  F -->|No| G[Onboarding / create org]
  F -->|Yes| H[Server sets activeOrgId]
  H --> I[Load brands for that org]
  I --> J[Copilot resourceId from server]
```

---

## 2. Brand → shoot → assets

```mermaid
flowchart TD
  A[Brand Hub] --> B[brands RLS org]
  B --> C[Create shoot via commit_shoot_draft]
  C --> D[shoot.shoots]
  D --> E[shot_list / deliverables]
  D --> F[assets.brand_id]
  F --> G[audit-asset-dna Edge]
  G --> H[assets DNA columns]
```

---

## 3. Production Planner chat

```mermaid
flowchart TD
  A[Planner page + Copilot] --> B[Server org + instance id]
  B --> C[Mastra planner agent]
  C --> D[Tool planner_update_task RPC]
  D --> E[planner.tasks]
  C --> F[PostgresStore threads]
  F --> G[mastra.mastra_threads]
  A --> H[Direct UI also calls same RPC]
```

---

## 4. CopilotKit → AG-UI → Mastra → PostgresStore

```mermaid
flowchart LR
  UI[CopilotChat] --> RT[createCopilotRuntimeHandler]
  RT --> AG[AG-UI Mastra adapter]
  AG --> M[In-process Mastra]
  M --> S[PostgresStore schemaName mastra]
  S --> PG[(Preview mastra schema)]
  M --> T[Tools JWT RPC]
  T --> SB[(public / planner RLS)]
```

---

## 5. HITL → Supabase write

```mermaid
flowchart TD
  A[Agent proposes gate] --> B[Copilot HITL UI]
  B --> C[User approve]
  C --> D[planner_approve_gate idempotency_key]
  D --> E{Member + role?}
  E -->|No| F[Error no write]
  E -->|Yes| G[gate_approvals + tasks]
  G --> H[UI invalidate]
```

---

## 6. Brand Intelligence

```mermaid
flowchart TD
  A[Paste URL] --> B[brand-intelligence Edge]
  B --> C[Gemini direct]
  C --> D[brands / scores]
  A --> E[start-brand-crawl]
  E --> F[Firecrawl]
  F --> G[firecrawl-webhook HMAC]
  G --> H[brand_crawls / results]
```

---

## 7. Booking

```mermaid
flowchart TD
  A[Search talent RPC] --> B[talent_profiles]
  A --> C[create_booking_request]
  C --> D[talent.bookings]
  D --> E[transition_booking]
  E --> F[booking_status_history]
  E --> G[Optional shoot.shoots link]
```
