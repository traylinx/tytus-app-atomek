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
