# Current-State Audit — Atomek Agent Team / Missions

## Snapshot

Live Atomek/Tytus host reported during audit:

```text
30 resources
10 local-cli resources
3 pod-agent resources
2 shared-folder resources
1 ail-route resource
13 app-skill resources
3 warnings: gemini/qwen/goose missing
2 mission folders under /Users/sebastian/Tytus/Missions
```

The source repo is clean and Atomek v0.4.33 is released. The issue is not release state; it is product flow.

## Existing surfaces

### Landing / Agent Team hero

File: `src/workbench/components/WorkbenchShell.tsx`

The hero has:

- mission goal textarea
- `Start mission`
- `Open team board`
- `Open chat`
- team preset cards
- resource inventory cards
- first-mission preset buttons
- resume list

`Start mission` currently means: create a mission folder and write context files. It does not start agents.

### Agent Team side/dock panel

The panel has tabs:

- `Mission`
- `Runs`
- `Setup`

Mission tab shows:

- current mission pack
- selected team assignments
- refresh/rewrite context files
- resume list
- active context
- task prompt presets
- task graph cards

Setup tab shows:

- resource graph
- local agents and terminal launch controls
- app skills

Runs tab shows:

- active local/pod run state
- run history from `RUNS.jsonl` / `runs/`

## Current implementation behavior

### Mission creation

`MissionControlHome.startMission()`:

1. calls `host.missions.create({ title, goal })`
2. receives `{ missionId, title, goal, rootPath }`
3. writes mission files through `host.missions.write(...)`
4. saves current mission in localStorage
5. opens team board

Files written:

```text
MISSION.md
MISSION.json
RESOURCES.md
TASKS.md
HANDOFF.md
INBOX.md
OUTBOX.md
AUDIT.jsonl
RUNS.jsonl
runs/README.md
outputs/README.md
proposals/README.md
approvals/README.md
NEXT.md
```

### Team assignment

`buildTeamPresetPreview(graph, presetId)` maps current resources to roles:

- planner
- implementer
- reviewer
- team-desk
- optional app-tool

This is a computed preview, not an execution graph.

### Task cards

`buildMissionTasks(...)` generates four default tasks:

1. Scope mission and context
2. Execute or produce artifact
3. Drive app skill
4. Review and hand off

Clicking a task card only loads the prompt:

```ts
setSelectedTaskId(task.id)
setJobPrompt(task.prompt)
```

It does not dispatch to the assigned resource.

### Local execution

`runLocalJob(tool)` exists and works through `host.local.runJob/streamJob/cancelJob`.

But it is tool-first and hidden under `Setup -> Local Agents & Terminal`.

### Pod execution

`runPodTask(resource)` exists.

But pod-agent buttons are hidden inside the truncated resource list in Setup. The Mission tab can say `Planner: OpenClaw pod 01` without showing a direct `Ask Planner` action.

### App skills

`Use in chat` inserts/attaches skill instructions into chat. It does not run a mission task by itself.

## Why the UX feels broken

The UI presents a task/team workflow but the primary visible controls do not execute it.

```text
Looks like: choose team -> click task -> agent runs
Actually: choose team -> click task -> prompt changes -> go to Setup -> choose tool -> background review
```

This is not discoverable.

## Specific problems

### P0 — No obvious task dispatch

Mission tab needs a primary action for selected task:

```text
Run selected task
```

with resource choices derived from the selected task role.

### P0 — Mission files are invisible

The mission folder is the source of truth, but Atomek does not show its file tree or open/edit `MISSION.md`, `TASKS.md`, etc. directly after creation.

User expects: create mission -> see the folder/files in Atomek.

### P0 — Duplicate Agent Team panels

The left sidebar and right dock can show similar Agent Team content at once. They drift visually and mentally.

### P0 — `Start mission` naming mismatch

It creates a mission pack. It does not start agent execution.

Name should become one of:

- `Create mission`
- `Create mission folder`
- `Start team mission` only if next screen immediately offers run action

### P0 — run count bug

Current host `runCount` can count `runs/README.md` as a run. Atomek can mitigate by filtering `README.md` client-side in visible counts/history until host changes are allowed.

### P1 — task state is fake/static

Tasks have statuses (`ready`, `waiting`) but clicking/running does not update mission task state persistently.

### P1 — “Use” buttons are ambiguous

Resource `Use` currently means “select resource into prompt/context,” not “run it.” It should be renamed or moved.

### P1 — app-skill actions are unclear

`Use in chat` is valid, but not enough for mission flow. App skills need mission-scoped actions:

- attach skill instructions to mission
- create app run record
- open target app with mission context when possible

### P1 — no mission file refresh/open/edit path

`Rewrite context files` updates files, but user cannot inspect what changed from inside the mission surface.

### P2 — approval inbox is not first-class

Patch preview exists elsewhere. Mission proposals/approvals folders exist. They are not tied into a visible inbox.

## Existing assets to preserve

Do not throw these away:

- mission file writer
- resource graph discovery
- team preset engine
- local job runner
- pod chat/task bridge
- chat target selector
- Monaco/editor/file explorer
- patch parser/review dialog
- output artifact panel
- embedded docs/skills

The fix is mostly product orchestration and wiring, not a rewrite.
