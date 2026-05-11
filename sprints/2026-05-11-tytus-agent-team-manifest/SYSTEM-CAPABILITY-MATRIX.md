# System Capability Matrix

Snapshot source: local Tytus tray APIs on `http://127.0.0.1:4242`, repo inspection, and CLI help on 2026-05-11.

## Live daemon state

| Capability | Current state |
|---|---|
| Tytus daemon | running |
| Tunnel | active |
| Account | logged in |
| Tier | operator |
| Units | 2 used / 4 limit |
| Local tray API | `http://127.0.0.1:4242` |
| Private AIL endpoint | `http://10.42.42.1:18080` via pod `04` |

## Resource graph summary

| Kind | Count | Ready | Notes |
|---|---:|---:|---|
| workspace | 1 | 1 | Tytus Home |
| local-cli | 10 | 9 | Goose missing setup |
| shared-folder | 1 | 1 | `/Users/sebastian/MAKAKOO/data/shared/` |
| pod-agent | 2 | 2 | pod 01 + pod 02 OpenClaw style |
| ail-route | 1 | 1 | pod 04 AIL gateway |
| app-skill | 6 | 5 | Blender MCP needs setup |

## Local agents/tools

| Resource id | Label | Status | Capabilities |
|---|---|---|---|
| `local-cli.terminal` | Tytus Terminal | ready | supervised shell / PTY |
| `local-cli.pi` | pi | ready | text, code review, code edit proposals |
| `local-cli.opencode` | OpenCode | ready | text, code review, code edit proposals |
| `local-cli.codex` | Codex | ready | text, code review, code edit proposals |
| `local-cli.claude` | Claude | ready | text, code review, code edit proposals |
| `local-cli.gemini` | Gemini | ready | text, code review, code edit proposals |
| `local-cli.qwen` | Qwen | ready | text, code review, code edit proposals |
| `local-cli.kimi` | Kimi | ready | text, code review, code edit proposals |
| `local-cli.aider` | Aider | ready | text, code review, code edit proposals |
| `local-cli.goose` | Goose | needs setup | not actionable until installed/configured |

## Pod resources

| Resource id | Pod | Type | Status | Notes |
|---|---|---|---|---|
| `pod-agent.01` | 01 | OpenClaw | ready | OpenClaw pod agent, 1 unit |
| `pod-agent.02` | 02 | OpenClaw | ready | OpenClaw pod agent, 1 unit |
| `ail-route.04` | 04 | AIL gateway | ready | included AIL route, no agent unit |

Hermes is supported by Tytus as a 2-unit agent family, but not currently allocated in this live snapshot. Atomek should display Hermes as installable/allocatable only when catalog/state says it is available, not as a live worker.

## Shared folders

| Label | Local path | Bucket | Auto-sync | Provisioned pods | Status |
|---|---|---|---|---|---|
| `shared` | `/Users/sebastian/MAKAKOO/data/shared/` | `shared` | true | `wannolot-01`, `wannolot-02`, `wannolot-04` | ready |

Product meaning:

- This is the cross-agent exchange folder.
- It should be selectable as mission context.
- It should not be buried under low-level settings.

## Mission folder capability

API exists:

- `GET /api/missions`
- mission write support in host API / tray
- Atomek already writes mission packs

Observed mission folder root:

```text
/Users/sebastian/Tytus/Missions/
```

Existing generated files:

- `MISSION.md`
- `MISSION.json`
- `RESOURCES.md`
- `TASKS.md`
- `HANDOFF.md`
- `INBOX.md`
- `OUTBOX.md`
- `AUDIT.jsonl`
- `runs/`

Gap:

- Current UI can create missions, but the user experience still looks like too many small controls instead of one clear team workflow.

## App skills

| Resource id | Status | Meaning |
|---|---|---|
| `atomek.inspect-project` | ready | inspect workspace/context |
| `atomek.generate-patch-preview` | ready | produce previewable edits |
| `atomek.local-agent-job` | ready | launch allowlisted local agents |
| `local.terminal.open` | ready | open terminal with context |
| `juli3ta.create-song` | ready | hand off music task to JULI3TA |
| `blender-mcp.create-scene` | needs setup | available only after Blender MCP configured |

Product rule:

- Show ready skills as actions.
- Show missing skills as setup cards.
- Never show fake buttons that imply unavailable automation.

## Chat/channel capability

CLI and UI expose channel management for pod agents.

Currently documented/surfaced families:

- Telegram
- Discord
- Slack socket mode
- LINE
- broader OpenClaw extensions such as WhatsApp, Signal, iMessage, Matrix, Teams and others where configured

Product rule:

- Channels are for human approvals and asynchronous status.
- External sends require explicit approval.
- Atomek should display configured channels first, then setup prompts.

## File access capability

| Surface | What it can access | Notes |
|---|---|---|
| Browser File System Access | folders/files user selects | safest for Atomek editor |
| Tytus Home | `/Users/sebastian/Tytus` | mission root and local Tytus files |
| Shared folder | `/Users/sebastian/MAKAKOO/data/shared/` | cross-agent/pod exchange |
| Pod workspace | `/app/workspace/` through Tytus bridge | inbox/outbox/push/pull |
| Local agent CLI | local filesystem according to process permissions | must be launched intentionally with mission context |

## Critical gaps before Atomek rebuild

1. Atomek must make shared folders/mission folders the main concept, not an advanced panel.
2. Atomek must distinguish live agents from installable agents.
3. Atomek must show “who can see which files” before dispatch.
4. Pod dispatch must be explicit and same-origin/proxy-backed, not raw browser fetch.
5. Local agent runs must all write transcripts to mission `runs/`.
6. Patch/file writes must remain preview/approval-gated.
7. Chat channels must be configured/available-aware.
8. UI must collapse dozens of small options into 3 user choices: goal, team, shared context.
