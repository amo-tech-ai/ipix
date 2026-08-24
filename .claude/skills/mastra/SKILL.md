---
name: mastra
description: "Mastra framework: docs lookup (links.md, mastraDocs MCP, embedded docs), agents, workflows, streaming, browser, tools, memory, RAG, processors, CopilotKit guide. Verify from installed docs — never trust training-data APIs. NOT for: product intent routing (mastra-routing), Managed Agents API harness (mde-agents), non-Mastra frameworks. Load when editing src/mastra/**, Mastra tools/workflows, memory, streaming/events, browser automation, or Mastra doc URLs."
license: Apache-2.0
metadata:
  author: Mastra
  version: "2.1.0"
  repository: https://github.com/mastra-ai/skills
  # Upstream authoring fields. Not in the Agent Skills spec's top-level set, so
  # they live here — `metadata` is explicitly "arbitrary key-value mapping".
  title: Mastra framework guide
  impact: HIGH
  impactDescription: Docs routing, agents/workflows, embedded vs remote APIs
  tags: mastra, agents, workflows, tools, memory, rag, typescript
paths:
  - "src/mastra/**"
  - "docs/mastra/**"
  - "**/*mastra*"
---

# Mastra Framework Guide

## When NOT to use

- **Generic "build an agent"** with no Mastra imports → product docs, not framework internals here
- **CopilotKit v2** (`useComponent`, slots, headless v2) → use the `copilotkit` skill

---

## ⚠️ Never trust training-data knowledge

Mastra evolves rapidly — APIs, constructor signatures, and patterns change between versions. Always verify against installed docs before writing code.

**Priority order:**
1. Embedded docs: `grep -r "Agent" node_modules/@mastra/core/dist/docs/references`
2. Source: `cat node_modules/@mastra/core/dist/docs/assets/SOURCE_MAP.json`
3. Remote: `https://mastra.ai/llms.txt`

---

## iPixai-specific wiring

**Location:** `src/mastra/` (this repo — **not** old iPix `app/src/mastra/`)

Conversion SSOT: `docs/mastra/10-mastra-convert.md`. Do **not** copy the old Mastra tree.

- **Starter:** CopilotKit `examples/integrations/mastra` — `export const mastra` from `src/mastra/index.ts`
- **CopilotKit:** `MastraAgent.getLocalAgents({ mastra, resourceId })` — `resourceId` = `org:{orgId}::user:{userId}`, never hardcoded `"default"` in Core
- **Storage:** PostgresStore + preview `mastra` schema, `disableInit: true` on anything that is not disposable preview. No LibSQL in the prod path. No Worker/Hyperdrive storage switch
- **Model:** starter pin until a provider ticket — do not port Cloudflare `resolveAgentModel`
- **First agent:** `production-planner` (+ `default` alias). More IDs only per convert plan
- **Tools:** compute-only shoot tools first; domain writes via SECURITY DEFINER RPCs + user JWT
- **Dev:** `npm run dev:agent` (`:4111`) and `npm run dev:ui` (`:3000`) separately — never combined `npm run dev`
- **MCP `projectPath`:** `$(git rev-parse --show-toplevel)` — **this repo root**, not `/home/sk/ipix/app`

---

## Quick topic routing

| Question | Where to look |
|----------|---------------|
| "Where is the doc for X?" | [`links.md`](links.md) → [`references/topic-routing.md`](references/topic-routing.md) |
| Agent / Workflow / Tool API | [`references/embedded-docs.md`](references/embedded-docs.md) |
| Memory (threads, OM, recall) | [`references/memory.md`](references/memory.md) |
| Workflows / HITL / suspend-resume | [`references/workflows.md`](references/workflows.md) |
| Streaming / AG-UI bridge | [`references/streaming.md`](references/streaming.md) |
| MCP client/server | [`references/mcp.md`](references/mcp.md) + [`links.md`](links.md) |
| CopilotKit + Mastra (in-process) | iPixai wiring above + `getLocalAgents` |
| Common errors | [`references/common-errors.md`](references/common-errors.md) |
| v0→v1 migration | [`references/migration-guide.md`](references/migration-guide.md) |
| All reference files | [`references/README.md`](references/README.md) |

**Full framework guide** (priority order, core concepts, TypeScript config, model format, dev workflow): [`references/full-guide.md`](references/full-guide.md)

---

## Mastra docs MCP

| Tool | Use when |
|------|----------|
| `mastraDocs` | Know the doc path (`docs/…`, `guides/…`, `reference/…`) |
| `readMastraDocs` | Browse embedded topics in installed `@mastra/*` packages |
| `searchMastraDocs` | Keyword grep — **requires `projectPath` = this repo root** |
| `listMastraPackages` | See which packages ship embedded docs |
