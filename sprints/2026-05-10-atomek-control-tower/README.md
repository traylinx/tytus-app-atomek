# Atomek Control Tower Sprint

Status: READY FOR IMPLEMENTATION  
Date: 2026-05-10  
Owner app: Atomek  
Core repos: `tytus-app-atomek`, `tytus-os`, `tytus-cli`

## Brutal diagnosis

Current Atomek is not enough. It has useful primitives — files, Monaco, chat, AIL routing, artifacts, local tools, mission packs — but the product shape is wrong:

```text
current: editor + chat + agent buttons
problem: looks like weak VS Code / weak Antigravity clone
value: unclear
```

Atomek should not be an IDE clone. Tytus already has pods, OpenClaw/Hermes, local agents, shared folders, terminal, app skills, AIL routes, and mission folders. Atomek should be the **control tower** that coordinates those resources.

```text
new: mission control tower for Tytus resources
value: one place to plan, dispatch, monitor, collect, approve, and resume work across pods/local agents/apps/folders
```

## Product thesis

Atomek is the operator cockpit for TytusOS.

It answers one question:

> What do I want done, which resources can do it, where is shared context, what is running, what came back, and what needs my approval?

It should make visible and usable:

- Tytus pods: OpenClaw, Hermes, AIL pods, future cloud agents
- local agents: Claude, OpenCode, Codex, pi, Kimi, Gemini, Qwen, Aider
- shared folders: garagetytus bindings, Tytus Home, mission folders, pod handoff folders
- app skills: Blender, Remotion/Hypermotion, JULI3TA, Hyperframes, API Tester, media tools
- mission memory: transcripts, outputs, decisions, artifacts, patches, approvals
- live status: running, blocked, failed, needs setup, needs approval, done

## Non-goals

Do **not** build:

- a VS Code clone
- an Antigravity clone
- another terminal app
- another local-agent runtime
- a generic AI dashboard
- fake “coming soon” cards that do nothing
- hardcoded model/provider names in Atomek
- raw browser-origin calls to pod/tunnel URLs
- arbitrary shell execution from model output

Atomek controls and coordinates. Existing tools do the specialized work.

## Control Tower MVP

One shippable loop:

```text
Create mission
  -> choose resources
    -> dispatch one or more tasks
      -> stream/monitor runs
        -> collect outputs in shared mission folder
          -> preview/approve edits/artifacts
            -> resume from mission timeline later
```

MVP must feel useful without pretending to be everything.

### Default home screen

Replace passive Welcome/editor-first home with **Mission Control**:

1. **Start Mission** — goal, workspace/folder, shared folder.
2. **Available Resources** — pods, local CLIs, shared folders, app skills, AIL routes.
3. **Recommended Plan** — generated task graph with suggested resources.
4. **Live Runs** — streams/status for running agents.
5. **Approvals** — proposed writes, shell actions, pod cost gates.
6. **Outputs** — artifacts, diffs, transcripts, final files.

The editor remains available, but it is no longer the product center. It becomes one resource/view inside the mission.

## First useful user flows

### Flow A — “Review and patch this repo”

1. User opens folder.
2. Atomek creates mission pack.
3. User selects local OpenCode/Claude for implementation and Codex/pi for review.
4. Agents write transcripts/proposals into mission folder.
5. Atomek shows patch preview and approval.
6. Final output is committed by user or through explicit approval.

### Flow B — “Use pod + local agent together”

1. User chooses Hermes/OpenClaw pod plus local Claude/OpenCode.
2. Pod produces plan/research/copy.
3. Local agent uses shared mission folder to patch local repo.
4. Atomek timeline shows who did what.
5. User approves final changes.

### Flow C — “Creative production pipeline”

1. User selects assets in shared folder.
2. Hermes writes script.
3. JULI3TA generates audio.
4. Remotion/Hypermotion renders video.
5. Blender skill generates scene assets when installed.
6. Atomek previews outputs and stores handoff.

### Flow D — “Resume tomorrow”

1. Atomek lists active missions.
2. User opens mission.
3. Timeline reconstructs from `AUDIT.jsonl` and `runs/`.
4. Missing resources show setup-needed.
5. User continues without explaining context again.

## Existing primitives to reuse

Already shipped / present:

- `/api/resources` resource graph
- `/api/local/tools` local CLI discovery
- `/api/local/jobs` + `/api/jobs/:id/stream` background jobs
- `/api/missions` + `/api/missions/write` mission folder creation/writes
- `/api/shared-folders` normalized garagetytus bindings
- Tytus Terminal bridge via `host.local.openTerminal`
- Atomek file/editor/chat/context/artifact/patch-preview primitives
- app skill registry via `/api/skills`
- pod proxy and pod readiness APIs in tray/TytusOS

The sprint should compose these, not invent parallel systems.

## Architecture

```text
Atomek Control Tower UI
  ├─ Mission Store
  │   ├─ MISSION.md / MISSION.json
  │   ├─ RESOURCES.md
  │   ├─ AUDIT.jsonl
  │   ├─ runs/*.md
  │   ├─ outputs/**
  │   └─ proposals/**
  ├─ Resource Graph
  │   ├─ local-cli
  │   ├─ pod-agent
  │   ├─ shared-folder
  │   ├─ app-skill
  │   └─ ail-route
  ├─ Dispatcher
  │   ├─ terminal launch
  │   ├─ background local job
  │   ├─ pod task through same-origin bridge
  │   ├─ app skill dispatch
  │   └─ AIL chat route
  ├─ Timeline
  │   ├─ task created
  │   ├─ run started/logged/completed
  │   ├─ artifact produced
  │   ├─ approval requested/resolved
  │   └─ decision recorded
  └─ Approval Gates
      ├─ file write preview
      ├─ shell allowlist action
      ├─ pod cost/use
      ├─ app-native write
      └─ shared-folder exposure
```

## Implementation phases

1. **Mission Control home** — make Control Tower the default Atomek landing surface.
2. **Mission model** — normalize mission state in Atomek, load/save from mission files.
3. **Resource picker** — real pods/local agents/shared folders/app skills with useful status/actions.
4. **Task graph** — user goal becomes editable cards with selected resources.
5. **Dispatcher v1** — local CLI background + terminal launch + existing AIL chat.
6. **Timeline/output inbox** — live logs, transcripts, outputs, proposed patches.
7. **Pod dispatch v1** — OpenClaw/Hermes through same-origin host bridge, no raw remote fetch.
8. **Shared folder workflow** — choose/bind folder, expose to mission, show sync/pod provisioning status.
9. **App skill workflow** — Blender/Remotion/JULI3TA/Hyperframes cards become actionable only when real drivers exist.
10. **Polish + UAT** — use-case tests, empty states, error states, responsive layout.

## Definition of done

Atomek is useful when Sebastian can:

- open Atomek and immediately see Tytus resources, not a blank editor shell
- create a mission and pick shared folder/resources
- dispatch Claude/OpenCode/Codex/pi as local agents with mission context
- include Tytus pods/OpenClaw/Hermes as resources when available
- see all run outputs/transcripts in one mission timeline
- approve/reject proposed file edits
- resume the mission later from disk
- understand every button without asking “what does this do?”

