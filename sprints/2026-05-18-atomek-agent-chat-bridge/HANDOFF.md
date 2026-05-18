# Implementation Handoff Prompt

Copy this into a fresh context window to execute the sprint.

```text
You are Harvey. Work in these repos:

- /Users/sebastian/Projects/makakoo/api/ProjectWannolot/services/tytus-os
- /Users/sebastian/Projects/tytus-apps/tytus-app-atomek
- /Users/sebastian/Projects/makakoo/api/ProjectWannolot/services/tytus-cli only if tray endpoint tests/support must change

Sprint docs:
/Users/sebastian/Projects/tytus-apps/tytus-app-atomek/sprints/2026-05-18-atomek-agent-chat-bridge/

Read all docs in that folder before editing:
README.md, AUDIT.md, TECH-SPEC.md, SPRINT.md, TASKS.md, VALIDATION.md.

Mission:
Implement Atomek agent chat using a reusable TytusOS Host API bridge. Do not copy the TytusOS Chat SSE/fallback logic into Atomek. Add `host.daemon.chatAgent()` in TytusOS host-api/runtime, centralize parser/sanitizer/fallback logic, then extend Atomek's existing chat surface to select Atomek AI, OpenClaw, or Hermes targets.

Rules:
- Preserve Atomek AI chat behavior.
- No duplicate chat panel in Atomek.
- No user-facing provider/droplet/model/IP/route-id leaks.
- Users chat with OpenClaw/Hermes agents, not raw AIL.
- If Cortex is not ready, fallback direct where safe; otherwise show a friendly warming/retry message.
- Add tests before release.

Suggested branch names:
- tytus-os: feature/atomek-agent-chat-bridge
- tytus-app-atomek: feature/agent-chat-bridge
- tytus-cli: feature/agent-chat-bridge-support only if touched

Run gates from VALIDATION.md. Commit, push, and release only after tests/builds pass.
```
