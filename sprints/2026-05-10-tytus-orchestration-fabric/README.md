# Tytus Orchestration Fabric Sprint

Status: READY FOR IMPLEMENTATION  
Date: 2026-05-10  
Owner app: Atomek  
Repos: `tytus-app-atomek`, `tytus-os`, `tytus-cli`, first-party app repos as needed


## 2026-05-10 review update

This sprint was re-reviewed after Claude and OpenCode technical critique. The key correction:

> Ship a vertical Mission Pack MVP before building a large workboard.

New companion docs:

- `REVIEW.md` — point-by-point critique, use-case tests, improved decisions.
- `CONTRACTS.md` — draft contracts for resource graph, context pack, runs, approvals, endpoints.
- `USE-CASES.md` — concrete end-to-end workflows this sprint must support.

Revised product primitive:

```text
Atomek chat/files
  -> Mission context pack on disk
    -> typed resource graph
      -> local agents / Tytus pods / app skills
        -> transcripts, artifacts, proposals, approvals
          -> Atomek timeline + preview gates
```

Revised MVP is Atomek 0.5:

1. Lock typed contracts.
2. Discover resources for workspace + local CLIs + shared folders.
3. Create/select mission folder.
4. Write `MISSION.md`, `MISSION.json`, `RESOURCES.md`, `AUDIT.jsonl`, `runs/`.
5. Run one local agent with prompt prelude telling it to read mission files.
6. Save transcript/output into mission folder.
7. Show file-write approval gate for proposed edits.
8. Show lightweight mission badge/timeline; defer full workboard until data model is proven.

Safety promoted to MVP:

- context pack secret denylist
- mission folder as output jail
- per-run folders
- append-only audit log
- output size/cost limits
- cancellation/retry/error model
- dependency DAG/readiness model

## Product thesis

Atomek must not become a VS Code, Antigravity, Claude Code, or OpenCode clone.

Atomek already has the useful base: chat, file system, editor, context attachments, artifacts, patch previews, AIL routing, and local agent panels. The next step is to connect the Tytus ecosystem so the user can coordinate real work across:

- Tytus pods: OpenClaw/NemoClaw, Hermes, AIL pods, future agent runtimes
- local agents: Claude, pi, OpenCode, Codex, Gemini, Qwen, Kimi, Aider
- shared folders: garagetytus bindings, local Tytus Home, pod inbox/outbox/workspaces
- app skills: Blender, Remotion/Hypermotion, JULI3TA, Hyperframes, API Tester, Photo Editor, future installable local apps
- knowledge/memory: workspace files, shared handoff documents, agent transcripts, artifacts, reusable skill instructions

The revolutionary value is **orchestration with shared context**, not another IDE.

## North-star user workflow

User opens Atomek and says:

> Build a product video from these assets, ask Hermes for copy, ask Claude/OpenCode to inspect the repo, ask Blender/Remotion to generate visuals, keep all agents synchronized in the shared sprint folder, and show me previewable outputs before anything is applied.

Atomek should then:

1. Understand the active workspace/files and selected shared folder.
2. Discover available pods, local agents, and app drivers.
3. Propose a small workboard: tasks, agents, resources, shared handoff paths.
4. Create/choose a shared working folder.
5. Dispatch tasks to selected agents/apps through Tytus host APIs.
6. Stream outputs back into Atomek.
7. Save transcripts, artifacts, diffs, and final results into the shared folder.
8. Let the user preview/approve edits and outputs.
9. Preserve a project memory/handoff so future agents continue from the same state.

## What we already have

- Atomek chat + filesystem + editor shell.
- AI model routing through host/global AIL without hardcoded model IDs.
- Context attachments and removable chips.
- Artifacts and patch preview path.
- `host.local` for allowlisted local tools/jobs.
- `host.skills` for agentic skill packs.
- Tytus tray endpoints for local tools/jobs and skills.
- TytusOS Files app over Tytus Home, shared folders, pod workspaces.
- Tray garagetytus/shared-folder menu integration.
- Tytus pods and OpenClaw/Hermes allocation/open paths.
- `tytus_sdk` OpenClaw adapter and Lope bridge groundwork.

