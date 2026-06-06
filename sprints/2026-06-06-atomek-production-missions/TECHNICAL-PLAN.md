# Technical Plan — Atomek-Only Production Missions

## Scope boundary

This plan assumes no changes outside `tytus-app-atomek`.

Allowed:

- `src/workbench/components/WorkbenchShell.tsx`
- new Atomek-only modules under `src/workbench/missions/`
- Atomek CSS
- Atomek docs/skills if needed
- Atomek tests/scripts if present/added
- sprint docs

Forbidden in this sprint:

- TytusOS host implementation
- Tytus CLI tray server
- app catalog
- other app repos

## Existing host APIs available

From current Atomek/Tytus runtime:

```ts
host.resources.list()
host.missions.list()
host.missions.listRuns(rootPath)
host.missions.create({ title, goal })
host.missions.write({ rootPath, files })
host.local.listTools()
host.local.runJob(...)
host.local.streamJob(...)
host.local.cancelJob(...)
host.local.openTerminal(...)
host.skills.list()
host.daemon.chatAgent(...) // used by chat/pod target bridge
```

Atomek should build the production mission UI on top of these.

## Proposed Atomek module split

Current `WorkbenchShell.tsx` is carrying too much mission logic. Extract without behavior changes first.

```text
src/workbench/missions/
  missionTypes.ts
  missionStorage.ts
  missionFiles.ts
  missionTasks.ts
  missionTeams.ts
  missionRuns.ts
  missionApprovals.ts
  missionBoardModel.ts
```

### `missionTypes.ts`

Define stable app-side types:

```ts
type MissionTaskStatus =
  | 'todo'
  | 'ready'
  | 'running'
  | 'blocked'
  | 'needs-approval'
  | 'done'
  | 'failed';

type MissionRunKind = 'local-agent' | 'pod-agent' | 'app-skill' | 'human' | 'system';

type MissionApprovalKind =
  | 'patch-apply'
  | 'file-write'
  | 'shell-risk'
  | 'pod-cost'
  | 'external-send'
  | 'release';
```

### `missionFiles.ts`

Responsibilities:

- build initial file pack
- parse mission files
- filter generated README run placeholders
- normalize mission file tree for UI
- protect dirty editor tabs from generated overwrites

### `missionTeams.ts`

Move:

- `TEAM_PRESET_DEFINITIONS`
- `buildTeamPresetPreview`
- resource-to-role mapping

Add:

- task owner resource selection
- fallback resource list per role
- `resourceCanRunTask(resource, task)` helper

### `missionRuns.ts`

Responsibilities:

- convert local/pod/app execution into one `MissionRunRecord`
- upsert `RUNS.jsonl`
- derive task status from latest runs
- filter fake `README.md` transcript rows

### `missionBoardModel.ts`

Build a single view model from:

- current mission
- mission files
- resource graph
- local tools
- skills
- runs
- active file/open editors

This prevents left/right panels from computing divergent states.

## Implementation strategy

### Step 1 — Extract pure logic, no UX change

Move mission/team/task generation functions out of `WorkbenchShell.tsx`.

Risk: low if tests/typecheck pass.

### Step 2 — Make mission file tree visible

Atomek-only options:

1. Use existing `host.missions.write` for writes and add read capability by using browser fetch? Not available through host API.
2. Use the local path only for display and open via existing browser File System Access if user grants folder handle.
3. Since mission files are known immediately after Atomek writes them, keep a local in-memory/cache projection and allow opening generated files as Atomek tabs. For existing/resumed missions, use `host.missions.listRuns` only for runs unless external read API exists.

Production target wants full read. Atomek-only first version can:

- show mission file tree
- open generated file contents immediately after create/rewrite
- for resumed missions, show path + `Open folder` prompt if browser handle/read bridge is unavailable

But because Sebastian explicitly expects “show the folder all the files also in Atomek,” the strongest Atomek-only path is:

- after `host.missions.create/write`, automatically open the generated files as virtual editor tabs
- mark them as mission-backed
- `Save` writes that single file back via `host.missions.write({ rootPath, files: [{ path, content }] })`

This avoids needing a new host read endpoint for newly created/rewritten files.

For resumed missions:

- if no file contents cached, show file list and a `Rewrite/load context pack` action to regenerate known files into tabs
- do not pretend arbitrary old file contents were read if we cannot read them from host

### Step 3 — Task-first dispatcher

Add a primary `Run selected task` action on Mission tab/board.

Decision logic:

```ts
if task.owner.kind === 'pod-agent': runPodTask(owner)
else if task.owner.kind === 'local-cli': runLocalJob(ownerTool)
else if task.owner.kind === 'app-skill': attachSkillToChat(skill) + create app-skill run placeholder
else if task.owner.kind === 'shared-folder': open mission folder/team desk instructions
else show setup-needed
```

Keep advanced alternatives:

- `Run in background`
- `Open in Terminal`
- `Ask pod`
- `Use in chat`

But one primary button should exist.

### Step 4 — Persist task state

Update `MISSION.json` and `TASKS.md` when:

- task selected? no persistent write needed
- run starts -> status `running`
- run exits 0 -> `done` or `needs-approval` if proposal detected
- run exits nonzero -> `failed`
- user marks blocked/done -> persist

Use `host.missions.write` to update `MISSION.json`, `TASKS.md`, `AUDIT.jsonl`, `RUNS.jsonl` projection.

Caveat: `AUDIT.jsonl` append-only is hard with write-only replace. Atomek can maintain audit in state and rewrite whole audit file. True append endpoint is platform backlog, not this sprint.

### Step 5 — Proposal/approval wiring

Reuse existing patch parser and preview dialog.

Flow:

1. run completes
2. parse transcript for patch candidates
3. create `proposals/<run-id>-patch.md` virtual/backed file
4. create approval record in `approvals/<approval-id>.json`
5. show Approvals tab badge
6. user previews/applies/rejects
7. write decision to approvals + audit

### Step 6 — Consolidate duplicated panes

Use a shared view model for sidebar and dock, or make one canonical Mission Board component rendered in either location.

Avoid current drift:

- left panel and right panel both showing Agent Team with independent selected tasks
- status/active cards duplicated

## Risks and mitigations

### Risk — resumed mission file contents cannot be read via host API

Mitigation:

- Do not fake reads.
- Show known file paths and provide `Load/regenerate context files` for Atomek-generated files.
- Use browser folder picker as optional read/write handle if user wants full file browsing.
- Track platform backlog: add `host.missions.read/listFiles` later, outside this sprint.

### Risk — local job runner may write to source if wrong mode

Mitigation:

- keep existing read-only/planning modes
- prompt explicitly requires proposal/diff only
- approval gate before apply

### Risk — pod output not streamed cleanly

Mitigation:

- use existing `runPodTask` behavior first
- if streaming is weak, show running then final transcript
- never direct-fetch raw pod URLs

### Risk — huge WorkbenchShell gets worse

Mitigation:

- extraction first
- pure modules + simple view model
- no broad redesign before tests pass

## Minimal production vertical

The smallest version worth shipping:

1. Create mission.
2. Mission files show as openable/editable Atomek tabs.
3. Task cards have `Run task`.
4. Local OpenCode background run works from selected task.
5. Transcript saved under `runs/` and visible in Runs tab.
6. Run status updates selected task.
7. Patch-like output becomes preview/approval candidate.

After this works, add pod/app skill refinements.
