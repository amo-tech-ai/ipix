# 04 — Example catalog (starter + references)

**After:** [03-repo-review.md](03-repo-review.md)  
**Before:** [05-starter-decision.md](05-starter-decision.md)

One starter: CopilotKit `examples/integrations/mastra`. Everything else is a reference — copy APIs, not product chrome.

Full scoring and avoid-list: [03-repo-review.md](03-repo-review.md).

## Scorecard (listed + extras)

| Repo/example | Current? | Main feature | iPix use case | Reuse what? | Avoid what? | Phase | Score | Grade |
| ------------ | -------- | ------------ | ------------- | ----------- | ----------- | ----- | ----: | ----- |
| [integrations/mastra](https://github.com/CopilotKit/CopilotKit/tree/main/examples/integrations/mastra) | **Yes** | Official Next + Mastra starter, AG-UI, optional Intelligence/channels | Clean runtime foundation | `MastraAgent.getLocalAgents`, Next route, provider | Demo agent, LibSQL memory, Docker Intelligence as Core | **CORE** | 98 | A+ |
| [canvas/mastra-pm](https://github.com/CopilotKit/CopilotKit/tree/main/examples/canvas/mastra-pm) | **Yes** | Shared state, Zod, working memory, web+CLI same agent | Planner board (shoots/fittings) | State schema, AG-UI sync, tools | In-memory DB, OpenAI-only, workshop branches as prod | **MVP** | 95 | A |
| [canvas/mastra](https://github.com/CopilotKit/CopilotKit/tree/main/examples/canvas/mastra) | **Yes** | Card canvas, plans, HITL interrupts | Visual shoot/project cards | Card types, plan tools, `useCoAgent` | Generic field names; in-process-only assumptions | **MVP** | 90 | A- |
| [v2/runtime](https://github.com/CopilotKit/CopilotKit/tree/main/examples/v2/runtime) | **Yes** | Node/Hono/Express/Workers handlers | Verify `createCopilotRuntimeHandler` | **`node`** (and later `cf-workers`) | Deno/Elysia unless we switch runtimes | **CORE** | 93 | A |
| [v2/react](https://github.com/CopilotKit/CopilotKit/tree/main/examples/v2/react) | **Yes** | v2 React provider/hooks/Storybook | Confirm `/v2` imports | Provider, `useAgent` | Demo chrome only | **CORE** | 91 | A- |
| [v2/next-pages-router](https://github.com/CopilotKit/CopilotKit/tree/main/examples/v2/next-pages-router) | **Yes** | Minimal App Router client → Express runtime | Split UI/runtime later | `useSingleEndpoint` note | Name is misleading; not Pages Router; not a product starter | REFERENCE | 72 | C+ |
| [v2/react-router](https://github.com/CopilotKit/CopilotKit/tree/main/examples/v2/react-router) | **Yes** | Vite + React Router | N/A | Nothing | Wrong app framework | **SKIP** | 35 | D |
| [OpenBot](https://github.com/CopilotKit/OpenBot) | **Yes** | AG-UI coworkers + browser/files, pre-approved actions | Research/sourcing coworker | Approval-before-act, audit log | LangGraph sample, Docker computer, not Next+Mastra Core | **ADVANCED** | 84 | B+ |
| [v1/chat-with-your-data](https://github.com/CopilotKit/CopilotKit/tree/main/examples/v1/chat-with-your-data) | Legacy | `useCopilotReadable` + dashboard | Brand metrics Q&A **UX** | Idea: expose CRM/metrics as readable | CopilotRuntime v1, Tavily route | SKIP code | 48 | D |
| [v1/form-filling](https://github.com/CopilotKit/CopilotKit/tree/main/examples/v1/form-filling) | Legacy | Fill forms via actions | Shoot intake form | UX of `fillIncidentReportForm` | v1 Cloud public key runtime | SKIP code | 50 | D |
| [v1/next-openai](https://github.com/CopilotKit/CopilotKit/tree/main/examples/v1/next-openai) | Legacy | Pages + OpenAI | None | — | Entire stack | **SKIP** | 15 | F |
| [v1/next-pages-router](https://github.com/CopilotKit/CopilotKit/tree/main/examples/v1/next-pages-router) | Legacy | Pages Router | None | — | Pages Router | **SKIP** | 10 | F |
| [v1/research-canvas](https://github.com/CopilotKit/CopilotKit/tree/main/examples/v1/research-canvas) | Legacy | LangGraph CoAgents research | Brand research **UX** | Canvas layout ideas | Python/JS LangGraph agents | SKIP code | 42 | D |
| [v1/state-machine](https://github.com/CopilotKit/CopilotKit/tree/main/examples/v1/state-machine) | Legacy | Multi-stage car sales | Shoot Wizard stages | Stage-hook **idea** | v1 + React Flow as runtime | SKIP code | 45 | D |
| [v1/travel](https://github.com/CopilotKit/CopilotKit/tree/main/examples/v1/travel) | Legacy | LangGraph + maps HITL | Location/talent maps | HITL + shared trip state **idea** | Python agent, Leaflet stack | SKIP code | 44 | D |
| [template-agent-harness](https://github.com/mastra-ai/template-agent-harness) | **Yes** | Memory, tasks, workspace, schedules, web | Working memory + task list + later cron | Memory/task/schedule **patterns** | Local libSQL/Turso, shell, unauthenticated public | MVP→ADV | 88 | B+ |
| [template-browser-agent](https://github.com/mastra-ai/template-browser-agent) | **Yes** | Playwright `@mastra/agent-browser` | Crawl competitor/lookbook sites | Browser tool wiring | Turso as SoT; don’t expose Playwright to operators unattended | ADV | 80 | B |
| [template-agent-builder](https://github.com/mastra-ai/template-agent-builder) | **Yes** | NL/visual agent builder | Internal agent authoring | Studio UX later | Not operator Core | ADV | 70 | C+ |
| [template-claw-assistant](https://github.com/mastra-ai/template-claw-assistant) | **Yes** | Local FS + browser + skills | Internal ops agent | Skills/observational memory | Local computer; not multi-tenant SaaS | ADV | 62 | C |
| [workshops](https://github.com/mastra-ai/workshops) | **Yes** | Teaching labs | Team onboarding | Exercises | Not production | REFERENCE | 68 | C+ |
| [mastra-triage](https://github.com/mastra-ai/mastra-triage) | **Yes** | Operational triage | Support/inbox routing | Workflow shape | Sparse docs | ADV | 64 | C |
| [ui-dojo](https://github.com/mastra-ai/ui-dojo) | **Yes** | Mastra + multiple UIs | Compare CopilotKit vs other UIs | CopilotKit cell only | Don’t adopt a second chat UI | REFERENCE | 78 | B |
| [assistant-ui/mastra-hitl](https://github.com/assistant-ui/mastra-hitl) | Stale-ish | HITL with **assistant-ui** | Approval UX **ideas** | Suspend/resume flow | Wrong chat library for iPix | SKIP impl | 58 | C- |
| [apify/actor-mastra-mcp-agent](https://github.com/apify/actor-mastra-mcp-agent) | Older | Mastra + Apify MCP | Scraping via MCP | MCP client pattern | 2025 actor; not CopilotKit | ADV | 66 | C+ |
| [shadcn-labs/agentcn](https://github.com/shadcn-labs/agentcn) | **Yes** | shadcn for agents | Chat/thread chrome | Component primitives | Not CopilotKit/Mastra runtime | MVP UI | 86 | B+ |

### Extra official finds (cap 10)

| Extra | Why | Phase | Score |
| ----- | --- | ----- | ----: |
| [showcases/generative-ui](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/generative-ui) | Current GenUI + HITL + MCP Apps | MVP | 94 |
| [generative-ui-playground](https://github.com/CopilotKit/generative-ui-playground) | Same patterns; prefer monorepo showcase | REFERENCE | 88 |
| [showcases/open-mcp-client](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/open-mcp-client) | MCP in Copilot UI | ADV | 87 |
| [showcases/multi-agent-canvas](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/multi-agent-canvas) | Multi-agent; **LangGraph** — adapt UX not backend | ADV | 82 |
| [showcases/a2a-travel](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/a2a-travel) | A2A | ADV | 80 |
| [showcases/claude-managed-agents](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/claude-managed-agents) | Delegation concepts | ADV | 79 |
| [examples/shadcn](https://github.com/CopilotKit/CopilotKit/tree/main/examples/shadcn) | Copilot + shadcn | MVP | 92 |
| [CopilotKit Mastra showcase](https://showcase.copilotkit.ai/integrations/mastra) | Live `useHumanInTheLoop` / GenUI cells | MVP | 93 |
| [mastra.ai/templates](https://mastra.ai/templates) | Official template index (MCP chatbot, etc.) | ADV | 85 |
| Mastra `PostgresStore` docs (not a demo app) | Real persist for Core | CORE | 96 |

---
