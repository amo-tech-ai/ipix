# RLS and security

**Verified:** advisors (security + performance) + `pg_policy` samples. **Not verified:** automated `supabase:verify-rls` in this session.

## What is correct

- Tenant tables use `is_org_member(org_id)` / owner / editor helpers with `(SELECT auth.uid())`.
- `public.assets`: org policies; `anon_select_assets` **USING false**.
- Planner: instance/task SELECT requires membership **and** `planner.is_at_least(..., 'viewer')`.
- `shoot.shoots` SELECT via `brands` + `is_org_member`.
- `mastra` not in PostgREST `schemas`. `USING (true)` only for `hyperdrive_mastra_runtime` — **not** anon JWT. Tenant isolation is **`resourceId` in the Node runtime**, not RLS.
- Chatbot tables with RLS and **no policy** = **fail closed** for anon/authenticated (service role / Edge only). Misleading if someone later adds a browser client.

## Problems (plain English)

### P1 — `get_brand_assets` callable as anon SECURITY DEFINER

Advisor: anon can `POST /rest/v1/rpc/get_brand_assets`. DEFINER bypasses RLS. Live body already rejects null `auth.uid()` then checks org/brand. **Not a proven leak.** Still revoke `anon` EXECUTE (CREATE OR REPLACE restored the grant).

**Fix:** `REVOKE EXECUTE ON FUNCTION public.get_brand_assets FROM anon, public;` keep authenticated; add `is_org_member` inside.

### P1 — SECURITY DEFINER RPCs granted to `authenticated`

Expected for `planner_*`, booking, CRM convert — they **must** check org inside. Advisor 0029 is noisy. **Audit grant + body**, don’t revoke blindly.

Planner `is_at_least` / `is_assigned` / realtime `can_broadcast_instance` are DEFINER by design (avoid RLS recursion). Keep, don’t expose extra tables.

### P1 — `public.shoots` designer_id policies

Operators in an org who are not the designer **won’t see** those 8 rows. New UI using `public.shoots` will look “empty” or leak if someone “fixes” RLS with `USING (true)`. Use **`shoot.shoots`**.

### P1 — RLS enabled, no policy

`chatbot_*`, `media_size_specs`, `processed_firecrawl_webhooks`. API users see nothing. Edge must use service role. Document; add service-only policies or keep deny-all + comment.

### P1 — leaked password protection off

Enable HaveIBeenPwned in Auth settings.

### P2 — `shoot.shot_type_references` SELECT `USING (true)`

Authenticated catalog — OK if no secrets. Don’t copy this pattern onto tenant tables.

### P2 — `mastra` USING true

OK **only** while schema stays off the Data API and DB password isn’t in the browser. New app: same grants, Hyperdrive/runtime role only.

### P2 — extensions in `public` (`vector`, `pg_trgm`, `btree_gist`)

Advisor WARN. Moving them is high-risk; **defer**.

### P2 — trigger functions mutable `search_path`

`set_updated_at`, `trigger_set_timestamps`, `stamp_analysis_locked_at`. Pin `search_path` in a later hardening migration.

### Planner assignment gap (known, already fixed pattern)

Bulk SELECT on `assignments` is **manager+**. Contributors need `planner_get_my_assignment` (`auth.uid()` only). **KEEP that RPC** in the new app.

## Org spoofing

Browser may send `orgId`. **Writes** must use server: session user ∈ `org_members`. Mastra `resourceId` must be built on the server after that check.

## Service role

Repo: `createOperatorSupabaseClient` uses **anon + user JWT**. Service role belongs in Edge / selected API routes (webhooks, DNA write), never `NEXT_PUBLIC_*`.

## Anonymous access

- Marketing Edge (`capture-lead`, `health`) JWT off — rate-limit + Turnstile/HMAC as implemented.
- Do not grant anon on tenant RPCs.