## Missing product layer

### M1 — Resource graph

Atomek needs one live graph of resources:

```text
Workspace
  files, active editor, selected snippets, project index
Shared folders
  local Tytus Home, garagetytus bindings, pod inbox/outbox/workspaces
Agents
  local CLIs, Tytus pods, OpenClaw/Hermes, AIL routes
Apps/skills
  Blender MCP, Remotion/Hypermotion, JULI3TA, API Tester, Photo Editor, user-installed apps
Memory
  transcripts, artifacts, sprint docs, handoff files, reusable context bundles
```

This graph powers suggestions like: “Use Claude local for code review, Hermes pod for copy, Remotion skill for video render, shared folder `campaign-demo` for handoff.”

### M2 — Mission workboard

A new Atomek panel: **Mission**.

Not a generic task manager. A Tytus-native workboard:

- goal
- selected resources
- chosen agents/apps
- shared working folder
- task cards with owner agent/app
- live stream status
- output artifacts
- handoff/memory files
- approval gates

### M3 — Shared context packs

A context pack is a folder + manifest Atomek can hand to any agent/app:

```text
.tytus-context.json
README.md
inputs/
outputs/
transcripts/
patches/
artifacts/
skills/
```

Agents do not need direct browser state. They get a durable shared context pack.

### M4 — Agent dispatch adapters

Atomek should dispatch through typed adapters, never raw shell:

- `local-cli`: Claude/pi/OpenCode/Codex/etc through tray allowlist
- `pod-agent`: OpenClaw/Hermes via Tytus SDK/tray bridge
- `app-skill`: Blender/Remotion/JULI3TA/etc through skill driver
- `terminal`: visible interactive terminal launch
- `ail-chat`: global AIL route for simple chat/reasoning

Every adapter returns a normalized `Run`:

```ts
type OrchestrationRun = {
  id: string;
  taskId: string;
  driver: 'local-cli' | 'pod-agent' | 'app-skill' | 'terminal' | 'ail-chat';
  resourceId: string;
  status: 'queued' | 'running' | 'needs_input' | 'failed' | 'complete';
  streamUrl?: string;
  outputFiles: string[];
  transcriptPath?: string;
  proposedEdits?: WorkspaceEdit[];
};
```

### M5 — Memory + handoff discipline

Every multi-agent run writes durable handoff artifacts:

- `MISSION.md` — user goal and current plan
- `RESOURCES.md` — selected pods/local agents/apps/folders
- `TRANSCRIPT-<agent>.md`
- `OUTPUTS.md`
- `PATCHES.md`
- `NEXT.md`

This lets local agents, pods, and installed apps share state through folders instead of relying on hidden chat memory.

## UX shape

Atomek left rail remains simple:

- Explorer
- Search
- Source Control later
- Chat
- Mission
- Resources
- Settings

Right dock:

- Chat
- Agents
- Outputs
- Mission Log

Main editor:

- files
- settings tabs
- mission board tabs
- artifact previews

No modal-heavy UX. Everything opens as tabs or dock panes.

## Implementation phases

### Phase 1 — Resource graph discovery

Repos: `tytus-cli`, `tytus-os`, `tytus-app-atomek`

Add `host.resources`:

```ts
host.resources.list(): Promise<TytusResourceGraph>;
host.resources.refresh(): Promise<TytusResourceGraph>;
```

Includes:

- local agents from `/api/local/tools`
- skill packs from `/api/skills`
- pods from `/api/state`
- shared folders from new tray endpoint wrapping garagetytus bindings
- Tytus Home/inbox/outbox/workspaces roots

Exit gate:

- Atomek Resources panel shows actual pods, local agents, app skills, and shared folders.
- Missing tools are shown as setup-needed, not fake-available.

### Phase 2 — Mission context pack

