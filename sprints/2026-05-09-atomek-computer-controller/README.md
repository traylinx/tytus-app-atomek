# Atomek Computer Controller Sprint

Status: COMPLETE  
Date: 2026-05-09  
Owner app: Atomek  
Repos: `tytus-app-atomek`, `tytus-os`, `tytus-cli`, `tytus-app-catalog`

## Goal

Make Atomek the production controller UI for the user's real computer resources and agentic app skills.

Atomek must not become a parallel local-agent runtime. TytusOS/tray already owns local OS access. Atomek should orchestrate it through typed host APIs:

```text
Atomek UI/chat/context
  -> @tytus/host-api
    -> TytusOS host bridge
      -> Tytus tray daemon
        -> local PTY, installed AI CLIs, app skills, Makakoo skills, folders, AIL, pods
```

## Real code facts

- TytusOS already has real browser Terminal through `/api/terminal/session`.
- Tray daemon owns local PTY/process execution.
- Atomek already uses `host.ai`, dynamic AIL gateway/model selection, context attachments, artifacts, edit previews, semantic retrieval.
- Current Tytus manifest `contributes` only supports `fileAssociations`; no agent skill declaration yet.
- Existing Makakoo Blender skill exists at `/Users/sebastian/MAKAKOO/plugins/skill-ai-ml-blender-mcp/src/SKILL.md`.
- No Hyperframes skill was discovered locally during sprint creation.
- Browser apps must not direct-fetch arbitrary remote/local tool URLs; screenshot showed CORS failures. Same-origin host/tray bridge is mandatory.

## Product requirements

### R1 — Computer capability discovery

Atomek can show what local resources are available:

- real Tytus Terminal available
- installed local AI CLIs: `pi`, `opencode`, `codex`, `claude`, `gemini`, `qwen`, `aider`, `goose`
- local AIL / remote Tytus AIL availability, but model IDs stay dynamic from AIL
- app skills declared by installed Tytus apps
- Makakoo skills discovered locally, e.g. Blender MCP

### R2 — Agentic app skills

Apps/extensions can publish skill descriptors. Atomek resolves and attaches those skills to chat context.

Examples:

- `atomek.inspect-project`
- `atomek.generate-patch-preview`
- `local.pi.run`
- `local.opencode.run`
- `juli3ta.create-song`
- `juli3ta.generate-lyrics`
- `blender-mcp.create-scene`
- `photo-editor.edit-image`
- `api-tester.probe-endpoint`

### R3 — Safe execution shape

Execution drivers are explicit and permissioned:

- `tytus-app`: open/focus an app with structured context
- `host-api`: typed host namespace
- `terminal`: open real Tytus Terminal with workspace context
- `local-job`: later headless allowlisted runner
- `mcp`: local MCP/socket bridge, e.g. Blender MCP
- `browser`: future browser automation when configured

No arbitrary shell strings from model output. No blind writes. Patches go to Atomek preview first.

### R4 — Production UX

Atomek gets a **Computer / Skills** panel:

- lists detected local tools
- lists available skill packs
- shows installed / missing / setup-needed status
- one click attaches skill to chat

## Phase 1 implementation shipped

- `@tytus/host-api` now exposes `host.local` and `host.skills`.
- Manifest schema now supports `contributes.agentSkills`.
- TytusOS host bridge calls same-origin tray endpoints:
  - `GET /api/local/tools`
  - `GET /api/skills`
  - `GET /api/skills/:id`
  - `POST /api/skills/resolve`
- Tytus tray returns allowlisted local tool discovery for terminal + common AI CLIs.
- Tytus tray returns initial skill packs for Atomek, Terminal, JULI3TA, and Blender MCP.
- Atomek now has a **Computer / Agents** activity panel.
- Atomek can attach a skill pack to chat input without hardcoded model IDs or direct remote fetches.
- one click opens Terminal/app with context where supported
- skill chips are removable and visible in chat context

### R5 — Global AIL discipline

No hardcoded model IDs in app code. Atomek keeps using global AIL aliases/discovery.

## Host contracts

### Manifest extension

```ts
contributes.agentSkills?: Array<{
  id: string;
  title: string;
  description: string;
  driver: 'tytus-app' | 'host-api' | 'local-job' | 'terminal' | 'mcp' | 'browser';
  skillUrl?: string;
  permissions?: Permission[];
  triggers?: string[];
}>;
```

