# Security policy

## Reporting a vulnerability

Email the amo-tech-ai maintainers or open a **private** GitHub security advisory on [amo-tech-ai/ipix](https://github.com/amo-tech-ai/ipix/security). Do not file a public issue for secrets, auth bypasses, or data leaks.

## Secrets

Do not commit:

- `.env` or any real API keys
- OpenAI, Supabase, GitHub, or CopilotKit tokens
- service-role / postgres credentials

Use `.env.example` as the key-name template only.

GitHub secret scanning and push protection are expected to stay enabled on this repository.
