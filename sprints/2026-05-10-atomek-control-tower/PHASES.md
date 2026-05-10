# Implementation Phases — Atomek Control Tower

## Phase 0 — Stop the confusing product shape

Goal: remove “random agent buttons” feel.

Tasks:

- Rename Computer / Agents to **Control Tower** or **Mission Control**.
- Make primary copy about missions/resources/runs, not “open local CLIs”.
- Remove fake extension/app cards unless backed by real registry data.
- Default home should offer “Start Mission”, “Open Mission”, “Inspect Resources”.

Gate:

- User can explain the surface in one sentence: “this coordinates my Tytus agents/resources around a mission.”

## Phase 1 — Mission Control shell

Goal: make Atomek mission-first.

UI:

- Main tab: `Mission Control`
- Left/dock: `Resources`
- Right/dock: `Runs / Chat / Outputs`

Data:

```ts
interface MissionState {
  missionId: string;
  title: string;
  goal: string;
  rootPath: string;
  resources: SelectedResource[];
  tasks: MissionTask[];
  runs: MissionRun[];
  approvals: ApprovalGate[];
  outputs: MissionOutput[];
}
```

Implementation:

- Parse/load `MISSION.json` when opening mission.
- Write mission state through existing `host.missions.write`.
- Keep browser fallback folder picker.

Gate:

- Create mission -> reload Atomek -> mission can be reopened with tasks/runs visible.

## Phase 2 — Resource picker with real status

Goal: make resources understandable and actionable.

Groups:

- Pods: OpenClaw/Hermes/AIL pods from resource graph.
- Local agents: Claude/OpenCode/Codex/pi/Kimi/etc.
- Shared folders: garagetytus bindings + local mission root.
- App skills: only from `/api/skills`; missing drivers show setup action.
- AIL routes: global/dynamic via host AI, no model IDs hardcoded.

Actions:

- Add to mission
- Open in Terminal
- Run background review
- Open pod/app
- Setup/install when missing

Gate:

- No “coming soon” dead cards. Every card either works or explains exact setup needed.

## Phase 3 — Task graph

Goal: missions become executable work, not just notes.

Task card fields:

- title
- prompt
- selected resource
- dependencies
- expected output
- status
- approval required

Starter presets:

- Review repo
- Implement patch
- Ask pod for plan/copy/research
- Generate artifact
- Validate output
- Summarize mission

Gate:

- User can create 3-task mission: plan -> implement -> review.

## Phase 4 — Dispatcher v1

Goal: make first loop production-useful.

Drivers:

- `local-cli.background`: existing tray jobs, read-only/planning-safe.
- `local-cli.terminal`: visible terminal launch with mission context.
- `ail-chat`: current chat route with mission context attached.

Outputs:

- stream log into run card
- save transcript under `runs/`
- extract proposed patches into approval queue
- append audit event

Gate:

- Run local Claude/OpenCode/Codex/pi on a task, save transcript, show result and approval.

## Phase 5 — Pod dispatch v1

Goal: make Tytus pods first-class.

Use existing host bridge only:

- no browser direct fetch to pod/tunnel origins
- same-origin `/api/pods/:id/proxy/...`
- readiness from `/api/resources`/state

Actions:

- Ask Hermes/OpenClaw with mission context.
- Save pod response as run transcript.
- If browser UI agent, open UI in Tytus window with mission link.

Gate:

- One mission can use local agent + pod agent and show both outputs in timeline.

## Phase 6 — Shared folder orchestration

Goal: make collaboration folders useful.

Tasks:

- Show bindings and sync/pod provisioning status.
- Let user choose one as mission handoff root or attach it to mission.
- Write `HANDOFF.md`, `INBOX.md`, `OUTBOX.md` templates.
- Show what each resource can read/write.

Gate:

- User can choose shared folder, run agent, and see transcript/artifact written there.

## Phase 7 — App skills as real drivers

Goal: make Blender/JULI3TA/Remotion/etc. actual controllable tools.

Rules:

- No fake cards.
- Card appears if skill manifest exists.
- Action appears only if driver is reachable.
- Missing app/driver shows setup checklist.

Gate:

- JULI3TA/Blender/Remotion-style skill can be attached to mission and produce an output artifact or setup-needed state.

## Phase 8 — UAT + release

Must test:

- narrow window responsive layout
- create/open mission
- resource graph with missing resources
- local job success/failure/timeout
- terminal launch clarity
- pod unavailable/degraded
- shared folder absent/present
- patch approval path
- reload/resume mission

Release:

- bump Atomek
- update catalog
- pin TytusOS fallback/catalog
- update CLI beta if host surfaces change
- purge jsDelivr
- smoke local `/api/resources`, `/api/local/tools`, `/api/missions`
