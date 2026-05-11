# Atomek Implementation Brief: From Noisy Workbench to Team Cockpit

## Diagnosis

The current Atomek UI has working primitives but exposes them at the wrong level:

- too many small controls before the user has a mission
- unclear difference between local agents, pod agents, app skills, AIL, and terminal
- resource graph is visible but not transformed into “who should do what”
- editor/chat/options compete with the actual product value
- mission pack exists, but feels like backend detail instead of the center

## New center

Default screen must answer:

1. What is the mission?
2. What context/files may the team use?
3. Which team should work?
4. What needs approval?
5. Where are outputs?

Everything else is secondary.

## Replace the default experience

### Old first impression

```text
editor + chat + computer panel + tiny buttons + resource cards
```

### New first impression

```text
Start a Team Mission
  Goal: ______________________
  Context: [workspace] [shared folder] [mission folder]
  Team: [Local agents] [Pods] [Apps] [Channels]
  Safety: [preview writes] [ask before external messages] [ask before paid pods]
  CTA: Start mission
```

## Three screens only

### 1. Team Mission

Purpose: create/resume mission.

Visible controls:

- goal textarea
- context picker
- team preset picker
- approval policy
- start/resume buttons

Hidden/collapsed:

- raw resource JSON
- exact CLI commands
- debug warnings

### 2. Mission Board

Purpose: run and observe work.

Visible sections:

- objective
- selected team
- tasks by owner
- live timeline
- outputs/proposals
- approvals

No “random agent buttons”. Actions attach to tasks.

### 3. Resource Setup

Purpose: truth/status/setup.

Visible sections:

- local agents
- pod agents
- shared folders
- app skills
- channels
- AIL routes

Each item is one of:

- Ready
- Needs setup
- Unavailable
- Degraded

## Team presets

### Repo Repair

- Claude/OpenCode: implement
- Codex/pi/Kimi: review
- OpenClaw: independent critique when available
- Output: patch proposal + test report

### Product Brainstorm + Build

- Pod: broad planning/research
- Local CLI: implementation
- Reviewer: second local CLI
- Output: PR-ready plan or patch proposal

### Creative Production

- Pod: creative direction
- JULI3TA: music/audio
- Blender/Remotion/Hypermotion: visual/render when configured
- Local CLI: packaging/docs

### Research Watch

- Pod: long-running watch
- Channel: status/approval
- Local CLI: synthesis

## Implementation phases

### Phase 1 — Landing simplification

- Replace current default/Computer-first copy with Team Mission copy.
- Show resource counts only as confidence indicators.
- Move advanced resource cards behind “Resource setup”.

### Phase 2 — Mission as source of truth

- Always create `outputs/`, `proposals/`, `approvals/`.
- Show mission folder path prominently.
- Make `MISSION.md`/`RESOURCES.md` readable from UI.

### Phase 3 — Task-first runs

- User chooses task, then resource.
- Run button label: “Ask Claude to implement task”, “Ask OpenClaw to critique”, etc.
- Every run writes transcript and summary.

### Phase 4 — Pod and app dispatch

- Add pod-agent adapter through Tytus host/tray proxy.
- Add app-skill adapter cards only for configured skills.
- Save output artifacts into mission folder.

### Phase 5 — Approvals + channels

- Approval inbox on Mission Board.
- External message draft/approval flow.
- Channel setup prompts separate from mission actions.

## Product rules

- No fake integrations.
- No hardcoded model IDs.
- No arbitrary browser shell.
- No hidden chat-only state.
- No tiny unexplained controls in the primary path.
- Files and folders are the collaboration substrate.
- Atomek is the control tower, not another agent runtime.
