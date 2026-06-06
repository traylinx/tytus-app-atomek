# Mission Naming Contract

## Decision

Yes: production Atomek must explicitly ask for a **mission name**.

A mission is not just a timestamped folder. The name is the user's durable handle for resuming, searching, and handing off work tomorrow.

## Three separate fields

| Field | Purpose | Editable? | Example |
|---|---|---:|---|
| Mission name | Short human handle shown in UI/lists/tabs | yes | `Fix Atomek mission runner` |
| Goal | What the team should accomplish | yes | `Make task cards run selected agents and save transcripts/proposals.` |
| Folder slug/id | Stable filesystem identity | no after create | `1790000000-fix-atomek-mission-runner` |

Do not collapse these.

## Create form

Minimum production create form:

```text
Mission name *
[ Fix Atomek mission runner                         ]

Goal *
[ Make task cards run selected agents, save outputs,
  and show mission files in Atomek.                  ]

Context
( ) Mission files only
( ) Active file
( ) Open editors
( ) Workspace folder
( ) Shared folder / Team Desk

Team preset
[ OpenClaw + Local        v ]

Approval policy
[x] Preview file edits before applying
[x] Ask before external messages/releases
[x] Ask before shell/pod cost escalation

[Create mission]
```

## Defaults

If user starts from a preset button, prefill both fields:

### Review + patch repo

```text
Mission name: Review and patch repo
Goal: Review the selected repository with local and pod agents. Save transcripts and patch proposals in the mission folder. Do not apply edits without approval.
```

### OpenClaw/Hermes + local agent

```text
Mission name: Pod and local agent review
Goal: Ask OpenClaw/Hermes for critique, run local agents for implementation/review, and keep all handoffs in the mission folder.
```

### Creative production

```text
Mission name: Creative production package
Goal: Coordinate concept/script/assets/app skills and save final outputs under the mission folder.
```

## Naming rules

- Display name: preserve user capitalization, max 80 chars.
- Folder slug: lowercase, ASCII slug, max 42 chars, prefixed by timestamp for uniqueness.
- Empty name: generate from goal's first meaningful words; fallback `Untitled mission`.
- Duplicate display names: allowed; folder IDs stay unique.
- Rename: updates `MISSION.json.title`, `MISSION.md`, visible UI, and local current mission state; does not rename folder in v1.

## UI surfaces using name

- Mission list
- Mission Board header
- Browser/window tab label when possible
- `HANDOFF.md` title
- Run transcript heading
- Approval cards
- Output artifacts

## Anti-patterns

- `Atomek team mission — ${date}` as the primary visible name. Fine for fallback folder title, bad for product UX.
- Using the goal as the only name. Goals can be long and unstable.
- Renaming the folder on title edit. Too risky for transcript links and host guards.