Repo: `tytus-app-atomek` first, then `tytus-os`/`tytus-cli` if host writes are needed

- Create/select a mission folder.
- Write `.tytus-context.json`, `MISSION.md`, `RESOURCES.md`.
- Attach current open files/snippets/project index summaries.
- Store outputs/transcripts under the folder.

Exit gate:

- A local agent run and chat artifact are saved into the same mission folder.

### Phase 3 — Mission workboard UI

Repo: `tytus-app-atomek`

- Add Mission activity.
- Cards: goal, resources, tasks, live runs, outputs, approvals.
- Convert chat messages into tasks.
- Drag/reassign tasks between available resources.

Exit gate:

- User can create a mission, add tasks, assign local agents/apps, and watch runs.

### Phase 4 — Pod-agent dispatch

Repos: `tytus-cli`, `tytus-os`, `tytus-app-atomek`

- Add tray/host adapter for OpenClaw/Hermes task dispatch.
- Use existing Tytus SDK/OpenClaw adapter where possible.
- Stream pod-agent output into the same normalized run model.
- Save pod transcript into mission folder.

Exit gate:

- Atomek can assign one task to local Claude/OpenCode and one to an OpenClaw/Hermes pod, both sharing the same mission context folder.

### Phase 5 — App-skill dispatch

Repos: app repos + `tytus-os` + Atomek

- Formalize app skill execution descriptor.
- Drivers for:
  - Blender MCP
  - Remotion/Hypermotion when installed
  - JULI3TA music workflows
  - API Tester endpoint probe
  - Photo Editor/image transforms
- Do not fake unavailable apps.

Exit gate:

- Atomek can route a mission task to an installed app skill and capture output artifact paths.

### Phase 6 — Collaboration intelligence

Repo: `tytus-app-atomek`

- Suggest best agent/app for task based on resource graph.
- Detect missing prerequisites and offer setup actions.
- Summarize agent disagreements.
- Keep final output + next steps in mission folder.

Exit gate:

- User asks for a complex job; Atomek proposes a sensible multi-agent/app plan with explicit resource choices and approval gates.

## Non-goals

- No VS Code clone work beyond making the current editor usable.
- No arbitrary shell execution from model output.
- No hardcoded AI model IDs.
- No direct browser CORS bypasses; use same-origin Tytus host/tray bridge.
- No fake integrations for apps not installed.
- No blind file writes by agents; proposed edits go through preview/approval.

## First implementation target

Build **Mission Pack MVP** first, not a large UI panel.

Why first:

- It proves orchestration end-to-end with existing Atomek chat/files.
- It makes shared folders useful immediately.
- It gives every agent/app one durable source of truth.
- It avoids clone-trap UI work before the data model is proven.

Concrete first tasks:

1. Add `CONTRACTS.md` types to host-api/tray/app code: `TytusResource`, `.tytus-context.json`, `OrchestrationRun`, `ApprovalGate`.
2. Add tray endpoint `GET /api/resources`.
3. Add tray endpoint `GET /api/shared-folders` wrapping existing garagetytus binding discovery.
4. Add `host.resources.list()` in `@tytus/host-api` and TytusOS host implementation.
5. Add Mission folder creator/selector.
6. Add context-pack writer for `MISSION.md`, `MISSION.json`, `RESOURCES.md`, `AUDIT.jsonl`, `runs/`.
7. Inject mission prompt prelude into local-agent jobs: read `MISSION.md` and `RESOURCES.md` first, write outputs only under `runs/<run-id>/`.
8. Wire local-job output into mission transcripts.
9. Add file-write approval gate for proposed edits.
10. Show lightweight Mission badge/timeline in existing Chat/Files UI; defer full workboard.

## Definition of done

- Atomek shows one coherent Resources graph: pods, local agents, app skills, shared folders, workspace.
- User can create a Mission using current files + selected shared folder.
- Local agent run writes transcript/output into the Mission folder.
- Chat can attach Mission context and show what each agent/app can access.
- No model IDs hardcoded.
- No fake unavailable app support.