Full instructions live in sidecar `SKILL.md`/`skill.json`, not inside huge manifests.

### `host.local`

```ts
host.local.listTools(): Promise<LocalTool[]>;
host.local.openTerminal(input?: TerminalLaunchInput): Promise<void>;
```

Headless `runJob()` is Phase 3 after discovery + Terminal launch are stable.

### `host.skills`

```ts
host.skills.list(input?: SkillListInput): Promise<TytusSkillSummary[]>;
host.skills.get(id: string): Promise<TytusSkillPack>;
host.skills.resolve(input: { prompt: string; appId?: string; mimeType?: string }): Promise<TytusSkillSummary[]>;
```

## Phases

### Phase 1 — Contracts + discovery endpoints

Repos: `tytus-os`, `tytus-cli`

- Extend host-api manifest types/schema with `contributes.agentSkills`.
- Add host-api `local` and `skills` namespaces.
- Add tray endpoints:
  - `GET /api/local/tools`
  - `GET /api/skills`
  - `GET /api/skills/:id`
  - `POST /api/skills/resolve`
- Detect installed local CLIs from PATH.
- Bridge installed Makakoo `SKILL.md` files as read-only skill packs.

Exit gate:

- `/api/local/tools` lists installed tools only.
- `/api/skills` includes Blender MCP when local skill exists.
- Hyperframes is not faked when no skill exists.

### Phase 2 — Atomek Computer / Skills panel

Repo: `tytus-app-atomek`

- Add `Computer` activity panel.
- Render local tools + skills.
- Add “Attach skill” to chat context.
- Add “Open Terminal” for terminal-capable tools.
- Keep all context chips removable.

Exit gate:

- Atomek shows actual local capabilities.
- Skill instructions can be attached to chat without hardcoding models.

### Phase 3 — Terminal launch with context

Repos: `tytus-os`, `tytus-app-atomek`

- Implement `host.local.openTerminal()` via TytusOS windows/Terminal args.
- Atomek can launch `pi`, `opencode`, etc. in real Terminal scoped to current folder/project.

Exit gate:

- User can open a real Tytus Terminal from Atomek with selected tool/context.

### Phase 4 — Headless local job runner

Repo: `tytus-cli`, then `tytus-os`, then `atomek`

- Add allowlisted `/api/local/jobs` runner.
- Stream stdout/stderr via existing job stream style.
- Support cancel.
- No arbitrary commands.

Exit gate:

- Atomek streams background `pi`/`opencode` output live.

### Phase 5 — Patch/artifact integration

Repo: `tytus-app-atomek`

- Parse diffs from local jobs.
- Convert patches into existing Atomek edit preview.
- Save transcripts as artifacts.

Exit gate:

- Agent proposes edits; user previews/applies safely.

### Phase 6 — First-party app skills + release

Repos: first-party app repos + catalog

- Add skill sidecars for Atomek, JULI3TA, API Tester, Photo Editor.
- Publish version bumps.
- Update app author docs.
- Run typecheck/build/tests/release checks.

## Hard rules

- No hardcoded model IDs.
- No raw remote CORS fetches from app code for tool control.
- No hidden arbitrary shell execution.
- No blind writes.
- No fake unavailable tools.
- Do not edit JULI3TA internals in this sprint unless explicitly required later; use sidecar declarations only.

## Current implementation target

Implement Phase 1 + Phase 2 first. They make Atomek production-useful and establish the safe foundation. Phase 3+ follows once discovery and UI are proven.


## Completion summary

Implemented full sprint scope:

- Computer/Agents panel in Atomek.
- Host contracts for local tools, local jobs, and skill registry.
- Same-origin TytusOS bridge to tray endpoints.
- Tray capability discovery and local-job runner.
- Manifest-backed app skill sidecars.
- Terminal launch with context prefill.
- Local-job output captured as Atomek artifacts and diff-preview candidates.
- Atomek release metadata bumped to `0.4.6`.

Safety decisions preserved:

- No hardcoded model IDs.
- No direct browser fetches to pod/tool origins.
- No arbitrary shell execution from model output.
- Local jobs are allowlisted by tool id.
- Terminal context is prefilled without pressing Enter.
- JULI3TA internals were not changed.
