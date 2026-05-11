# Feature Audit — What Exists, What Is Wrong, What Final Atomek Needs

## Summary table

| Feature | Exists now | Current problem | Final decision |
|---|---|---|---|
| Product identity | Partial | UI still feels like noisy IDE options | Reframe as Control Tower for agent teams |
| Team Mission start | Partial | Mission creation exists but not the single obvious path | Make Team Mission the default landing flow |
| Mission folder protocol | Partial | Writes core files but missing explicit outputs/proposals/approvals directories in all paths | Mission folder is source of truth; always create full protocol |
| Resource graph | Yes | Shown as raw-ish cards; not converted into team recommendations | Use it to recommend team, show who can see what, hide debug details |
| Local agents | Yes | Local agents are listed and can run, but UX is low-level | Task-first “Ask Claude/OpenCode/Codex/pi to do X” actions |
| Tytus Terminal | Yes | “Open in terminal” reads like implementation detail | Keep as supervised mode, under task actions |
| Pod agents | Partial | Pods are in resource graph, but Atomek cannot yet dispatch tasks to them as first-class team members | Add pod-agent dispatch adapter and transcript capture |
| AIL route/chat | Yes | Chat is useful but separate from mission/team work | Chat becomes mission copilot and output surface, not product center |
| Model selection | Yes | Dynamic aliases/settings exist; must not hardcode models | Keep AIL/global model alias pattern only |
| Shared folders | Yes | Technically discovered, but not product-center | Show shared folder as “team desk”; attach to mission prominently |
| App skills | Partial | Skill registry exists; most skills are instructions, not executable drivers | Convert to actionable configured app tasks; unavailable = setup-needed |
| Channels | Platform exists | Atomek does not yet make Telegram/Slack/etc. part of missions | Add channel approval/status surface after core run flow |
| Files/editor | Yes | Good enough as tool, but over-dominates product | Keep editor for context/preview; not default product center |
| Project index/Cortex | Yes | Useful but hidden in chat controls | Use for mission context recommendations and search |
| Semantic embeddings | Partial | LocalStorage vector store and embedding discovery exist | Keep optional; no blocker for final Control Tower MVP |
| Artifacts/outputs | Yes | Outputs exist, but not tied strongly to mission outputs/proposals | Mission output cards must write to `outputs/` and `proposals/` |
| Edit preview | Yes | Strong primitive; must become formal approval gate | All file writes go through proposals + preview/apply approval |
| Run history | Partial | Local run history exists; pod/app/channel runs missing | Normalize every run under one `RunRecord` model |
| Timeline | Partial | Audit/run data exists but UI not user-friendly | Build chronological mission timeline grouped by task/agent |
| Responsive layout | Partial | Still crowded; right dock can crush workspace | Three-screen layout with responsive stack/columns |
| Settings | Partial | Settings as tab exists | Keep, but move advanced model/AIL to Resource Setup/settings |
| Safety | Partial | Preview rule exists; no full approval inbox | Add explicit approval inbox and risk labels |

## Feature-by-feature analysis

### 1. Product identity

Current evidence:

- Package description says “Monaco workspace with intelligent AIL chat...”
- Newer UI copy says “Tytus Control Tower” and “Coordinate missions, not tabs.”
- Activity bar still exposes IDE-ish surfaces: Explorer, Search, Source, Control Tower, Extensions, Chat, Files, Settings.

Problem:

The user sees a cluttered workbench, not the amazing system: agents + pods + shared folders + channels working as a team.

Final:

Atomek is marketed and shaped as a mission/team cockpit. Editor/chat/terminal are subordinate tools.

### 2. Team Mission start

Current evidence:

- `MissionControlHome` creates a mission via `host.missions.create()` and writes mission files.
- It shows goal textarea, start mission, resource counts, presets, recent missions.

Problem:

This is close, but still embedded inside a larger IDE frame and duplicated with Control Tower side panel.

Final:

Landing must be the Team Mission wizard. The first CTA is “Start team mission.” No unexplained agent buttons before mission context exists.

### 3. Mission folder protocol

Current evidence:

- Writes `MISSION.md`, `MISSION.json`, `RESOURCES.md`, `TASKS.md`, `HANDOFF.md`, `INBOX.md`, `OUTBOX.md`, `AUDIT.jsonl`, sometimes `NEXT.md`.
- Local jobs save transcripts under `runs/`.

Problems:

- `outputs/`, `proposals/`, and `approvals/` are not guaranteed in every path.
- `MISSION.json` has basic resources/tasks but no strong selected-resource visibility contract.
- Mission pack can be rewritten and lose timeline nuance if not append-safe.

Final:

Mission folder is the durable source of truth. Use append-only `AUDIT.jsonl` and `RUNS.jsonl`; write outputs/proposals/approvals consistently.

### 4. Resource graph

Current evidence:

- Host API exposes `host.resources.list()/refresh()`.
- Live tray reports workspace, local CLIs, shared folder, pod agents, AIL route, app skills.

Problem:

