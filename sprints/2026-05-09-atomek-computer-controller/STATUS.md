# Status

- Sprint created: 2026-05-09
- Sprint completed: 2026-05-09
- Unified from previous draft folders:
  - `2026-05-09-atomek-local-agent-runtime`
  - `2026-05-09-agentic-app-skills`
- Current phase: COMPLETE

## Done

- Verified TytusOS Terminal route exists: `/api/terminal/session`.
- Verified Atomek has `host.ai` integration and edit previews.
- Verified Blender MCP skill exists in Makakoo.
- Verified Hyperframes skill not found locally.
- Defined one unified sprint for local tools + agentic app skills.
- Added `host.local` + `host.skills` contracts to `@tytus/host-api`.
- Added `contributes.agentSkills` manifest schema.
- Added same-origin TytusOS host bridge calls for local tools, local jobs, and skill registry.
- Added Tytus tray endpoints:
  - `GET /api/local/tools`
  - `POST /api/local/jobs`
  - `GET /api/skills`
  - `GET /api/skills/:id`
  - `POST /api/skills/resolve`
- Added manifest-backed skill discovery from local `tytus-app.json` sidecars under `TYTUS_APPS_ROOT` or `~/Projects/tytus-apps`.
- Added Atomek skill sidecars:
  - `skills/atomek.inspect-project.md`
  - `skills/atomek.generate-patch-preview.md`
  - `skills/atomek.local-agent-job.md`
- Added Atomek **Computer / Agents** panel.
- Added skill-pack attach-to-chat flow.
- Added terminal launch with context prefill, no auto-enter.
- Added safe background local-job runner for allowlisted tools: `codex`, `claude`, `opencode`, `gemini`, `qwen`, `aider`, `pi`, `kimi`.
- Added job stream ingestion into Atomek outputs.
- Added automatic preview attempt for local-job output containing diff markers.
- Published release metadata as Atomek `0.4.6` in app manifest and catalog.

## Gates

- PASS — `tytus-app-atomek`: `npm run typecheck`
- PASS — `tytus-app-atomek`: `npm run build`
- PASS — `tytus-app-atomek`: `npm run verify:cortex`
- PASS — `tytus-app-atomek`: `npm run release:check`
- PASS — `tytus-os`: `npm run typecheck`
- PASS — `tytus-os`: `npm run test --workspace app -- src/runtime/dynamic-loader.test.ts src/runtime/app-rebrand-migrations.test.ts src/apps/featured-apps-catalog.test.ts`
- PASS — `tytus-cli`: `cargo check -p tytus-tray`

## Lope escalation

- Ran Lope technical escalation with `opencode,kimi,codex` because user requested Lope escalation for blockers/questions.
- Result: all validators failed or timed out, so no external guidance was usable.
- Claude is installed locally but not currently active in `lope team list`; no roster mutation was performed.
- Implementation continued with local repo evidence and conservative safety defaults.

## Remaining outside sprint

- Commit, tag, push, and publish `v0.4.6` after repo owner approves release flow.
- Runtime QA in browser after tray reload to verify `/api/local/jobs` through the real daemon.
