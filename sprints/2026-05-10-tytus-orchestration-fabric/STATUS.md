# Status

- Created: 2026-05-10
- Current phase: READY
- Previous sprint dependency: `2026-05-09-atomek-computer-controller` complete enough to build on.

## Decision

Atomek is a Tytus orchestration surface, not a clone of VS Code/Antigravity/OpenCode/Claude Code.

The next sprint connects existing Tytus resources through a resource graph, mission workboard, and shared context packs.

## Immediate next phase

Phase 1 + 2:

1. Resource graph discovery.
2. Mission context pack.

## Evidence from current codebase

- TytusOS already exposes files/shared folders/pods in user manuals.
- tytus-cli already has garagetytus shared-folder integration.
- tytus-cli already has OpenClaw SDK/adapter groundwork.
- Atomek already has chat/files/artifacts/local-job/skills panels.
- Atomek manifest already declares first app skills.

## Open implementation questions

None blocking. Use conservative defaults:

- resource graph is read-only first
- mission folder writes only after user creates/selects folder
- dispatch remains allowlisted
- unavailable apps show setup-needed

## Review pass — 2026-05-10

- Re-reviewed every sprint point against concrete use cases.
- Queried OpenCode through Lope review.
- Queried Claude directly because Claude is installed locally but not registered in `lope team list`.
- Added `REVIEW.md`, `CONTRACTS.md`, and `USE-CASES.md`.
- Revised MVP from large Resources/Mission panels to a vertical Mission Pack proof: resource graph + context pack + one local-cli run + transcript/output + approval gate.

## Refined implementation order

1. Lock contracts.
2. Resource graph for workspace/local-cli/shared-folders.
3. Mission context pack writer.
4. Local-cli adapter with mission prompt prelude.
5. Approval gate for proposed edits.
6. Lightweight timeline/badge.
7. Pod dispatch.
8. Full mission workboard.
9. App-skill drivers one by one.

## Implementation start — 2026-05-10

Phase 1/2 vertical MVP started.

Delivered in working tree:

- `tytus-cli` tray:
  - `GET /api/resources` normalized resource graph.
  - `GET /api/shared-folders` normalized garagetytus binding alias.
  - `POST /api/missions` tray-managed mission folder under Tytus Home/Missions.
  - `POST /api/missions/write` safe mission file writer confined to mission folders.
- `tytus-os` host API:
  - `host.resources.list()/refresh()`.
  - `host.missions.create()/write()`.
- `tytus-app-atomek`:
  - Mission Pack card in Computer/Agents panel.
  - Resource graph display.
  - Mission pack writes `MISSION.md`, `MISSION.json`, `RESOURCES.md`, `AUDIT.jsonl`.
  - Local CLI runs use mission `rootPath` as `cwd` when tray mission API exists.
  - Transcripts save under `runs/` and outputs still flow through Atomek preview/artifact path.

Structural decision made during implementation:

- Browser File System Access folders do not expose absolute paths, so local CLI agents cannot literally read `MISSION.md` from a browser-selected folder.
- Claude direct review recommended tray-managed mission folders (`B`). Implemented that path first.
- Browser-selected folders remain only as fallback for older host builds.

Validation so far:

- `cargo check -p tytus-tray` PASS.
- `cargo test -p tytus-tray mission_slug_and_safe_join_block_escape -- --nocapture` PASS.
- `cargo test -p tytus-tray web_server -- --nocapture` PASS (83 tests).
- `npm run typecheck` in `tytus-os` PASS.
- `npm run build` in `tytus-os` PASS (existing CSS/chunk warnings only).
- `npm run typecheck` in `tytus-app-atomek` PASS.
- `npm run build` in `tytus-app-atomek` PASS.
- `npm run release:check` in `tytus-app-atomek` PASS.

Open next gate:

- Run UI smoke against live `localhost:4242` after tray rebuild/restart, then decide version bump/release chain.
