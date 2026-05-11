# Tytus Mission Protocol

## Purpose

This is the contract that lets local agents, Tytus pod agents, app skills, and the user work as one team without hiding state inside chat windows.

A mission is not a chat thread. A mission is a durable folder with a goal, selected resources, scoped files, transcripts, proposals, outputs, and approvals.

## Folder layout

```text
<mission>/
  MISSION.md          human-readable source of truth
  MISSION.json        typed machine-readable state
  RESOURCES.md        who is on the team and what each resource can see
  TASKS.md            task graph, owner, status, dependencies
  HANDOFF.md          copy-paste resume packet for any new agent/window
  INBOX.md            incoming notes from agents, pods, apps, channels
  OUTBOX.md           approved final outputs
  AUDIT.jsonl         append-only timeline
  RUNS.jsonl          run index
  runs/               one folder/file per agent/app run
  outputs/            generated artifacts
  proposals/          patches/changes waiting for approval
  approvals/          explicit approval requests and decisions
```

## Core rule

Every agent starts by reading:

1. `MISSION.md`
2. `RESOURCES.md`
3. `TASKS.md`
4. latest entries in `RUNS.jsonl` / `runs/`
5. `INBOX.md` for new handoffs

Every agent ends by writing:

1. transcript under `runs/<run-id>/transcript.md`
2. machine summary under `runs/<run-id>/summary.json`
3. proposed edits under `proposals/` when changes are suggested
4. final artifacts under `outputs/` only when approved or explicitly requested
5. an audit event to `AUDIT.jsonl`

## Resource visibility contract

Each resource must declare what it can see before it runs.

| Resource | Can see | Cannot assume |
|---|---|---|
| Browser Atomek editor | user-selected File System Access handles | full disk paths unless user selected them |
| Local CLI agent | mission folder plus launched cwd/scope | permission to blindly edit source files |
| Tytus pod agent | pod workspace, pushed files, provisioned shared folders | full local computer filesystem |
| Shared folder | files synced through garagetytus binding | instant sync if network/bucket degraded |
| App skill | files/artifacts explicitly handed to app | global app state unless driver exposes it |
| Chat channel | approved messages/status | permission to auto-send private/external content |

## Approval gates

Approval is required for:

- applying patches to source workspace
- deleting or overwriting files
- running non-allowlisted shell commands
- consuming paid pod units or installing a new pod agent
- sending external messages via Telegram/Slack/Discord/LINE/etc.
- publishing/deploying/releasing anything

Approval records live in `approvals/` and are summarized in `AUDIT.jsonl`.

## Run types

| Type | Example | Output |
|---|---|---|
| local-agent | Claude/OpenCode/Codex/pi/Kimi run | transcript + proposals |
| pod-agent | OpenClaw/NemoClaw/Hermes task | transcript + pod artifacts |
| app-skill | JULI3TA, Blender, Remotion, API Tester | artifact paths + preview |
| channel | Telegram/Slack approval/status | approved message record |
| human | Sebastian edits/approves | decision + rationale |

## Minimum mission JSON shape

```json
{
  "missionId": "...",
  "title": "...",
  "goal": "...",
  "createdAt": "...",
  "updatedAt": "...",
  "workspace": {
    "label": "...",
    "scope": "selected-folder|selected-files|mission-only|shared-folder"
  },
  "resources": [
    {
      "id": "local-cli.claude",
      "kind": "local-cli",
      "role": "implementer",
      "status": "ready",
      "canSee": ["mission-folder", "selected-workspace"],
      "approvalRequired": ["write-source", "shell-risk"]
    }
  ],
  "tasks": [
    {
      "id": "task-1",
      "title": "Review repo",
      "ownerResourceId": "local-cli.codex",
      "status": "pending|running|blocked|done",
      "dependsOn": []
    }
  ]
}
```

## Success condition

A mission can be resumed tomorrow by any capable agent without asking the user what happened, because the folder contains the truth.
