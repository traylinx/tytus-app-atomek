# Mission Contract — Production Atomek

## Folder layout

```text
<mission>/
  MISSION.md
  MISSION.json
  RESOURCES.md
  TASKS.md
  HANDOFF.md
  INBOX.md
  OUTBOX.md
  AUDIT.jsonl
  RUNS.jsonl
  runs/
  outputs/
  proposals/
  approvals/
```

## MISSION.json target shape

```json
{
  "schemaVersion": 2,
  "missionId": "...",
  "title": "...",
  "goal": "...",
  "status": "active",
  "createdAt": "2026-06-06T00:00:00.000Z",
  "updatedAt": "2026-06-06T00:00:00.000Z",
  "rootPath": "/Users/sebastian/Tytus/Missions/...",
  "context": {
    "scope": "mission-only|active-file|open-editors|workspace-folder|shared-folder",
    "activeFile": null,
    "openEditors": [],
    "sharedFolderIds": []
  },
  "teamPreset": {
    "id": "pod-local",
    "label": "OpenClaw + Local",
    "readiness": "ready"
  },
  "resources": [
    {
      "id": "local-cli.opencode",
      "kind": "local-cli",
      "role": "implementer",
      "label": "OpenCode",
      "status": "ready",
      "canSee": ["mission-folder", "selected-context"],
      "approvalRequired": ["patch-apply", "file-write"]
    }
  ],
  "tasks": [
    {
      "id": "task-execute",
      "title": "Execute or produce artifact",
      "role": "implementer",
      "ownerResourceId": "local-cli.opencode",
      "status": "ready",
      "prompt": "...",
      "expectedOutputs": ["transcript", "artifact", "patch proposal"],
      "dependsOn": [],
      "latestRunId": null,
      "latestOutputPaths": [],
      "approvalIds": []
    }
  ],
  "runs": [],
  "approvals": []
}
```

## Task status rules

| Status | Meaning |
|---|---|
| `todo` | Known task, not ready yet because dependencies/context missing. |
| `ready` | Can be run now. |
| `running` | A run is active for this task. |
| `blocked` | Needs user/resource/setup decision. |
| `needs-approval` | Output/proposal exists and waits for user decision. |
| `done` | Accepted or no further work required. |
| `failed` | Last run failed. |

## Run record shape

```json
{
  "id": "run-...",
  "kind": "local-agent|pod-agent|app-skill|human|system",
  "resourceId": "local-cli.opencode",
  "label": "OpenCode",
  "taskId": "task-execute",
  "taskTitle": "Execute or produce artifact",
  "status": "running|complete|failed|canceling|canceled",
  "startedAt": "...",
  "finishedAt": null,
  "exitCode": null,
  "transcriptPath": "runs/...md",
  "outputPaths": [],
  "proposalPaths": [],
  "approvalIds": [],
  "summary": "..."
}
```

## Approval record shape

```json
{
  "id": "approval-...",
  "kind": "patch-apply|file-write|shell-risk|pod-cost|external-send|release",
  "status": "pending|approved|rejected|superseded",
  "createdAt": "...",
  "decidedAt": null,
  "runId": "run-...",
  "taskId": "task-execute",
  "resourceId": "local-cli.opencode",
  "title": "Apply proposed patch",
  "summary": "...",
  "proposalPath": "proposals/...md",
  "decision": null
}
```

## File generation rules

### `MISSION.md`

Human-readable brief. Must include:

- goal
- scope/context
- team/resources
- approval policy
- current next action

### `TASKS.md`

Human-readable task board. Must include each task status and owner.

### `RESOURCES.md`

Who can see what. Must not include secrets, raw tokens, private provider routes, or internal model ids.

### `HANDOFF.md`

Copy-paste resume packet. Should answer:

- what is goal
- what has been done
- what files matter
- what runs exist
- what approvals are pending
- next recommended action

### `AUDIT.jsonl`

Durable timeline. Each line:

```json
{"ts":"...","kind":"mission.created","message":"...","data":{}}
```

### `RUNS.jsonl`

Projection/cache of run records. UI may rewrite it from current state.

## Atomek-only constraints

Since this sprint cannot add new host file-read/list APIs, Atomek must distinguish:

- generated file contents it already knows and can open/save
- resumed mission paths it knows but cannot read without a folder handle or platform read API

Never show fake file contents.
