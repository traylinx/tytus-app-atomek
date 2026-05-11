# Product Spec — Final Atomek

## Positioning

Atomek is the Tytus Resource Fabric cockpit for autonomous work.

It coordinates:

- local AI CLIs already installed on the computer
- Tytus pod agents like OpenClaw and Hermes
- AIL model routes
- shared folders / mission folders
- app skills such as JULI3TA, Blender, Remotion/Hypermotion, API Tester
- chat channels for approvals/status
- local files and editor previews

## Main mental model

```text
Mission
  has Goal
  has Context
  has Team
  has Tasks
  has Runs
  has Outputs
  has Approvals
  has Handoff
```

The mission folder is the truth. UI reflects it.

## Primary navigation

### 1. Team Mission

Default screen.

User answers:

1. What should the team do?
2. What files/folders/shared folder may they use?
3. Which team preset should run?
4. What requires approval?

Primary CTA: `Start team mission`.

Secondary CTA: `Resume mission`.

### 2. Mission Board

Main working screen.

Sections:

- Goal and scope
- Team/resources
- Task board
- Live runs
- Timeline
- Outputs/proposals
- Approvals
- Handoff

### 3. Resource Setup

Truth/status screen.

Sections:

- Local agents
- Pod agents
- Shared folders
- App skills
- Channels
- AIL routes
- Workspace/file access

No fake actions. Every resource is `Ready`, `Needs setup`, `Unavailable`, or `Degraded`.

## Team presets

### Repo Repair Team

For code/docs/app fixes.

Default roles:

- planner: pod agent or chat copilot
- implementer: Claude or OpenCode
- reviewer: Codex, pi, Kimi, or Qwen
- gatekeeper: user approval

Outputs:

- `PLAN.md`
- run transcripts
- patch proposals
- test report
- handoff

### Pod + Local Team

For remote/local collaboration.

Default roles:

- pod: research/planning/copy/critique
- local: source-aware implementation
- reviewer: second local CLI

Outputs:

- pod critique
- local patch proposal
- review report

### Creative Production Team

For media/content/app outputs.

Default roles:

- pod/local: concept/script/planning
- JULI3TA: music/audio
- Blender/Remotion/Hypermotion: visual/render if configured
- local: packaging/docs

Outputs:

- script/concept
- media artifacts
- final bundle/handoff

### Research Watch Team

For asynchronous monitoring.

Default roles:

- pod: long-running watch/research
- channel: status/approval notifications
- local: final synthesis

Outputs:

- timeline notes
- status reports
- approval requests

## Non-goals

- Do not build another VS Code clone.
- Do not build another OpenCode/Claude clone.
- Do not expose raw tiny controls as the main UX.
- Do not run arbitrary shell text from models.
- Do not hardcode model IDs.
- Do not fake app/channel integrations.
- Do not let outputs live only in chat state.

## User value tests

A user should immediately understand:

1. “I can start a mission.”
2. “These are the agents/apps/folders/channels available.”
3. “This agent can see these files.”
4. “This run is doing this task.”
5. “This output is saved here.”
6. “This action needs my approval.”
7. “I can resume this tomorrow.”
