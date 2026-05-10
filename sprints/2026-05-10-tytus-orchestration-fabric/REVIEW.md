# Review — Tytus Orchestration Fabric

Date: 2026-05-10  
Scope: rethink sprint plan, use cases, sequencing, safety, product differentiation.  
External review: Claude direct CLI + Lope/OpenCode. Claude is installed locally but not registered in `lope team list`; OpenCode was queried through Lope.

## Verdict

The direction is right, but the first draft was still too much like “inventory + panels + future intelligence”. The stronger product is:

> **Folder-native multi-runtime orchestration where agents, pods, and app skills work from one durable mission context pack.**

Atomek should stay the existing chat/files shell. The new product layer is not a bigger editor. It is a mission runner that coordinates resources Tytus already owns.

## Review matrix

| Original point | Use case test | Problem found | Improved decision |
|---|---|---|---|
| Product thesis: orchestration with shared context | User asks multiple agents/apps to collaborate on one deliverable | Too generic; sounds like every AI IDE | Position as durable folder-native context across pods/local CLIs/app skills |
| North-star workflow | Build video/product asset using Hermes, local Claude, Remotion/Blender, shared folder | Workflow lacks dependency model and readiness signals | Add task DAG, run dependencies, `READY`/event markers, mission log |
| Existing infra | Use Tytus pods, local jobs, skills, shared folders | Good foundation; but not unified in one graph | Resource graph must normalize capabilities/status/cost/trust |
| Resource graph | Pick best agent for code, copy, render, test | Graph without capabilities/cost cannot power recommendations | Add typed `TytusResource` contract with capabilities, cost, sandbox, setup action |
| Mission workboard | Coordinate parallel agents | Risks becoming Jira/sidebar clone | Make it timeline/execution-driven, auto-updating from runs; tasks move by events, not manual drag as primary UX |
| Context packs | Share state between Claude/OpenCode/OpenClaw/Remotion | Folder exists but agents may not know when/how to read it | Add prompt prelude + machine-readable `MISSION.json` + append-only `AUDIT.jsonl` |
| Agent dispatch adapters | Dispatch local and pod agents | Run type missing cancel, retry, error, cost, parent/child links | Extend `OrchestrationRun`; separate proposals from runs |
| Memory/handoff | Resume mission next day | Current docs mention files but not registry/resume | Add mission registry and active/archived states |
| UX shape | Laptop screen with chat/editor/resources | More panes can recreate VS Code clutter | Delay big panel; MVP uses mission badge + right-dock timeline before full board |
| Phase sequence | Ship value fast | Six serial phases delay proof of value | Ship vertical MVP: resources + context pack + one local-cli run + approval gate |
| App skills phase | Blender/Remotion/JULI3TA/API Tester | Too many IPC models in one phase | Split per app; start with Remotion/Hypermotion or the strongest installed driver |
| Safety rules | Give agents shared files | Secret leakage, path traversal, output overwrite, runaway cost | Add context-pack jail, secret scan/denylist, per-run folders, size/cost caps, append-only audit |

## Critical improvements

### 1. Make Mission Context Pack the signature primitive

Not just plumbing. This is the moat.

Every mission folder:

```text
mission-name/
  .tytus-context.json
  MISSION.md
  MISSION.json
  RESOURCES.md
  AUDIT.jsonl
  inputs/
  outputs/
  proposals/
  approvals/
  runs/
    <run-id>/
      prompt.md
      transcript.md
      result.json
      stdout.log
      stderr.log
      artifacts/
```

Use case:

- User asks “make landing page copy and update repo.”
- Atomek creates mission pack.
- Hermes gets `MISSION.md` and writes copy to `runs/hermes-.../artifacts/copy.md`.
- Claude/OpenCode gets same mission pack, reads copy, proposes diff under `proposals/`.
- Atomek shows proposal preview before applying.

### 2. Add task DAG, not only task cards

Use case:

```text
Task A: Hermes writes script
Task B: Remotion renders video after Task A
Task C: Claude updates README after Task A
Task D: OpenCode reviews patch after Task C
```

Improvement:

- Task has `dependsOn: string[]`.
- Run does not start until dependencies produce ready outputs.
- Completion writes `result.json` and appends `AUDIT.jsonl` event.

### 3. Define resource trust + capability from day one

Use case:

- Local Claude can inspect local repo.
- Remote pod should only see shared mission folder.
- Blender skill can write only to mission `outputs/`.

Improvement:

Each resource has:

