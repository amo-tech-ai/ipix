# Complete table inventory (live 2026-08-24)

Base tables in `public`, `planner`, `shoot`, `talent`, `mastra`. Counts for busy tables were sampled earlier in the audit; this list is the full name catalog from `information_schema`.

## mastra (34)

`mastra_agent_versions`, `mastra_agents`, `mastra_ai_spans`, `mastra_background_tasks`, `mastra_channel_config`, `mastra_channel_installations`, `mastra_dataset_items`, `mastra_dataset_versions`, `mastra_datasets`, `mastra_experiment_results`, `mastra_experiments`, `mastra_favorites`, `mastra_mcp_client_versions`, `mastra_mcp_clients`, `mastra_mcp_server_versions`, `mastra_mcp_servers`, `mastra_messages`, `mastra_observational_memory`, `mastra_prompt_block_versions`, `mastra_prompt_blocks`, `mastra_resources`, `mastra_schedule_triggers`, `mastra_schedules`, `mastra_scorer_definition_versions`, `mastra_scorer_definitions`, `mastra_scorers`, `mastra_skill_blobs`, `mastra_skill_versions`, `mastra_skills`, `mastra_threads`, `mastra_workflow_definitions`, `mastra_workflow_snapshot`, `mastra_workspace_versions`, `mastra_workspaces`

## planner (11)

`assignments`, `dependencies`, `events`, `gate_approvals`, `gate_conditions`, `instances`, `notification_rules`, `phases`, `tasks`, `view_configs`, `workflows`

## shoot (8)

`shoot_assets`, `shoot_crew`, `shoot_deliverables`, `shoot_intake_drafts`, `shoots`, `shot_deliverable_links`, `shot_list`, `shot_type_references`

## talent (8)

`agency_talent`, `booking_status_history`, `bookings`, `talent_availability`, `talent_profile_sources`, `talent_profiles`, `talent_shortlist_items`, `talent_shortlists`

## public (product + FashionOS leftovers)

**Tenancy / identity:** `organizations`, `org_members`, `profiles`, `onboarding_sessions`

**Brands / intel:** `brands`, `brand_scores`, `brand_crawls`, `brand_crawl_results`, `brand_intake_drafts`, `brand_graph_nodes`, `brand_graph_edges`, `brand_competitors`, `brand_social_channels`, `brand_agent_results`

**Assets:** `assets`, `asset_variants`, `asset_links`, `asset_events`, `cloudinary_assets`, `media_size_specs`

**CRM:** `crm_companies`, `crm_contacts`, `crm_deals`, `crm_activities`

**Campaigns:** `campaigns`, `campaign_deliverables`

**Legacy public shoots / payments:** `shoots`, `shoot_assets`, `shoot_items`, `shoot_payments`

**Commerce links / shop:** `commerce_product_links`, `shopify_shops`, `shopify_products`, `shopify_media_links`, `amazon_connections`, `amazon_products`, `amazon_media_links`

**Social connect:** `facebook_connections`, `facebook_posts`, `instagram_connections`, `instagram_posts`

**FashionOS events:** `events`, `venues`, `ticket_tiers`, `registrations`, `payments`, `event_assets`, `event_designers`, `event_models`, `event_phases`, `event_rehearsals`, `event_schedules`, `event_sponsors`, `event_stakeholders`, `call_times`, `stakeholders`, `sponsor_organizations`, `sponsorship_packages`, `fashion_brands`, `fashion_show_designer_profiles`, `organizer_teams`, `organizer_team_members`

**Models (legacy):** `model_profiles`, `model_agencies`, `model_availability`, `designer_availability`

**Public tasks (not planner):** `tasks`, `task_assignees`

**Notifications:** `notifications`, `notification_reads`

**Chatbot / leads:** `chatbot_conversations`, `chatbot_messages`, `chatbot_events`, `lead_intake_drafts`, `processed_firecrawl_webhooks`

**AI app logs (not Mastra store):** `ai_agent_logs`, `agent_decision_log`, `agent_context_snapshots`

**Other:** `platforms`, `image_specs`, `image_type_defs`, `recommendation_rules`, `supabase_migrations`
