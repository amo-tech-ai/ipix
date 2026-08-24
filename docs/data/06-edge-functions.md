# Edge Functions

**Repo:** `supabase/functions/*/index.ts`  
**Live slugs (skill + prior MCP):** `health`, `edge-test`, `brand-intelligence`, `start-brand-crawl`, `firecrawl-webhook`, `capture-lead`, `audit-asset-dna`

JWT: `health`, `capture-lead`, `firecrawl-webhook` typically **verify_jwt = false** (public or signature). Others require user JWT.

| Function | Purpose | Auth | Called by | Class |
|----------|---------|------|-----------|--------|
| `health` | Liveness | Off | Probes | KEEP |
| `edge-test` | Gemini smoke | JWT | Ops | KEEP |
| `brand-intelligence` | URL → brand profile | JWT | Brand Hub | KEEP / PORT |
| `start-brand-crawl` | Firecrawl job | JWT | Brand Hub | KEEP |
| `firecrawl-webhook` | Signed webhook → crawl tables | HMAC, not JWT | Firecrawl | KEEP + HARDEN |
| `capture-lead` | Marketing chatbot → chatbot_* | Off + abuse controls | Public site | KEEP |
| `audit-asset-dna` | Image DNA columns | JWT / service | Assets | KEEP |

## vs Next.js / Mastra

Edge talks to **Gemini directly** (`GEMINI_API_KEY`). Mastra in Next talks via **gateway/provider adapter**. Do not assume Edge calls appear in Cloudflare AI Gateway logs.

**Do not** rebuild brand crawl inside Mastra Core. Call Edge or existing crawl tables.

**Do not** put CopilotKit runtime on Edge Functions.

## Secrets

Edge-only: `GEMINI_API_KEY`, Firecrawl, Cloudinary if used. Never `NEXT_PUBLIC_`.
