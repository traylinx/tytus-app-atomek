# Atomek Agent Chat Bridge Sprint

Dedicated sprint to add Tytus pod-agent chat to Atomek without duplicating the Traylinx/TytusOS chat implementation.

## Sprint goal

Atomek can chat with available Tytus pod agents (OpenClaw, Hermes) from its existing chat surface, using the same safe Cortex/direct fallback path already built for TytusOS and Traylinx. The implementation must expose a reusable Host API bridge so future TytusOS apps can do the same without copying SSE parsing, retry, fallback, or redaction logic.

## Non-negotiables

- Reuse TytusOS host/runtime plumbing. Do not copy Traylinx/TytusOS SSE parsing into Atomek.
- Preserve Atomek's current AI chat, memory, artifacts, missions, and workspace behavior.
- Keep pod identity internal. User-facing UI must not expose provider names, droplet IDs, route IDs, private IPs, model names, or infrastructure labels.
- Support OpenClaw and Hermes as agent targets. Users chat with the agent, not raw AIL.
- Fail cleanly: warming, not ready, timeout, and fallback states must be understandable and retryable.
- Keep the plan implementation-ready: exact files, phases, tests, release gates.

## Documents

- `AUDIT.md` - current repo-backed findings and risk map.
- `TECH-SPEC.md` - target architecture, API contracts, data flow, edge cases.
- `SPRINT.md` - execution phases and acceptance criteria.
- `TASKS.md` - task checklist with file ownership.
- `VALIDATION.md` - test, security, QA, and release gates.
- `HANDOFF.md` - paste-ready continuation prompt for an implementation agent.
- `SPRINT-MANIFEST.json` - machine-readable scope summary.
