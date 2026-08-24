# Auth and org model

## Current journey (this repo)

```text
Login (marketing) → Supabase Auth (PKCE cookies)
  → profiles row (handle_new_user)
  → org_members
  → operator app loads org-scoped brands/CRM/planner
  → Copilot/Mastra resourceId should be org+user (server)
```

**Clients**

| Client | File | Key |
|--------|------|-----|
| Browser | `app/src/lib/supabase/client.ts` | anon |
| Server cookies | `server.ts`, `session.ts` | anon + cookies |
| Operator Bearer | `operator-client.ts` | anon + JWT |
| Service role | Edge / selected routes only | service |

**KEEP this split.** Vite `src/lib/supabase.ts` is **REMOVE** (IPI-89).

## Org selection

Must be **server-derived**: `auth.uid()` → `org_members`. Cookie/localStorage org is a **hint** only.

**Spoof risk:** if Mastra tools accept `orgId` from the model/UI without membership check → cross-tenant writes. **Forbidden.**

Multi-org: user can have many `org_members` rows. Active org = last validated membership, not client claim.

Roles: org owner/editor/member + planner instance roles (`planner.is_at_least`). Two layers — don’t collapse them.

## Share production Auth?

| Option | When |
|--------|------|
| Same project Auth + preview Mastra schema | Fastest; RLS still production — **dangerous if app bugs write prod tables** |
| Supabase **branch** | Best isolation for new runtime |
| New project | Cleanest; lose users unless migrate |

**Recommend:** **branch or preview schema for Mastra**; Auth can stay shared **only** if the new app’s service role is scoped and default writes are preview.

## Cleanest new iPix Auth

1. CopilotKit starter + `@supabase/ssr` (same pattern as `server.ts`).
2. Middleware: session required for `/app`.
3. `getActiveOrgId()` on server from membership.
4. Copilot handler: `resourceId = org:{orgId}:user:{userId}`.
5. Tools: RPC with user JWT client, not service role.
