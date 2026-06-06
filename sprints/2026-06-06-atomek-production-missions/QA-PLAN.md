# QA Plan — Production Atomek Missions

## Static gates

Run from Atomek repo:

```bash
npm run typecheck
npm run build
npm run release:check
```

## Live smoke setup

Use Tytus OS at:

```text
http://localhost:4242
```

Verify Atomek resource state through host UI and, if needed, same-origin endpoints.

## Core QA scenarios

### Scenario A — Create mission

1. Open Atomek.
2. Click Create/New mission.
3. Enter goal: `Review this repo and propose safe UI fixes.`
4. Choose `OpenClaw + Local`.
5. Create mission.

Expected:

- Mission Board opens.
- Mission root path shown.
- Mission file tree visible.
- `MISSION.md`, `TASKS.md`, `RESOURCES.md`, `HANDOFF.md` open in Atomek.
- No agent run starts until user clicks run.

### Scenario B — Edit mission context

1. Open `MISSION.md`.
2. Edit one line.
3. Save.
4. Rewrite context pack.

Expected:

- Dirty warning if overwrite would happen.
- Saved content not silently lost.

### Scenario C — Run local task

1. Select `Execute or produce artifact`.
2. Resource: OpenCode.
3. Click `Run task`.

Expected:

- Run appears immediately in Runs.
- Task status becomes running.
- Transcript path appears.
- On completion, status is complete/failed.
- `RUNS.jsonl` has real run record.

### Scenario D — Run pod planner task

1. Select `Scope mission and context`.
2. Resource: OpenClaw pod.
3. Click `Run task` / `Ask pod`.

Expected:

- No raw pod id/route/provider leaks.
- Output saved as transcript.
- Failure states are user-safe.

### Scenario E — Proposal approval

1. Run a local task that outputs a unified diff.
2. Atomek detects proposal.
3. Open Approvals.
4. Preview patch.
5. Reject first, then approve a safe one.

Expected:

- Proposal stored under `proposals/`.
- Decision stored under `approvals/` and audit.
- Patch apply uses existing preview machinery.

### Scenario F — Resume mission

1. Reload browser/Tytus OS.
2. Open Atomek.
3. Resume previous mission.

Expected:

- Mission Board state restored.
- Run history visible.
- Pending approvals visible.
- Mission files visible at least as known paths; generated/cached files open if available.

## Regression checks

- Chat target selector still works.
- Atomek chat default target still works.
- Pod-agent chat still works.
- Active file context still attaches to chat.
- Existing Monaco editor save/open still works.
- Project index search still works.
- Output artifact panel still works.
- App skill `Use in chat` still works.
- No hardcoded model/provider ids added.
- No blind writes to workspace files.

## Known Atomek-only limitations to verify honestly

- Existing host API does not expose general mission file read/list.
- For resumed missions, Atomek may need cached/generated contents or a user-selected folder handle to open arbitrary existing mission files.
- Do not claim full mission file browsing if implementation only supports generated files.
