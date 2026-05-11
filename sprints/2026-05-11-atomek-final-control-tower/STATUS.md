# Status

- Created: 2026-05-11
- Updated: 2026-05-11
- Phase: core vertical implemented and validator-passed
- Release target: Atomek `v0.4.19`
- Repo state when created: clean on `main` at `6333429`
- Previous pack: `2026-05-11-tytus-agent-team-manifest`

## Current conclusion

Atomek now has a coherent Resource Fabric core vertical instead of a noisy pile of tiny agent/editor controls.

The implemented product center is:

```text
mission folder -> selected team -> task graph -> run transcript -> proposal/output -> approval -> handoff
```

## Implemented

- Reframed user-facing Atomek copy around **Tytus Resource Fabric / Agent Team**.
- Made **OpenClaw** and **Hermes** first-class visible brands.
- Normalized legacy/internal pod type metadata before display.
- Added home-screen Resource Fabric flow: local computer ↔ shared folders ↔ pods ↔ apps.
- Added live-resource team presets:
  - Repo Repair
  - OpenClaw + Local
  - Creative Production
  - Research Watch
- Added selected-team role mapping: planner, implementer, reviewer, Team Desk, app tool.
- Added **Ask pod** task dispatch through `host.daemon.callPodEndpoint()` with live `/v1/models` discovery and mission transcript capture.
- Hardened mission protocol:
  - `MISSION.md`
  - `MISSION.json`
  - `RESOURCES.md`
  - `TASKS.md`
  - `HANDOFF.md`
  - `INBOX.md`
  - `OUTBOX.md`
  - `AUDIT.jsonl`
  - `RUNS.jsonl`
  - `runs/`
  - `outputs/`
  - `proposals/`
  - `approvals/`
- Added browser fallback writer for nested mission paths.
- Updated tray mission creation to create `runs`, `outputs`, `proposals`, and `approvals` directories.
- Replaced stale Control Tower / Mission Control wording in current app docs and Tytus manuals.
- Regenerated `tytus-cli/os-docs.md` from updated manuals.
- Scrubbed public docs/MCP help so **OpenClaw** is the public name and AIL model lists are discovered dynamically, not provider-hardcoded.

## Gates

- Atomek `npm run typecheck` — PASS
- Atomek `npm run build` — PASS
- Atomek `npm run release:check` — PASS
- TytusOS `npm run typecheck` — PASS
- TytusOS `npm run build` — PASS with existing CSS/chunk warnings only
- TytusCLI `cargo fmt` — PASS
- TytusCLI `cargo check -p atomek-cli` — PASS
- TytusCLI `cargo check -p tytus-mcp` — PASS
- TytusCLI `cargo check -p tytus-tray` — PASS
- TytusCLI `scripts/sync-tytus-os-dist.sh --sync && --check` — PASS (`24725eb4ccec2d27719c1a687576ba9de07e637bf6f4a0ce1b4736c58bbb71ef`)
- OpenCode review — PASS
- Lope final review — Claude PASS, pi PASS, Kimi runner exited 1

## Non-blockers fixed

- Claude noted possible AIL false-positive matching on strings like `available`; fixed with word-boundary AIL detection.
- Lope noted a stale public `nemoclaw vs hermes` guide row; fixed the broader public-doc/MCP wording sweep.

## Remaining expansion work

Not blocking this core vertical:

1. Streaming pod output instead of non-streaming pod completion.
2. Approval Inbox UI backed by proposal decision records.
3. Rich app-skill drivers for Blender/Remotion/Hypermotion beyond skill attach/setup.
4. Channel approvals/status broadcasts.
5. Deeper responsive/visual polish after live use.

## Must not regress

- Do not hardcode AIL model IDs.
- Do not direct-fetch pod/model endpoints from app browser code.
- Do not run arbitrary shell from model text.
- Do not leak `nemoclaw`/`NemoClaw` user-facing; display **OpenClaw**.
- Do not fake Hermes/Blender/Hypermotion availability.
- Do not turn Atomek into a VS Code / Claude / OpenCode clone.
