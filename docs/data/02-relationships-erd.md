# Relationships and ERDs

Live FKs exist on org/brand/CRM/planner/shoot/talent. **`mastra.*` has no Postgres FKs** (Mastra store design). Isolation is `resourceId` in the app, not RLS JWT.

## Flags

| Issue | Evidence |
|-------|----------|
| Orphanable actor columns | Unindexed FKs: `planner.instances.owner_user_id`, `shoot.shoots.created_by`, `talent.bookings` requested/approved/cancelled_by |
| Duplicate shoot graphs | `public.shoot_*` vs `shoot.*` |
| Planner tasks | `phase_id`, `parent_task_id` FKs without covering indexes (advisor) |

---

## Core org / brand / shoot / assets

```mermaid
erDiagram
  AUTH_USERS ||--|| PROFILES : "id"
  ORGANIZATIONS ||--o{ ORG_MEMBERS : "org_members"
  AUTH_USERS ||--o{ ORG_MEMBERS : "joins"
  ORGANIZATIONS ||--o{ BRANDS : "brands"
  BRANDS ||--o{ BRAND_SCORES : "scores"
  BRANDS ||--o{ ASSETS : "library"
  BRANDS ||--o{ SHOOT_SHOOTS : "produces"
  SHOOT_SHOOTS ||--o{ SHOOT_ASSETS : "includes"
  SHOOT_SHOOTS ||--o{ SHOT_LIST : "shots"
  SHOOT_SHOOTS ||--o{ SHOOT_DELIVERABLES : "delivers"
  ASSETS ||--o{ ASSET_VARIANTS : "has"

  AUTH_USERS {
    uuid id PK
  }
  PROFILES {
    uuid id PK
  }
  ORGANIZATIONS {
    uuid id PK
  }
  ORG_MEMBERS {
    uuid id PK
    uuid org_id FK
    uuid user_id FK
    text role
  }
  BRANDS {
    uuid id PK
    uuid org_id FK
  }
  BRAND_SCORES {
    uuid id PK
    uuid brand_id FK
  }
  ASSETS {
    uuid id PK
    uuid brand_id FK
  }
  SHOOT_SHOOTS {
    uuid id PK
    uuid brand_id FK
  }
  SHOOT_ASSETS {
    uuid id PK
    uuid shoot_id FK
  }
  SHOT_LIST {
    uuid id PK
    uuid shoot_id FK
  }
  SHOOT_DELIVERABLES {
    uuid id PK
    uuid shoot_id FK
  }
  ASSET_VARIANTS {
    uuid id PK
    uuid asset_id FK
  }
```

---

## CRM

```mermaid
erDiagram
  ORGANIZATIONS ||--o{ CRM_COMPANIES : "owns"
  CRM_COMPANIES ||--o{ CRM_CONTACTS : "has"
  CRM_COMPANIES ||--o{ CRM_DEALS : "pipeline"
  CRM_DEALS ||--o{ CRM_ACTIVITIES : "timeline"
  AUTH_USERS ||--o{ CRM_ACTIVITIES : "logs"

  ORGANIZATIONS {
    uuid id PK
  }
  CRM_COMPANIES {
    uuid id PK
    uuid org_id FK
  }
  CRM_CONTACTS {
    uuid id PK
    uuid company_id FK
  }
  CRM_DEALS {
    uuid id PK
    uuid company_id FK
  }
  CRM_ACTIVITIES {
    uuid id PK
    uuid deal_id FK
  }
```

---

## Planner

```mermaid
erDiagram
  ORGANIZATIONS ||--o{ PLANNER_WORKFLOWS : "templates"
  PLANNER_WORKFLOWS ||--o{ PLANNER_PHASES : "contains"
  PLANNER_PHASES ||--o{ GATE_CONDITIONS : "gates"
  ORGANIZATIONS ||--o{ PLANNER_INSTANCES : "runs"
  PLANNER_WORKFLOWS ||--o{ PLANNER_INSTANCES : "instantiates"
  PLANNER_INSTANCES ||--o{ PLANNER_TASKS : "has"
  PLANNER_INSTANCES ||--o{ PLANNER_ASSIGNMENTS : "roles"
  PLANNER_TASKS ||--o{ PLANNER_DEPENDENCIES : "blocks"
  PLANNER_INSTANCES ||--o{ GATE_APPROVALS : "HITL"

  ORGANIZATIONS {
    uuid id PK
  }
  PLANNER_WORKFLOWS {
    uuid id PK
    uuid org_id FK
  }
  PLANNER_PHASES {
    uuid id PK
    uuid workflow_id FK
  }
  GATE_CONDITIONS {
    uuid id PK
    uuid phase_id FK
  }
  PLANNER_INSTANCES {
    uuid id PK
    uuid org_id FK
    uuid workflow_id FK
  }
  PLANNER_TASKS {
    uuid id PK
    uuid instance_id FK
  }
  PLANNER_ASSIGNMENTS {
    uuid id PK
    uuid instance_id FK
    uuid user_id FK
  }
  PLANNER_DEPENDENCIES {
    uuid id PK
    uuid instance_id FK
  }
  GATE_APPROVALS {
    uuid id PK
    uuid instance_id FK
  }
```

