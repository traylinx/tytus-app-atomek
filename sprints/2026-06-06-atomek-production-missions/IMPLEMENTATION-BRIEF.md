# Implementation Brief — Production Mission Feature

This is the execution order to follow when implementation starts.

## Prime directive

Do not rewrite Atomek. Connect the existing pieces into a coherent mission loop.

Existing pieces to preserve:

- mission file writer
- resource graph
- team preset builder
- local job runner
- pod task runner
- chat/pod target selector
- Monaco editor tabs
- patch parser and preview dialog
- output artifacts panel

## Target data flow

```text
CreateMissionForm
  -> MissionDraft { name, goal, contextScope, teamPreset, approvalPolicy }
  -> host.missions.create({ title: name, goal })
  -> buildMissionPack(draft, resourceGraph)
  -> host.missions.write(pack files)
  -> MissionBoardViewModel
  -> open mission-backed tabs for MISSION.md/TASKS.md/RESOURCES.md/HANDOFF.md
```

Run flow:

```text
TaskCard click
  -> selectedTask
  -> TaskDetail shows owner/context/run modes
  -> Run task
  -> dispatchTask(task, selectedResource, mode)
    -> local-cli: host.local.runJob/streamJob
    -> pod-agent: existing runPodTask/chatAgent route
    -> app-skill: attach skill/open chat/app placeholder run
  -> run record appears immediately
  -> transcript saved
  -> task status updates
  -> proposal detector runs
  -> approval item created if needed
```

## File/module plan

Create Atomek-only modules:

```text
src/workbench/missions/missionTypes.ts
src/workbench/missions/missionNaming.ts
src/workbench/missions/missionFiles.ts
src/workbench/missions/missionTeams.ts
src/workbench/missions/missionTasks.ts
src/workbench/missions/missionRuns.ts
src/workbench/missions/missionApprovals.ts
src/workbench/missions/missionBoardModel.ts
```

Optional components after extraction:

```text
src/workbench/components/missions/CreateMissionForm.tsx
src/workbench/components/missions/MissionBoard.tsx
src/workbench/components/missions/MissionFileTree.tsx
src/workbench/components/missions/TaskBoard.tsx
src/workbench/components/missions/TaskDetail.tsx
src/workbench/components/missions/RunDock.tsx
src/workbench/components/missions/ApprovalInbox.tsx
```

Keep imports local and simple. Do not introduce a new state library.

## Phase-by-phase coding sequence

### Phase 0 — Pure extraction

Move existing pure functions out of `WorkbenchShell.tsx`:

- team preset definitions
- resource matching
- mission slug/name helpers
- mission file builders
- task builders
- run sort/filter helpers

No visual change.

Gate:

```bash
npm run typecheck
```

### Phase 1 — Mission draft/create form

Add explicit mission name field and approval/context fields.

Replace ambiguous default title with user-facing title.

Current bad fallback:

```ts
title: `Atomek team mission — ${new Date().toLocaleString()}`
```

Target:

```ts
title: draft.name || nameFromGoal(draft.goal)
```

Folder slug still handled by host. Do not rename mission folders.

Gate:

- create mission with custom name
- resume list shows custom name
- MISSION.md/HANDOFF.md show custom name

### Phase 2 — Mission-backed tabs

Add a mission-backed file source type to Atomek tabs without breaking existing local files.

Required metadata:

```ts
source: 'mission'
missionId
rootPath
relPath
```

Save behavior:

```ts
host.missions.write({ rootPath, files: [{ path: relPath, content }] })
```

Generated files should open automatically after mission creation:

- `MISSION.md`
- `TASKS.md`
- `RESOURCES.md`
- `HANDOFF.md`

Gate:

- edit/save `MISSION.md`
- reload does not claim unread contents unless cached/available

### Phase 3 — Mission Board view model

Build a single `MissionBoardViewModel`:

```ts
{
  mission,
  files,
  tasks,
  selectedTask,
  team,
  runs,
  outputs,
  approvals,
  warnings,
  primaryAction
}
```

Use it for both main and dock render. Remove duplicate task state.

Gate:

- left/right panels do not drift
- README.md is not counted as run

### Phase 4 — Task-first dispatch

Add `Run task` in Task Detail.

Dispatcher rules:

| Resource kind | Primary action |
|---|---|
| local-cli ai-cli | background run |
| local-cli terminal | supervised terminal |
| pod-agent | ask pod/run pod task |
| app-skill | attach to chat + create app-skill run note |
| shared-folder | open mission/team desk instructions |
| missing/setup | show setup action |

Gate:

- OpenCode task runs from task card
- transcript saved
- task status updates

### Phase 5 — Proposal/approval loop

Use existing patch parser and preview dialog.

Minimum v1:

- detect unified diff/fenced replacement in run output
- save proposal markdown/json
- show approval card
- preview/apply/reject
- write decision

Gate:

- patch output never silently applies
- approval decision survives refresh via mission files/cache

### Phase 6 — Pod/app skill polish

Only after local run vertical works.

- pod task should use sanitized host bridge
- app-skill task should produce visible run/proposal/output placeholder
- missing tools show setup-needed, not broken buttons

## Definition of done

Feature is done when the happy path works live:

```text
New mission named "Fix Atomek mission runner"
-> mission files visible/editable
-> Execute task with OpenCode
-> run streams in UI
-> transcript saved under runs/
-> task status complete/failed/needs approval
-> proposal shown if patch output exists
-> mission resumes after reload
```

## Do not do during implementation

- Do not touch TytusOS/Tytus CLI to solve file reads.
- Do not add catalog/release changes until feature passes live QA.
- Do not add a second editor or second chat system.
- Do not let Setup stay the main work path.
- Do not show fake mission file contents.