Raw resource status is not a product. It must become recommendations and permissions:

- who can work
- what they can see
- what it costs
- what approval is needed

Final:

Resource graph powers “Recommended team” and “Access scope” before dispatch.

### 5. Local agents

Current evidence:

- Host API exposes `host.local.listTools()`, `openTerminal()`, `runJob()`, `streamJob()`, `cancelJob()`.
- Atomek can run local jobs and save transcripts.

Problems:

- UI is still tool-first: list tool, click background review.
- It does not read like a team with roles.

Final:

Task-first UX:

- “Ask Claude to implement”
- “Ask Codex to review”
- “Ask pi for second opinion”

Local agents are assigned roles inside a task graph.

### 6. Pod agents

Current evidence:

- Live `/api/state` reports two ready `nemoclaw` pods and one AIL route.
- Resource graph includes `pod-agent` resources.

Problem:

Atomek has no first-class pod task dispatch path yet. It can show pod resources, but cannot assign mission tasks to pod agents and save their transcript in the same model.

Final:

Add `host.pods.dispatchMissionTask()` or extend `host.resources.dispatch()` via tray same-origin proxy. Pod transcript lands in `runs/`, output artifacts in `outputs/`, and audit event in `AUDIT.jsonl`.

### 7. Shared folders

Current evidence:

- Live shared folder binding: `/Users/sebastian/MAKAKOO/data/shared/`, bucket `shared`, auto-sync true, provisioned pods.

Problem:

Shared folder is buried as resource info. It should be visible as “Team desk”.

Final:

Mission wizard has “Team desk / shared folder” step:

- mission-only
- shared folder
- push/pull pod inbox

Show sync/provision status before dispatch.

### 8. Chat and AIL

Current evidence:

- `useConversation` streams through `host.ai.sendMessage()`.
- Supports dynamic gateway preference `auto|remote|local`, model alias, memory recall, artifacts.
- Settings discover models dynamically.

Problems:

- Chat can feel detached from mission tasks.
- It still has many small context/action chips.

Final:

Chat becomes mission copilot:

- “Ask mission copilot”
- context defaults to mission + selected task
- chips become simple `Mission`, `Selected files`, `No context`, advanced collapsed
- outputs can become tasks/proposals/artifacts

### 9. App skills

Current evidence:

- Manifest declares Atomek agent skills.
- `/api/skills` returns Atomek, terminal, JULI3TA, Blender setup.

Problems:

- “Use in chat” is weak; it injects instructions, not executes app workflows.
- Unconfigured skills can feel fake.

Final:

App skill cards become task targets only when executable/configured. Otherwise show setup-needed.

Initial real app skills:

- JULI3TA audio/music task handoff
- API Tester endpoint probe
- Blender MCP only after setup
- Remotion/Hypermotion only after real discovery

### 10. Channels

Current evidence:

- Tytus CLI has channel management for agent integrations.
- Docs mention Telegram, Discord, Slack socket mode, LINE and broader OpenClaw extensions.

Problem:

Atomek does not yet expose mission channels.

Final:

Add Mission Channels later in sprint:

- configured channels list
- approval/status notification templates
- never auto-send; draft/approve first

### 11. Files/editor

Current evidence:

- File System Access open file/folder.
- Monaco editor, markdown preview, file tree, open editors, recent.
- Save writes to browser-selected handles.

Problem:

Useful but visually/product-wise too central.

Final:

Editor remains the context/preview tool. It opens when user selects files or proposals. Default is mission/team.

### 12. Edit preview/approval

Current evidence:

- Patch parser and workbench edit service convert diffs/replacements to previewable edits.
- Chat and local job outputs can trigger previews.

Problem:

Approval gate is implicit. User needs one central approval inbox.

Final:

All proposals land in `proposals/`. UI has Approval Inbox:

- proposed file writes
- shell/pod/channel actions
- apply/reject buttons
- audit records

### 13. Timeline/run history

Current evidence:

- Local job run state and mission run index exist.
- Audit events are written.

Problem:

Timeline is not the main mission view and does not unify local/pod/app/channel/human events.

Final:

Mission Board shows timeline grouped by task/agent. Every run gets owner, status, transcript path, outputs, approvals.

### 14. Responsive UX

Current evidence:

- Layout prefs, resizable sidebars, dock mode, chat responsive work exists.

Problem:

The current UI still collapses into clutter when windows overlap or resize.

Final:

Three-screen responsive layout:

- wide: Team/Mission Board + detail panel
- medium: board + collapsible detail drawer
- small: stacked mission cards; editor/chat open as focused panels

### 15. Safety/security

Current evidence:

- Mission rules warn against direct writes.
- Local job prompts demand previewable edits.
- Tray/host restricts local tools to allowlisted actions.

Problems:

- Approval state not formal enough.
- Secret/file visibility not shown clearly enough.

Final:

Before dispatch Atomek shows:

- what resource can see
- what it can write
- cost/risk
- approval gates

No direct shell generated by model. No external message without approval. No hardcoded AI models.
