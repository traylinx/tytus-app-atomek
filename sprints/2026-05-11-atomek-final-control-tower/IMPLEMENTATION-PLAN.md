# Implementation Plan — Atomek Final Control Tower

## Guardrail

Every change must support:

```text
mission -> team -> run -> output -> approval -> handoff
```

If a feature does not improve that chain, defer it.

## Structure

This sprint is split into two layers:

1. **Core Vertical** — the minimum final product that proves Atomek is useful as Tytus Control Tower.
2. **Expansion** — app skills, channels, deeper polish after the core works.

Do not spend another week polishing local-only UI before proving pod/local teamwork.

---

# Core Vertical

## Phase 0a — Make Team Mission the front door

Repo: `tytus-app-atomek`

Tasks:

1. Make Team Mission the default landing, not sidebar/tool clutter.
2. Resolve naming drift: use `Tytus Control Tower` for product, `Team Mission` for create/resume screen, `Mission Board` for active mission.
3. First visible CTA: `Start team mission`.
4. Landing fields:
   - mission goal
   - context source: selected files/folder, mission-only, shared folder
   - team preset
   - approval policy
5. Move chat/editor/terminal/open-file buttons below the mission path.
6. Collapse advanced details/resource JSON.

Acceptance:

- User opens Atomek and understands what to do in 5 seconds.
- No duplicate “Computer / Agents / Extensions” primary surfaces.
- Chat is labeled/positioned as mission copilot, not separate product.
- Layout works at screenshot-sized windows.

## Phase 0b — Navigation and mode consolidation

Repo: `tytus-app-atomek`

Tasks:

1. Replace/reshape primary modes:
   - Team Mission
   - Mission Board
   - Resource Setup
2. Keep Explorer/Editor/Chat/Outputs as contextual panes/tools.
3. Update command palette labels to match final naming.
4. Remove or hide placeholder IDE views that do not help the mission flow.

Acceptance:

- There is one obvious product path.
- Activity bar does not imply Atomek is another IDE clone.

## Phase 1 — Mission protocol + approval skeleton

Repos: `tytus-app-atomek`; `tytus-cli`/`tytus-os` only if append/dir APIs are needed

Tasks:

1. Always create mission protocol:
   - `MISSION.md`
   - `MISSION.json`
   - `RESOURCES.md`
   - `TASKS.md`
   - `HANDOFF.md`
   - `INBOX.md`
   - `OUTBOX.md`
   - `AUDIT.jsonl`
   - `RUNS.jsonl`
   - `runs/`
   - `outputs/`
   - `proposals/`
   - `approvals/`
2. Treat `AUDIT.jsonl` as canonical append-only event stream.
3. Treat `RUNS.jsonl` as projection/cache from run records.
4. Store proposal payloads in `proposals/`.
5. Store approval decisions in `approvals/`, referencing proposal payload paths.
6. Add selected resource visibility to `MISSION.json`:
   - what each agent/app/channel can see
   - allowed roots/shared folder
   - risk/cost/approval requirements
7. Fold shared folder into context selection as `Team Desk`.

Acceptance:

- A new mission folder is complete and resumable.
- A fresh agent can read the mission folder and know goal, files, team, tasks, runs, outputs, approvals.
- No secret/token values are written into mission files.

## Phase 2 — Team preset engine + Mission Board v0

Repo: `tytus-app-atomek`

Tasks:

1. Generate team presets from live resource graph:
   - Repo Repair
   - Pod + Local
   - Creative Production
   - Research Watch
2. Map roles to actual ready resources:
   - planner
   - implementer
   - reviewer
   - app/tool
   - channel/status
3. If a resource is missing, show setup-needed alternative.
4. Create Mission Board v0 immediately after mission start:
   - goal/scope
   - selected team
   - task cards
   - selected resource visibility
   - run list placeholder
   - output/proposal/approval placeholders
5. Persist selected team/tasks into mission files.

Acceptance:

- User selects `Repo Repair` and sees real Claude/OpenCode/Codex/pi/etc. mapped to roles.
- User selects `Pod + Local` and sees ready pods if available, otherwise setup/status.
- Mission Board opens immediately after mission start.

## Phase 3 — Unified run model + local task-first runs

Repo: `tytus-app-atomek`

Tasks:

1. Implement one `MissionRunRecord` model for local/pod/app/channel/human events.
2. Convert local agent actions from tool-first to task-first:
   - `Ask Claude to implement this task`
   - `Ask Codex to review this task`
   - `Ask pi for second opinion`
