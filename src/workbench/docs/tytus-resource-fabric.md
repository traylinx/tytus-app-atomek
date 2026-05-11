# Tytus Resource Fabric

Tytus Resource Fabric connects the local computer, Tytus pods, shared folders, local AI agents, app skills, channels, and global AIL routes around one mission.

## Core resources

| Resource | Job |
|---|---|
| Local computer | Real files, terminal, installed apps, browser sessions, local CLIs. |
| OpenClaw | Fast pod agent for critique, planning, and remote workflows. |
| Hermes | Deeper pod reasoning and synthesis when allocated. |
| Shared folders | Exchange layer for agents, pods, and apps. |
| Local agents | Claude, OpenCode, Codex, pi, Kimi, Gemini, Qwen, Aider, and similar CLIs. |
| App skills | Instructions/drivers for Atomek, JULI3TA, Blender, Remotion, and installed apps. |
| Channels | Telegram/Slack/Discord-style communication when configured. |

## Mission loop

1. Create a mission folder.
2. Attach local files, shared folders, resources, and current task.
3. Ask OpenClaw/Hermes for pod perspective.
4. Run local agents or app skills for local execution.
5. Save transcripts under `runs/` and outputs under `outputs/`.
6. Convert patches into previews before applying.
7. Put final handoff in `OUTBOX.md`.

## Rules

- No hardcoded model ids. AIL routes provide model aliases globally.
- No raw browser calls to pod/model URLs. Use Tytus host bridge.
- No arbitrary shell from model text. Use allowlisted tools.
- No blind writes. Use proposals, previews, and approvals.
