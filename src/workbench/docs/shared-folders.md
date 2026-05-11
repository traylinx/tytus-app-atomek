# Shared Folders and Mission Folders

Shared folders let local agents, Tytus pods, and app skills exchange ordinary files.

## Folder roles

| Path | Role |
|---|---|
| `~/Tytus/Shared` | Local same-machine drop-zone. |
| `~/Tytus/Missions/<mission>` | Per-job shared context and audit trail. |
| `/app/workspace` | Pod workspace. |
| `/app/workspace/inbox` | Pod input drop-zone. |
| `/app/workspace/out` | Pod output drop-zone. |

## Mission convention

- `MISSION.md`: goal and rules
- `RESOURCES.md`: resources selected for the job
- `TASKS.md`: task graph
- `INBOX.md`: incoming notes/findings
- `OUTBOX.md`: final handoff
- `runs/`: transcripts
- `outputs/`: generated artifacts
- `proposals/`: patches/write proposals
- `approvals/`: explicit approve/reject records

Agents should leave evidence in files. The next agent should be able to continue from the mission folder without asking the user to repeat context.
