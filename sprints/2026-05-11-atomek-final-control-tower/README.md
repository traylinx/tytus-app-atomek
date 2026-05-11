# Atomek Resource Fabric Sprint

Status: READY FOR CORE VERTICAL IMPLEMENTATION  
Date: 2026-05-11  
Owner app: `tytus-app-atomek`  
Coupled repos: `tytus-os`, `tytus-cli`, app-skill repos as needed

## Verdict

Current Atomek has many useful primitives, but the product still feels wrong because it exposes primitives as tiny controls instead of one obvious mission/team flow.

Final Atomek must be:

```text
Tytus Resource Fabric cockpit for autonomous agent teams
```

Not:

```text
another VS Code / Antigravity / Claude / OpenCode clone
```

## Final product promise

A user opens Atomek and can do this in one flow:

> Give a job to a team of local agents, Tytus pod agents, app skills, shared folders, and channels. Let them exchange files through a mission folder, work in parallel, stream progress, save transcripts/artifacts, and ask before writes/costs/external messages.

## Source evidence checked

- App repo: `/Users/sebastian/Projects/tytus-apps/tytus-app-atomek`
- Host API: `/Users/sebastian/Projects/makakoo/api/ProjectWannolot/services/tytus-os/packages/host-api/src/client.ts`
- Host implementation: `/Users/sebastian/Projects/makakoo/api/ProjectWannolot/services/tytus-os/app/src/runtime/host-impl.ts`
- Tray APIs: live `http://127.0.0.1:4242`
- Previous manifest pack: `sprints/2026-05-11-tytus-agent-team-manifest/`

Live/current capabilities already present:

- Mission folder creation/listing/writing through host/tray.
- Resource graph: workspace, local CLIs, pod agents, AIL route, app skills, shared folders.
- Local agent discovery and background job streaming.
- Tytus Terminal launch with mission context.
- Chat with AIL route selection and dynamic model aliases.
- Project indexing, semantic retrieval, memories, artifacts.
- Preview-based edit application for AI outputs.
- Basic mission run history.

## Product shape

Only three primary screens:

1. **Team Mission** — create/resume a mission.
2. **Mission Board** — tasks, team, live runs, outputs, approvals.
3. **Resource Setup** — true availability/status/setup for agents, pods, shared folders, channels, app skills.

Everything else is a tool inside those screens:

- editor
- chat
- terminal
- outputs
- settings
- raw resource graph

## Definition of done

Atomek is final enough when Sebastian can run this scenario without confusion:

> Review JULI3TA with Claude/OpenCode locally, ask an OpenClaw pod for independent product critique, keep all shared context in the mission folder/shared folder, show transcripts and outputs, then present one approval-gated patch plan.

Expected result:

- one mission folder
- clear selected team
- visible file/resource scope
- task board with owners
- local + pod run transcripts
- output/proposal cards
- approval inbox
- resumable handoff
- no fake/unclear buttons

## Files in this sprint

| File | Purpose |
|---|---|
| `FEATURE-AUDIT.md` | Feature-by-feature current state and gap analysis. |
| `PRODUCT-SPEC.md` | Final Atomek product contract. |
| `IMPLEMENTATION-PLAN.md` | Ordered sprint phases with acceptance gates. |
| `TECHNICAL-CONTRACTS.md` | Minimal contracts needed across Atomek/host/tray. |
| `UAT.md` | User acceptance tests for final value. |
| `QA-PLAN.md` | Build, runtime, and visual QA gates. |
| `STATUS.md` | Current status and next executable action. |
| `HANDOFF.md` | Paste-ready continuation prompt for a fresh agent/window. |
| `LOPE-REVIEW-SUMMARY.md` | Cross-model critique and accepted plan changes. |
| `LOPE-REVIEW.raw.txt` | Raw Lope validator output. |


## Core vertical implementation order

1. Phase 0a/0b — Team Mission front door and navigation cleanup.
2. Phase 1 — Mission protocol + approval skeleton + shared folder as Team Desk.
3. Phase 2 — Team presets + Mission Board v0.
4. Phase 3 — Unified run model + local task-first runs.
5. Phase 4 — Pod task dispatch.
6. Phase 5 — Output/proposal/approval inbox.
7. Phase 6 — QA/release.

Expansion after proof: app skills, channels, Mission Copilot cleanup, deep polish.
