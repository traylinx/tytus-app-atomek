# Resource Fabric Review — What Atomek Must Focus On

## Core insight

The revolutionary part is not “another chat UI” and not “another VS Code clone”.

The product is the **Tytus Resource Fabric**:

```text
local computer resources
  ↕ shared folders / mission folders
Tytus pod agents: OpenClaw + Hermes
  ↕ app skills / local apps / channels
local agents: Claude, OpenCode, Codex, pi, Kimi
```

This lets remote agents use local resources through controlled shared context, and lets local agents use Tytus pod resources and app outputs. The user does not need to understand the plumbing; they need a cockpit that makes the exchange safe and obvious.

## What exists now

From live Tytus state and code inspection:

- OpenClaw pods are allocated and running.
- AIL route is available.
- Shared folder binding exists at `/Users/sebastian/MAKAKOO/data/shared/` and syncs to pods.
- Local agent CLIs are discovered through tray (`Claude`, `OpenCode`, `Codex`, `pi`, `Kimi`, etc.).
- Atomek can create mission folders and write mission files.
- Atomek can run local jobs through the tray and save transcripts.
- Atomek has chat, files, outputs, artifacts, edit previews, and app skill discovery.

## Product focus

Atomek should answer these questions immediately:

1. **What team do I have?** OpenClaw, Hermes, local agents, app skills, shared folders.
2. **What can they share?** Mission folder + shared folder + selected local files.
3. **What should they do next?** Task graph with roles and resources.
4. **Where did outputs land?** Runs, transcripts, artifacts, proposals, approvals.
5. **What is safe to apply?** Preview-gated edits and explicit approval gates.

## UI rule

Top-level Atomek should have three simple modes:

1. **Mission** — goal, shared context, task graph, next prompt.
2. **Runs** — live/background job output and transcript history.
3. **Setup** — raw resources, local tools, app skills, setup actions.

Everything else is secondary.

## Implementation started

- Added Agent Team brand cards on the Atomek home screen.
- Added Tytus Resource Fabric flow on the Atomek home screen.
- Added quick actions to open Shared Files, Pod Inspector, Channels, and Agent Settings.
- Split dense Agent Team sidebar into Mission / Runs / Setup views.
- Normalized pod display labels to OpenClaw/Hermes in Atomek and Tytus resource graph.

## Remaining implementation target

1. Replace old “Control Tower” wording with Resource Fabric / Agent Team wording everywhere user-facing.
2. Turn shared folder / mission folder into the visible central object.
3. Add task presets that assign roles:
   - OpenClaw critique/research
   - Hermes deep plan when available
   - OpenCode/Claude implementation
   - Codex/pi review
   - app skill execution
4. Show outputs by storage location: mission folder, shared folder, local artifact, pod artifact.
5. Wire approvals into mission board before any write/cost/external-send action.

## Lope review fixes applied

Lope found two landing blockers during implementation review:

1. Core app launch IDs were inline literals.
   - Fixed by centralizing built-in Tytus app ids in `TYTUS_CORE_APP_IDS` with a source-of-truth comment.
2. Resource graph metadata still carried raw internal pod type fields.
   - Fixed by emitting display-safe `agentType` / `brand` / `agentFamily` values from tray resources.
