# Tytus Agent Team Manifest

## One-sentence product

Tytus turns a computer and private pods into an autonomous agent team that can share files, exchange context, work in parallel, report through chat channels, and leave every result in a mission folder the user controls.

## What the user has

### 1. Local agents on the computer

These are CLIs installed on the user's machine and launched through the Tytus host bridge.

Current detected ready local agents:

- Claude Code
- OpenCode
- Codex
- pi
- Gemini
- Qwen
- Kimi
- Aider
- Tytus Terminal

What they are good for:

- reading local repos
- editing local files after explicit approval path
- running tests
- reviewing code
- comparing plans
- producing transcripts and patches
- using the user's already-configured local environment

Important boundary:

- Atomek should not run arbitrary shell text produced by an AI.
- Atomek should dispatch allowlisted local tools with a mission prompt.
- File writes should become previews/artifacts first unless the user explicitly approves a write path.

### 2. Tytus pod agents

Pods are remote/private agent runtimes connected through the Tytus tunnel and tray proxy.

Current live allocation on Sebastian's machine:

- pod `01`: OpenClaw agent, ready
- pod `02`: OpenClaw agent, ready
- pod `04`: included AIL gateway, ready

Supported agent families in the platform:

- OpenClaw: lightweight autonomous agent runtime, chat/channel integrations, web/reasoning/tool workflows.
- Hermes: heavier Nous/Hermes-style gateway; supported by Tytus, costs 2 units, but not currently allocated in this live snapshot.
- AIL gateway: model gateway route for chat/completions and app AI calls.

What pod agents are good for:

- long-running remote thinking/research
- chat-channel-based interaction
- work that should not depend on a local browser tab staying open
- agent teamwork where local and remote agents read/write through a shared mission folder

Important boundary:

- Do not imply every pod can see the whole computer by default.
- Use mission folders/shared folders as the controlled exchange surface.
- Pod cost and unit use must be visible before dispatch.

### 3. Shared folders

Shared folders are the common desk for the team.

Current live binding:

```text
Label: shared
Local path: /Users/sebastian/MAKAKOO/data/shared/
Bucket: shared
Auto-sync: true
Provisioned pods: wannolot-01, wannolot-02, wannolot-04
```

What this enables:

- local agents can write a plan, patch, transcript, or artifact
- pod agents can pick it up in their provisioned shared folder
- another agent can continue from the same durable files
- the user can inspect everything directly on disk

Shared folders are the reason Tytus can become a team system instead of isolated chat windows.

### 4. Mission folders

Mission folders are per-task folders under:

```text
/Users/sebastian/Tytus/Missions/
```

A good mission folder contains:

```text
MISSION.md       human-readable goal, constraints, current state
MISSION.json     typed machine-readable contract
RESOURCES.md     selected agents, pods, folders, app skills
TASKS.md         task graph / owners / dependencies
HANDOFF.md       copy-paste summary for another agent/window
INBOX.md         incoming notes from agents/pods/apps
OUTBOX.md        approved outputs and final handoff
AUDIT.jsonl      append-only event log
runs/            agent transcripts and run outputs
outputs/         generated artifacts
proposals/       patches or changes waiting for approval
```

This is the central primitive. If an agent gets lost, it should read `MISSION.md`, `RESOURCES.md`, `TASKS.md`, and latest `runs/`.

### 5. Chat channels

Tytus already has channel concepts for agents.

Current platform surfaces mention or support:

- Telegram
- Discord
- Slack
- LINE
- OpenClaw broader messenger extensions such as Signal, iMessage, Matrix, Teams, Google Chat, Mattermost and others where configured

What channels are for:

- user can talk to an agent outside the Tytus desktop
- agent can ask for approval or clarification
- team can notify when a mission is blocked or finished

Important boundary:

- Atomek must show only configured/available channels as actionable.
- Unconfigured channels should be setup prompts, not fake buttons.
- Never auto-send external messages without explicit user approval.

### 6. Tytus files and pod file transfer

Tytus exposes:

- local Tytus Home: `/Users/sebastian/Tytus`
- shared folders via garagetytus
- pod inbox/outbox/workspaces through Files and CLI
- `tytus push`, `tytus pull`, `tytus ls`, `tytus rm`, `tytus transfers`

Use cases:

- push a small file/folder into a pod workspace
- pull a result back
- inspect pod inbox/outbox
- use shared folder for larger/continuous collaboration

Boundary:

- `tytus push` refuses transfers over 100 MB.
- Large or ongoing work should use shared folders, not base64/API payloads.

## How a user should use this system

### Flow 1 — Team code review and patch

1. Open Atomek.
2. Start a mission: “Review this repo and propose safe improvements.”
3. Select local workspace folder.
4. Attach shared folder or mission folder.
5. Pick implementer: OpenCode or Claude.
6. Pick reviewer: Codex, pi, Kimi, or pod OpenClaw.
7. Atomek writes the mission pack.
8. Agents read the same mission pack and write transcripts/proposals.
9. Atomek shows timeline and patch approval.
10. User applies approved changes.

### Flow 2 — Local + pod collaboration

1. User starts mission with local repo and shared folder.
2. Pod OpenClaw/Hermes does planning/research/copy.
3. Local agent reads the pod output and patches local files.
4. Reviewer agent checks the patch.
5. Atomek records all steps in `AUDIT.jsonl` and `runs/`.

### Flow 3 — Creative production team

1. User drops assets into shared folder.
2. Hermes/OpenClaw writes concept/script.
3. JULI3TA creates audio where needed.
4. Remotion/Blender/app skills create visual artifacts when installed.
5. Atomek stores outputs and shows previews.
6. User approves final bundle.

### Flow 4 — Chat-channel mission

1. User links Telegram/Slack/Discord/LINE for an agent.
2. Mission runs in the background.
3. Agent sends a blocked/finished status to the configured channel.
4. User replies with approval or correction.
5. Atomek updates mission state.

### Flow 5 — Resume tomorrow or on another machine

1. Open Atomek.
2. Select existing mission.
3. Atomek reconstructs state from mission folder.
4. Missing local tools show setup-needed.
5. Available pods/local agents continue from `MISSION.md` and latest runs.

## What makes this amazing

Normal AI tools are isolated chat boxes.

Tytus can become a coordinated team because:

- agents share durable files, not hidden chat memory
- local and pod agents can read the same mission contract
- every run leaves transcripts and outputs
- shared folders let multiple machines/pods participate
- chat channels let the team ask the user for approvals
- Atomek can be the cockpit, not the worker

## Sharp product rule

If a UI element does not help the user answer one of these questions, remove or hide it:

1. What is the mission?
2. Who is working on it?
3. What context/files can they access?
4. What is running now?
5. What did they produce?
6. What needs my approval?
7. How do I resume or hand this off?