3. Keep two run modes:
   - supervised terminal
   - background read-only/planning job
4. Save transcript under `runs/`.
5. Save run record to `AUDIT.jsonl` and `RUNS.jsonl` projection.
6. Parse patch-like output into `proposals/` and approval skeleton.

Acceptance:

- A local agent run starts from a task card.
- Transcript path appears on Mission Board.
- Patch-like output becomes a proposal, not a hidden chat blob.

## Phase 4 — Pod task dispatch

Repos: `tytus-cli`, `tytus-os`, `tytus-app-atomek`

Tasks:

1. Confirm/add same-origin tray/host pod task endpoint.
2. Dispatch one mission task to a selected ready pod agent.
3. Send only mission/shared-folder context, never full local disk.
4. Show unit/cost info before dispatch.
5. Stream or poll pod output into Mission Board.
6. Save transcript/output under the same mission folder model as local jobs.
7. Handle failure states:
   - pod unreachable
   - tray down
   - timeout
   - user cancels

Acceptance:

- Atomek can assign one task to local Claude/OpenCode and one task to pod OpenClaw/NemoClaw.
- Both produce visible run records and transcripts in the same Mission Board.
- This is the first “real Tytus Control Tower” proof.

## Phase 5 — Output/proposal/approval inbox

Repo: `tytus-app-atomek`

Tasks:

1. Build Approval Inbox on Mission Board.
2. Approval kinds:
   - file-write / patch apply
   - shell-risk
   - pod-cost / agent install
   - external-message
   - publish/release
3. Connect existing patch preview dialogs to proposal/approval records.
4. Add approve/reject flow and audit event.
5. Output cards show:
   - source run/resource
   - file path
   - status
   - next action

Acceptance:

- User has one place to approve/reject risky actions.
- Applying file edits uses current Atomek preview/apply machinery.
- Decisions are durable in mission folder.

## Phase 6 — Core vertical QA and release

Repos: `tytus-app-atomek`, `tytus-app-catalog`, `tytus-os`/`tytus-cli` if touched

Tasks:

1. Run static gates.
2. Live smoke on `localhost:4242`:
   - start mission
   - create mission folder
   - run local task
   - run pod task
   - capture output/proposal
   - approve/reject
   - resume mission
3. Fix visual/responsive issues found in smoke.
4. Update docs/manuals.
5. Version/tag/catalog/release.

Acceptance:

- Final core Atomek is published and usable.

---

# Expansion

These phases are still part of the final vision, but only after the core vertical proves useful.

## Phase 7 — App skill dispatch

Repos: `tytus-app-atomek`, app repos as needed, `tytus-os` skill registry if driver gaps exist

Tasks:

1. Convert ready app skills into task targets.
2. JULI3TA: hand off music/audio task with mission context.
3. API Tester: endpoint probe task writes report to `outputs/`.
4. Blender MCP: setup-needed until configured, then scene task.
5. Remotion/Hypermotion: show only after real installed skill/manifest exists.

Acceptance:

- Skill cards never fake availability.
- Ready app skills create artifact/handoff records in mission folder.

## Phase 8 — Channels for status/approval

Repos: `tytus-cli`, `tytus-os`, `tytus-app-atomek`

Tasks:

1. Discover configured channels.
2. Show setup-needed for unconfigured channels.
3. Add draft-only external message records.
4. Approval required before sending.
5. Channel replies can be written back into mission `INBOX.md`/audit where supported.

Acceptance:

- Telegram/Slack/Discord/LINE-style channels become mission status/approval surfaces without auto-send risk.

## Phase 9 — Mission Copilot cleanup

Repo: `tytus-app-atomek`

Tasks:

1. Rename chat surface to Mission Copilot.
2. Default context = mission + selected task + selected files.
3. Collapse advanced context/model controls.
4. Let answers become task/output/proposal/handoff.
5. Keep dynamic AIL aliases/settings only.

Acceptance:

- Chat helps mission work; it does not compete with the mission board.

## Phase 10 — Deeper visual polish

Repo: `tytus-app-atomek`

Tasks:

1. Polish responsive layouts beyond core smoke.
2. Final empty/loading/error states.
3. Keyboard/selection/copy polish.
4. High-density mission timeline improvements.

Acceptance:

- Atomek feels intentional, not accumulated.