- capabilities: `code-edit`, `copywriting`, `video-render`, `image-edit`, `test-run`, `web-fetch`
- sandbox: `pod`, `process`, `browser-app`, `none`
- trust tier: `local-private`, `tytus-pod`, `third-party-app`, `remote-ail`
- allowed roots
- setup action if missing

### 4. Approval gates are MVP, not later

Use case:

- Agent proposes edit to `src/App.tsx`.
- Another agent proposes conflicting edit to same file.

Improvement:

Add approval gates:

- `file-write`
- `shell-exec`
- `pod-cost`
- `network-egress`
- `secret-read`
- `app-native-write`

All file writes outside mission folder are preview-only unless approved.

### 5. Mission timeline beats IDE clone panels

Use case:

User wants to know: “what happened, who did what, what is blocked?”

Better UX than another tree/sidebar:

```text
09:41 Mission created
09:42 Hermes started copy task
09:43 Hermes produced copy.md
09:44 Claude started patch task using copy.md
09:45 Claude proposed patch, approval needed
09:46 OpenCode reviewing patch
```

This is differentiated. VS Code shows files; Atomek shows the work happening across Tytus.

### 6. Split app integrations by driver maturity

Do not promise “Blender + Remotion + JULI3TA + Hyperframes” in one batch.

Use case priority:

1. Remotion/Hypermotion: strongest fit for assets/video outputs and mission folders.
2. Blender MCP: strong but native process safety needed.
3. JULI3TA: music generation workflows, output artifacts.
4. API Tester: deterministic probes/tests.
5. Photo Editor: local artifact transform.
6. Hyperframes: only when installed/discovered; do not fake.

## Revised MVP

### Atomek 0.5 — Mission Pack MVP

Goal: prove real orchestration with existing Atomek shell.

Includes:

- contracts doc
- read-only resource graph for workspace/local-cli/shared-folder
- mission folder creator/selector
- context-pack writer
- local-cli adapter end-to-end
- prompt prelude telling agent to read mission files first
- transcript/output saved into mission folder
- file-write approval gate
- chat/files mission badge

Excludes:

- full workboard
- pod dispatch
- app-skill dispatch
- automatic planner intelligence

### Atomek 0.6 — Pod collaboration

- add pod-agent adapter for OpenClaw/Hermes
- context-pack sync to pod workspace/shared folder
- pod health/capacity/cost in resource graph
- cancel/retry/timeouts
- local + pod dual-agent mission demo

### Atomek 0.7 — Mission timeline/workboard

- mission timeline
- DAG visualization
- approval cards
- retry/fallback actions
- archived/resumable missions

### Atomek 0.8 — App skill dispatch

- one app driver at a time
- Remotion/Hypermotion first if installed/available
- then Blender MCP, JULI3TA, API Tester, Photo Editor

### Atomek 0.9 — Collaboration intelligence

- recommend resources based on capabilities/cost/trust/status
- summarize disagreements
- auto-create tasks from chat
- propose fallback when resource fails

## Must-fix before implementation

1. Write typed contracts before code.
2. Treat mission folder as jail for outputs.
3. Add secret-denylist/context sanitizer.
4. Use per-run folders; no shared transcript overwrites.
5. Add append-only `AUDIT.jsonl`.
6. Add cancellation/retry/error/cost fields to runs.
7. Add dependency DAG and readiness signals.
8. Keep UI timeline-first, panel-light.

## External review synthesis

### OpenCode via Lope

- Add inter-agent dependency DAG.
- Add failure/partial-success model, retry, fallback, timeouts.
- Add readiness signals for handoffs.
- Add trust-tiered resource access.
- Add long-running mission resume/checkpoints.
- Add capacity/queue model for pods.
- Pull approval gates earlier.
- Make pods/context packs the centerpiece, not a late add-on.
- Add path traversal, secret leakage, output quota, audit log protections.

### Claude direct

- Lock typed contracts before Phase 1.
- Resource graph needs capabilities, cost, sandbox, setup action.
- `.tytus-context.json` needs schema v1 and migration path.
- `OrchestrationRun` needs timestamps, cost, retryable errors, cancel, parent run, approvals.
- Re-slice into vertical MVP first.
- Delay full Mission panel until data model is proven.
- Split app skills one app at a time.
- Add mission registry/resume/templates/export/offline behavior.

## Final decision

Replace “Resource Graph + Mission Context Pack + later workboard” with:

> **Atomek 0.5 proves one real mission end-to-end:** create mission pack, discover local resources, run one local agent with mission prelude, save transcript/output, and preview any edit through approval gate.

After that, add pods, then timeline/workboard, then app skills.
