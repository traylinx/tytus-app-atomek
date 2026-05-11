# Atomek Rebuild Manifest

## Verdict

The current direction is too noisy. The primitives are useful, but the presentation is wrong.

Atomek should not feel like:

```text
small IDE + buttons + random agents + options
```

Atomek should feel like:

```text
team cockpit for autonomous Tytus work
```

## Core promise

A user opens Atomek and can say:

> Here is the job. Here are the files. Here is the shared folder. Use these agents. Keep everything in the mission folder. Ask me before writes/costs/messages. Show me what happened.

That is the product.

## The three required screens

### 1. Team Mission

Default screen.

Fields/actions:

- mission goal
- workspace/files picker
- shared folder / mission folder picker
- recommended team
- approval policy
- start mission
- resume previous mission

No tiny advanced options. Advanced details collapse under “details”.

### 2. Team Board

Shows current mission state.

Sections:

- mission objective
- selected resources
- tasks and owners
- live runs
- blocked approvals
- outputs/proposals
- timeline

Buttons:

- run local agent
- ask pod agent
- open terminal
- send to app skill
- ask user through channel
- approve/reject output

Every button must say what it does in plain language.

### 3. Resource Setup

Shows only capability truth.

Sections:

- local agents: ready / missing setup
- pod agents: live / installable / unavailable
- shared folders: ready / bind new
- channels: configured / setup needed
- app skills: ready / setup needed
- AIL routes: ready / disconnected

No fake availability.

## Primary user flow

```text
Start Team Mission
  -> choose workspace/files
  -> choose shared mission folder
  -> choose team preset
  -> Atomek writes mission pack
  -> agents read mission pack
  -> runs stream into timeline
  -> outputs land in runs/outputs/proposals
  -> user approves or rejects
  -> mission can resume later
```

## Team presets

### Repo repair team

- implementer: Claude or OpenCode
- reviewer: Codex or pi
- optional pod: OpenClaw for independent planning/research
- output: patch proposal + test report

### Product/content team

- planner/copy: Hermes/OpenClaw when available
- implementer: local agent
- reviewer: another local agent
- output: copy/artifacts/docs in mission folder

### Creative production team

- planner: OpenClaw/Hermes
- media: JULI3TA / Blender / Remotion skills when ready
- packager: local agent
- output: media artifacts + handoff

### Research/watch team

- pod agent: long-running research/status
- local agent: synthesis/check
- channel: Telegram/Slack/Discord approval/status
- output: report + next actions

## What to remove or hide

Remove from default experience:

- raw “Computer” label without explaining team mission value
- scattered tiny buttons for every agent before mission exists
- duplicate editor-first entry points
- resource cards that do not answer what the user can do now
- low-level command names as primary labels
- app skills that look clickable but are not configured
- generic “AI optimize” style controls with unclear effect

Keep, but subordinate:

- editor
- markdown preview
- terminal
- direct chat
- raw resource graph
- output artifacts

They are tools inside the mission, not the product center.

## First implementation sprint after this manifest

### Phase 1 — Simplify Atomek landing

Replace current default with Team Mission wizard.

Acceptance:

- first visible CTA is “Start team mission”
- user sees live counts: local agents, pods, shared folders, app skills
- no unexplained agent buttons before mission context exists

### Phase 2 — Mission/team contract

Make mission pack the single source of truth.

Acceptance:

- `MISSION.md`, `MISSION.json`, `RESOURCES.md`, `TASKS.md`, `AUDIT.jsonl`, `runs/`, `outputs/`, `proposals/` always created
- selected resources are explicit
- file visibility/scope is explicit

### Phase 3 — Team presets

Add opinionated presets.

Acceptance:

- Repo repair team
- Pod + local collaboration
- Creative production team
- Research/watch team

Each preset creates a task graph and resource suggestions.

### Phase 4 — Run and timeline cleanup

Make runs understandable.

Acceptance:

- every run has owner, status, transcript path, output files
- timeline groups events by task/agent
- failures show next action, not stack noise

### Phase 5 — Approvals and channels

Surface approvals clearly.

Acceptance:

- write approvals
- pod cost approvals
- external message approvals
- channel setup prompts

## Non-negotiable UX rules

1. One main path: mission -> team -> outputs.
2. A user must understand what an agent can see before starting it.
3. Atomek never hides work in chat state only; it writes mission files.
4. Every output must have a file path or artifact card.
5. Every risky action must have approval.
6. “Unavailable” is better than fake.
7. If a button needs explanation, the label is wrong.
8. The product should feel like commanding a team, not configuring a dashboard.

## Success test

Sebastian should be able to open Atomek and say:

> Review JULI3TA with Claude and Codex, ask OpenClaw for independent product critique, keep all context in shared folder, then show me one approved patch plan.

Atomek should produce:

- a mission folder
- selected resource list
- three task cards
- live run transcripts
- critique/output files
- approval-gated patch proposal
- resumable handoff

If this does not work, Atomek is not the product yet.
