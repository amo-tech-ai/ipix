# CopilotKit plan for new iPix

**Companion:** [mastra-plan.md](new-plan/mastra/mastra-plan.md) · [supabase-mastra.md](supabase-mastra.md) · starter decision [05-starter-decision.md](05-starter-decision.md).

Like the Operator shell: one runway (the official Mastra integration example), then borrow shot cards from other lookbooks — never stitch three runways into one shoot.

---

## 1. Starter decision (verified)

**ONE starter:** [CopilotKit `examples/integrations/mastra`](https://github.com/CopilotKit/CopilotKit/tree/main/examples/integrations/mastra)

**Live CopilotKit docs (MCP `search-docs`, 2026-08-24)** match this shape:

```ts
import { CopilotRuntime, createCopilotRuntimeHandler, InMemoryAgentRunner } from "@copilotkit/runtime/v2";
import { MastraAgent } from "@ag-ui/mastra";

const runtime = new CopilotRuntime({
  agents: MastraAgent.getLocalAgents({ mastra }),
  runner: new InMemoryAgentRunner(),
});
const handler = createCopilotRuntimeHandler({ runtime, basePath: "/api/copilotkit" });
```

Provider: `@copilotkit/react-core/v2` (`CopilotKit` / `CopilotSidebar`).

**Current iPix `app/` already uses this runtime API** (plus org-scoped `resourceId`). Rebuild on the **starter tree**, then **PORT** the auth/resourceId factory — do not copy the ~680-line route as the foundation.

---

## 2. Repo scorecard

| Repo | Role | Copy into v2? | Score |
|------|------|----------------|------:|
| **integrations/mastra** | **STARTER** | Yes — app/mastra/route skeleton | **97** |
| v2/runtime (`node`) | Current handler APIs | Borrow **snippets**, not a second architecture | 93 |
| v2/react | Current hooks/provider | Borrow | 93 |
| canvas/mastra-pm | Shared state, working memory, Planner UX | **Features only** | 92 |
| canvas/mastra | Canvas/cards | Features only | 87 |
| showcases/generative-ui | GenUI | Features only | 90 |
| mastra-ai/template-agent-harness | Memory/tasks server-side | Features only | 85 |
| CopilotKit/OpenBot | Coworker | Advanced only | 80 |
| examples/v1/\* | Legacy | **No** | 0 |
| v2/react-router | Wrong meta-framework | **No** | 0 |

**Rule:** one architecture. PM/canvas/GenUI are **references**, not merged starters.

**Stale vs current:** older notes mentioned `createCopilotEndpoint`. **Current docs + current iPix route** use `CopilotRuntime` + `InMemoryAgentRunner` + `createCopilotRuntimeHandler`. Confirm names against starter `package.json` at implement time.

---

## 3. Target architecture

```text
Browser  CopilotKit v2  (no DB URL)
    → POST /api/copilotkit  (cookie JWT)
        → resolve org_members (fail closed)
        → resourceId = org:{org}::user:{user}
        → MastraAgent.getLocalAgents({ mastra, resourceId })
        → InMemoryAgentRunner  (in-process run loop)
        → Mastra Memory persists via PostgresStore (preview)
```

`InMemoryAgentRunner` ≠ in-memory **chat history**. History is Postgres. Do not “fix” persistence by swapping the runner for a custom Cloudflare runner.

---

## 4. Core → Advanced (CopilotKit surface)

| Phase | CopilotKit work | iPix example |
|-------|-----------------|--------------|
| **Core** | Starter chat + one agent id `production-planner` + thread restore | SS26 Planner survives refresh |
| **MVP** | GenUI cards, frontend tools, HITL interrupt **only after** IPI-760-style proof | Approve gate on shot list |
| **Post-MVP** | Multi-agent switcher, shared thread UX | Brand vs Planner tabs |
| **Advanced** | OpenBot coworker, extra canvases | WhatsApp-side talent chat is **Mastra channels**, not extra CopilotKit runtimes |

---

## 5. What to copy / not copy

**Copy from starter:** Next App Router layout, v2 provider, `[[...slug]]` handler, `MastraAgent.getLocalAgents`, local `mastra/` folder layout.

**Port from current iPix (logic, not file dump):** `withOperatorAuth`, `makeMemoryResourceId`, fail-closed `/info`, stream idle timeout, “tools call RPCs with user JWT”.

**Do not copy:** `demo-user` fallbacks, Worker pg stubs, `MASTRA_STORAGE_MODE=noop`, intelligence mode until explicitly enabled, merging PM + OpenBot + starter into one route.

---

## 6. Task sequence

1. `npx`/clone **integrations/mastra** as `app-v2` (or worktree) — Wave 1 after Wave 0.10.
2. Pin CopilotKit + `@ag-ui/mastra` + `@mastra/*` as **one family** (typecheck).
3. Swap demo auth → Supabase SSR (same project, preview DB for Mastra).
4. Wire `resourceId` before `getLocalAgents`.
5. Point Mastra storage at preview (see mastra-plan).
6. Gold TEST-\<uuid\>.
7. Then GenUI/HITL from **feature** examples.

---

## 7. Golden test (UI + storage)

Same as mastra-plan: Org A Planner TEST-\<uuid\> persist/restore; Org B denied. CopilotKit must send the **same threadId** after refresh (provider thread props — verify against starter, not v1 `useCopilotChat`).

---

## 8. Production-ready checklist

- [ ] Single starter architecture
- [ ] v2 imports only (`/v2` or current starter paths)
- [ ] No second runtime (LangGraph/OpenBot) in Core
- [ ] Auth on the route, not in the browser Mastra
- [ ] Runner in-memory; **store** Postgres
- [ ] Agent ids match registry (`production-planner`, …)

**Plan grade:** **90/100** (starter + live docs aligned; implement-time version pin still required). **Confidence:** **84%**.
