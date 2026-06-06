# Plan Review — Does This Make Sense?

Verdict: **yes, with four corrections now locked into the sprint.**

The original plan had the right direction. This review tightens it into something implementable without breaking Atomek or touching TytusOS/Tytus CLI.

## Correction 1 — Mission name is required

The create flow must collect:

1. mission name
2. mission goal
3. context scope
4. team preset
5. approval policy

Current Atomek only has goal. That creates timestamp soup and makes resume unusable. See `MISSION-NAMING.md`.

## Correction 2 — Atomek-only file-read constraint must be explicit

Current host API exposes mission create/write/list/runs, but not general mission file read/list.

So implementation must not promise impossible full historical file browsing without platform changes.

Atomek-only v1 solution:

- after create/rewrite, Atomek knows generated file contents and opens them as mission-backed tabs
- saving a mission-backed tab writes that one file with `host.missions.write`
- resumed missions show known file paths and run history
- if cached/generated contents are unavailable, show `Open/refresh mission files` honestly
- optional browser folder handle can provide full read/write when user grants folder access

This keeps scope Atomek-only and avoids fake file contents.

## Correction 3 — Task-first run is the core vertical

The feature is not production-ready until this works:

```text
Create mission -> select task -> Run task -> run appears -> transcript saved -> task status updates
```

Everything else is secondary.

Do not start with approval inbox, app skills, or visual polish. First prove one real local run from one selected task.

## Correction 4 — One canonical mission view model

The current UI has duplicated Agent Team panels and duplicated task selection state. This causes drift.

Implementation must create one mission board state/view model and render from it.

No more independent left/right `selectedTaskId` / `missionTasks` calculations.

## Green-light criteria before coding

All must be true:

- sprint scope says Atomek-only
- mission naming contract exists
- Atomek-only host limitations documented
- phase order starts with extraction + view model, not giant UI rewrite
- first shippable vertical is local task run + transcript
- run/proposal/approval safety gates are specified
- QA checklist maps to user-visible flows

Status: **all true after this review pass.**

## Biggest remaining risks

### Risk 1 — WorkbenchShell is too large

Mitigation: extraction first. No new mission complexity in `WorkbenchShell.tsx` until pure modules exist.

### Risk 2 — Mission file browsing expectations exceed host API

Mitigation: generated mission-backed tabs first; honest resumed-mission fallback; optional browser folder handle.

### Risk 3 — Pod tasks may depend on host behavior that is not perfect

Mitigation: local task-first run is Phase 3. Pod task dispatch is after local run model works.

### Risk 4 — “Run task” could still feel magic/confusing

Mitigation: task detail must show resource, context visibility, run mode, and exact output destination before dispatch.

## Final product success test

A user can do this without reading docs:

1. Name a mission.
2. State a goal.
3. Create mission.
4. See mission files in Atomek.
5. Select a task.
6. Click `Run task`.
7. Watch run output.
8. Open transcript/output/proposal.
9. Approve/reject edits.
10. Resume the mission after reload.

If any step requires hidden Setup-tab spelunking, the implementation is not done.
