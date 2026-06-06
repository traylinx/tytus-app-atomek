# Implementation Phases — Production Missions

## Phase 0 — Guardrails and extraction

Goal: reduce risk before UX changes.

Tasks:

1. Create `src/workbench/missions/` modules.
2. Move pure mission/team/task builders from `WorkbenchShell.tsx`.
3. Add/keep typecheck as baseline gate.
4. No visual behavior change.

Acceptance:

- `npm run typecheck` passes.
- Current Atomek UI still loads.
- Git diff is mostly moved code.

## Phase 1 — Mission Board view model

Goal: one canonical state model for both sidebar/dock/board.

Tasks:

1. Build `MissionBoardViewModel` from mission + graph + tools + skills + runs.
2. Filter fake `runs/README.md` entries client-side.
3. Derive task statuses from runs/approvals.
4. Stop left/right panels from maintaining divergent selected task state.

Acceptance:

- Run count no longer counts README.
- Selecting task in one rendered panel does not desync another.
- Existing mission resume still works.

## Phase 2 — Mission files inside Atomek

Goal: created mission folder becomes visible/editable.

Tasks:

1. Add mission file tree component.
2. After mission create/rewrite, open generated files as mission-backed editor tabs.
3. Add save path: mission-backed tab save -> `host.missions.write` single file.
4. Add dirty-tab protection on context rewrite.
5. For resumed missions without readable contents, show file path tree + regenerate/open-folder instruction.

Acceptance:

- Create mission -> user sees files in Atomek.
- User can open/edit/save `MISSION.md` and `TASKS.md` from Atomek.
- No silent overwrite of dirty mission tabs.

## Phase 3 — Task-first run action

Goal: visible task cards run real work.

Tasks:

1. Add selected task detail panel.
2. Add primary `Run task` CTA.
3. Map selected task owner to existing runner:
   - local-cli -> `runLocalJob`
   - pod-agent -> `runPodTask`
   - app-skill -> attach/open skill route
4. Keep advanced controls but demote them.
5. Persist task status to mission files.

Acceptance:

- User can select `Execute or produce artifact` and click `Run task`.
- OpenCode background run starts without visiting Setup.
- Run appears in Runs tab immediately.

## Phase 4 — Runs and transcripts as first-class UI

Goal: every run is visible, durable, resumable.

Tasks:

1. Normalize local and pod run records.
2. Save transcript path and summary.
3. Show active stream and history in board.
4. Add cancel where supported.
5. Link task -> latest run -> transcript.

Acceptance:

- Completed run updates task card.
- Transcript path visible and copyable.
- Refresh/resume keeps run history.

## Phase 5 — Outputs/proposals/approvals

Goal: production safety loop.

Tasks:

1. Parse run output for patch/proposal candidates.
2. Save proposal records under mission folder.
3. Add Approvals tab/badge.
4. Connect existing patch preview/apply dialog.
5. Persist approve/reject decision.

Acceptance:

- Patch-like run output never disappears into chat/log.
- User can approve/reject from Mission Board.
- Decision is durable in mission files.

## Phase 6 — Product polish and docs

Goal: make flow understandable.

Tasks:

1. Rename confusing labels.
2. Add empty-state guidance.
3. Add mini “How this works” inline help.
4. Update Atomek README/docs in this repo.
5. Run release gates.

Acceptance:

- New user can complete create -> run -> inspect output without explanation.
- README matches behavior.
- `npm run typecheck`, `npm run build`, `npm run release:check` pass.

## Phase 7 — Release prep

Goal: ship only after verified.

Tasks:

1. Bump Atomek version.
2. Build.
3. Release check.
4. Commit/tag/push.
5. Then, outside this repo/sprint, catalog/TytusOS distribution can be updated.

Acceptance:

- Atomek repo clean after release.
- CDN tag serves matching manifest and dist.
