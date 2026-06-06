# UX Architecture — Final Mission Workbench

## Proposed navigation

Atomek keeps editor/chat/output capabilities, but the mission flow owns the product center.

```text
Primary modes:
  1. Mission Board
  2. Files / Editor
  3. Chat
  4. Outputs / Approvals
  5. Resource Setup
```

The current `Agent Team` page should become:

```text
Mission Home
  - New mission
  - Resume mission
  - Resource readiness summary
```

After mission creation, default screen should be:

```text
Mission Board
  left: mission file tree + mission metadata
  center: task board + selected task detail
  right: runs/outputs/approvals/chat context dock
```

## Mission Board layout

### Header

- Mission title
- root path
- status badge
- resource health summary
- buttons:
  - `Open folder in Atomek`
  - `Rewrite context pack`
  - `New task`
  - `Export handoff`

### Left rail — Mission Files

Tree rooted at mission folder:

```text
MISSION.md
TASKS.md
RESOURCES.md
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

Click opens file in existing editor tabs.

Rules:

- Generated context rewrite must not silently clobber dirty editor tab.
- If user edits `TASKS.md` or `MISSION.json`, UI should show reload/sync prompt.
- Minimum first implementation can load files read-only if writing arbitrary mission files is risky; but production target is edit/save.

### Center — Task Board

Task card states:

- `todo`
- `ready`
- `running`
- `blocked`
- `needs-approval`
- `done`
- `failed`

Each task card shows:

- title
- owner role
- assigned resource
- last run/result
- next action

Clicking card opens detail.

### Task Detail

Contains:

- editable prompt
- assigned resource selector
- context visibility summary
- expected outputs
- run mode selector
- primary CTA: `Run task`
- secondary CTAs:
  - `Open in Terminal`
  - `Ask pod`
  - `Use in chat`
  - `Mark blocked`
  - `Mark done`

The available buttons depend on resource kind.

### Right dock — Runs / Outputs / Approvals

Tabs:

- Runs
- Outputs
- Approvals
- Chat

Runs tab:

- active run stream
- cancel if supported
- saved transcript path
- run history

Outputs tab:

- artifacts from `outputs/`
- saved chat answers
- generated files

Approvals tab:

- pending patch proposals
- shell risk approvals
- external-send approvals
- approval decisions

Chat tab:

- existing Atomek/pod chat composer
- target selector already improved in v0.4.33

## Resource Setup layout

Setup should not be where work starts. It configures resources.

Sections:

- Local CLIs
- Pod agents
- Shared folders
- App skills
- AIL route
- Missing tools

Actions:

- `Use for mission` -> assigns resource to selected task/team
- `Setup` -> copies command/deep link
- `Test` -> checks availability if existing API allows

Avoid ambiguous `Use` alone.

## Naming fixes

| Current | Proposed |
|---|---|
| Start mission | Create mission / Start team mission only if board opens with Run task |
| Start mission pack | Create mission folder |
| Refresh mission pack | Rewrite context pack |
| Use | Assign to task / Add to mission |
| Background review | Run in background |
| Open X in Terminal | Supervised terminal run |
| Agent Team | Mission Board / Resource Setup depending context |

## Empty states

### No mission

Show:

```text
No active mission.
Create a mission to generate a durable folder with tasks, context, runs, outputs, approvals, and handoff.
[Create mission]
[Resume existing]
```

### No active file

Do not say only “No active file.” Explain options:

```text
No source context selected.
This task will run with mission files only.
Open a file or folder if the agent should inspect local code/docs.
```

### Missing runner

If selected task owner is missing:

```text
OpenCode is not available. Choose another ready implementer or open Resource Setup.
```

## What user should do in Sebastian's screenshot

Current correct path is too hidden:

```text
Mission tab -> select task -> Setup tab -> Background review/Open Terminal -> Runs tab
```

Target path:

```text
Mission tab -> select task -> Run task
```