Cross-domain: instances carry `entity_type` / `entity_id` (brand/shoot) **without a hard FK** — app must validate org.

---

## Talent / booking

```mermaid
erDiagram
  TALENT_PROFILES ||--o{ TALENT_BOOKINGS : "booked"
  ORGANIZATIONS ||--o{ TALENT_BOOKINGS : "brand_org"
  SHOOT_SHOOTS ||--o{ TALENT_BOOKINGS : "optional_shoot"
  TALENT_PROFILES ||--o{ TALENT_AVAILABILITY : "calendar"
  ORGANIZATIONS ||--o{ TALENT_SHORTLISTS : "owns"
  TALENT_SHORTLISTS ||--o{ TALENT_SHORTLIST_ITEMS : "contains"
  TALENT_PROFILES ||--o{ TALENT_SHORTLIST_ITEMS : "listed"
  TALENT_BOOKINGS ||--o{ BOOKING_STATUS_HISTORY : "audit"

  TALENT_PROFILES {
    uuid id PK
  }
  TALENT_BOOKINGS {
    uuid id PK
    uuid talent_profile_id FK
    uuid brand_org_id FK
  }
  TALENT_AVAILABILITY {
    uuid id PK
    uuid talent_profile_id FK
  }
  TALENT_SHORTLISTS {
    uuid id PK
    uuid org_id FK
  }
  TALENT_SHORTLIST_ITEMS {
    uuid id PK
    uuid shortlist_id FK
  }
  BOOKING_STATUS_HISTORY {
    uuid id PK
    uuid booking_id FK
  }
  SHOOT_SHOOTS {
    uuid id PK
  }
  ORGANIZATIONS {
    uuid id PK
  }
```

---

## Mastra (logical, not FK)

```mermaid
erDiagram
  MASTRA_THREADS ||--o{ MASTRA_MESSAGES : "contains"
  MASTRA_RESOURCES ||--o{ MASTRA_THREADS : "owns_via_resourceId"
  MASTRA_WORKSPACES ||--o{ MASTRA_THREADS : "optional"
  MASTRA_AGENTS ||--o{ MASTRA_AGENT_VERSIONS : "versions"
  MASTRA_WORKFLOWS_DEF ||--o{ MASTRA_WORKFLOW_SNAPSHOT : "runs"
  MASTRA_SCHEDULES ||--o{ MASTRA_SCHEDULE_TRIGGERS : "fires"
  MASTRA_THREADS ||--o{ MASTRA_AI_SPANS : "traces"
  MASTRA_RESOURCES ||--o{ MASTRA_OBSERVATIONAL_MEMORY : "memory"

  MASTRA_THREADS {
    text id PK
    text resourceId
  }
  MASTRA_MESSAGES {
    text id PK
    text thread_id
  }
  MASTRA_RESOURCES {
    text id PK
  }
  MASTRA_WORKSPACES {
    text id PK
  }
  MASTRA_AGENTS {
    text id PK
  }
  MASTRA_AGENT_VERSIONS {
    text id PK
  }
  MASTRA_WORKFLOWS_DEF {
    text id PK
  }
  MASTRA_WORKFLOW_SNAPSHOT {
    text id PK
  }
  MASTRA_SCHEDULES {
    text id PK
  }
  MASTRA_SCHEDULE_TRIGGERS {
    text id PK
  }
  MASTRA_AI_SPANS {
    text id PK
  }
  MASTRA_OBSERVATIONAL_MEMORY {
    text id PK
  }
```

**New iPix `resourceId` (Core):** `org:{orgId}:user:{userId}` — not a DB FK.
