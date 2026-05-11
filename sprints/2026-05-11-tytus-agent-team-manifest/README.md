# Tytus Agent Team Manifest Pack

Status: MANIFEST FIRST  
Date: 2026-05-11  
Owner app: Atomek  
Repos: `tytus-app-atomek`, `tytus-os`, `tytus-cli`

## Why this exists

Atomek must stop presenting itself as a box of tiny IDE-like options. That shape hides the real power of Tytus.

The actual product is stronger and simpler:

> Tytus gives a user a team of local agents, pod agents, AIL routes, shared folders, mission folders, and chat channels. Atomek should be the place where the user starts a mission, gives that team shared context, watches the work, and approves outputs.

This pack freezes the product truth before more UI work.

## Files in this pack

| File | Purpose |
|---|---|
| `TYTUS-AGENT-TEAM-MANIFEST.md` | User-facing paper: what Tytus has and how a human uses the agent team. |
| `SYSTEM-CAPABILITY-MATRIX.md` | Repo/API-backed inventory of available resources and limits. |
| `ATOMEK-REBUILD-MANIFEST.md` | Product contract for rebuilding Atomek around the real orchestration value. |
| `LIVE-INVENTORY-REDACTED.json` | Redacted live API snapshot from local tray/resource endpoints. |
| `ATOMEK-IMPLEMENTATION-BRIEF.md` | Concrete rebuild plan for turning Atomek into the team cockpit. |
| `USER-FLOWS.md` | Concrete user workflows for repo repair, pod/local collaboration, creative work, research, and handoff. |
| `MISSION-PROTOCOL.md` | Durable file/folder contract that lets agents collaborate safely. |

## Current live inventory snapshot

Captured from local Tytus tray on `http://127.0.0.1:4242` on 2026-05-11.

- Account connected: yes.
- Tunnel active: yes.
- Allocated pod agents: `pod 01` and `pod 02`, both `nemoclaw` / OpenClaw-style, ready.
- Included AIL route: `pod 04`, endpoint `http://10.42.42.1:18080`, ready.
- Units: `2 / 4` used.
- Local agents/tools discovered: Terminal, pi, OpenCode, Codex, Claude, Gemini, Qwen, Kimi, Aider ready; Goose missing setup.
- Shared folder bound: `/Users/sebastian/MAKAKOO/data/shared/`, bucket `shared`, auto-sync enabled, provisioned into `wannolot-01`, `wannolot-02`, `wannolot-04`.
- Mission root: `/Users/sebastian/Tytus/Missions/`.
- Existing Atomek mission API: creates mission packs and writes `MISSION.md`, `MISSION.json`, `RESOURCES.md`, `TASKS.md`, `HANDOFF.md`, `INBOX.md`, `OUTBOX.md`, `AUDIT.jsonl`, `runs/`.

## Product decision

Atomek should not be optimized as an editor-first app.

Atomek should be optimized as:

```text
Mission goal
  -> shared mission folder
  -> selected agent team
  -> distributed work through local agents / pod agents / app skills / chat channels
  -> visible timeline and outputs
  -> approval gates before writes or external actions
  -> resumable handoff
```

Everything else is secondary.

## Immediate implication for Atomek UI

Default screen must be **Team Mission**, not a generic workbench.

The first screen should ask only:

1. What should the team do?
2. Which workspace/files are relevant?
3. Which shared folder/mission folder is the team allowed to use?
4. Which agents should work: local, pod, or both?
5. What approvals are required before writes, shell actions, pod costs, or external messages?

No small unexplained buttons. No fake cards. No “coming soon” clutter.
