# Brand + Integration Review — OpenClaw / Hermes

## Problem found

The current Atomek UI still exposes generic resource plumbing and legacy/internal names. That makes the product feel like random buttons instead of a useful Tytus agent-team cockpit.

Specific issues:

1. Pod agents are not visually branded enough.
2. OpenClaw and Hermes are buried under generic “pod-agent” language.
3. Resource labels can leak old internal agent identifiers from tray state.
4. The sidebar mixes product mode, tool inventory, local-job controls, resource graph, and app skills in one dense column.
5. Users cannot quickly answer: “Which team do I have, what can it do, and where do I send the next task?”

## Product rule

OpenClaw and Hermes are first-class Tytus brands.

- User-facing UI says **OpenClaw**.
- User-facing UI says **Hermes**.
- Internal legacy ids must be normalized before display.
- Atomek should show brand-level team cards before low-level resource rows.

## Correct Atomek shape

### Primary screen: Agent Team Mission

Show one sentence:

> OpenClaw, Hermes, local agents, shared folders, one mission.

Then show the four concrete team capabilities:

1. **OpenClaw** — fast pod agents for independent critique, planning, channel/app workflows.
2. **Hermes** — heavier pod agent family when allocated.
3. **Local agents** — Claude, OpenCode, Codex, pi, Kimi through the local tray bridge.
4. **Shared folders** — mission context and handoff fabric.

### Secondary screen: Mission Board

Only after mission start:

- goal
- context pack
- selected team
- task graph
- live runs
- outputs
- approvals
- handoff

### Tertiary screen: Resource Setup

For raw details only:

- pod ids
- installed/missing tools
- setup actions
- health/debug information

## Implementation changes started in this review

- Tray `/api/resources` now maps pod labels to `OpenClaw agent pod 01` / `OpenClaw agent pod 02` instead of leaking internal ids.
- Resource metadata now includes `displayName`, `brand`, `agentFamily`, and `internalAgentType` so apps can display the brand while preserving low-level compatibility.
- Atomek now defensively normalizes old tray labels before display.
- Atomek home now has an **Agent team** brand card row for OpenClaw, Hermes, local agents, and shared folders.
- Atomek activity label now says **Agent Team**, not a vague sidebar “Control Tower”.

## Next UI cleanup still required

1. Split dense sidebar into three modes:
   - Team Mission
   - Mission Board
   - Resource Setup
2. Move raw resource graph below brand cards or behind Resource Setup.
3. Keep launch buttons contextual to selected task, not attached to every resource card.
4. Add explicit OpenClaw/Hermes dispatch cards:
   - “Ask OpenClaw for critique”
   - “Ask Hermes for deep plan” when available
5. Keep local Claude/OpenCode/Codex buttons in the Local Agents section.
6. Keep app skills as capabilities attached to missions, not as random extension cards.

## UAT additions

- No user-facing legacy/internal agent name appears in Atomek UI.
- OpenClaw and Hermes are visible on the first screen without opening raw resource details.
- A pod resource row reads `OpenClaw agent pod <id>`.
- Hermes is shown as available/allocatable only when the host resource graph reports it.
- Mission prompt examples mention OpenClaw/Hermes by brand.
