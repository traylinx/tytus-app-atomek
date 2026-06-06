# Acceptance Gates — Production Mission Feature

## Gate 0 — Scope

- [ ] Only `tytus-app-atomek` changed.
- [ ] No TytusOS/Tytus CLI/catalog files changed.
- [ ] No hardcoded provider/model/private route strings added.

## Gate 1 — Mission creation

- [ ] Create form asks for mission name.
- [ ] Create form asks for goal.
- [ ] User can choose team preset.
- [ ] Approval policy is visible.
- [ ] Mission folder is created.
- [ ] Mission list shows human name, not timestamp soup.
- [ ] `MISSION.md`, `MISSION.json`, `TASKS.md`, `RESOURCES.md`, `HANDOFF.md` use the mission name.

## Gate 2 — Mission files in Atomek

- [ ] After create, mission file tree appears.
- [ ] Generated mission files open in Atomek tabs.
- [ ] User can edit and save at least `MISSION.md` and `TASKS.md`.
- [ ] Save writes through mission API.
- [ ] Dirty generated files are not overwritten silently.
- [ ] Resumed missions do not fake unread file contents.

## Gate 3 — Task-first run

- [ ] Task card selection opens task detail.
- [ ] Task detail shows assigned resource.
- [ ] Task detail shows what context the resource can see.
- [ ] Primary `Run task` exists.
- [ ] `Run task` starts OpenCode local background run from selected task.
- [ ] User does not need Setup tab for the happy path.

## Gate 4 — Run persistence

- [ ] Run appears immediately with status `running`.
- [ ] Stream/log visible.
- [ ] Transcript saved under `runs/`.
- [ ] `RUNS.jsonl` contains real run record.
- [ ] `runs/README.md` is not counted as a run.
- [ ] Task status updates after run.

## Gate 5 — Outputs/proposals/approvals

- [ ] Run output can be saved as output artifact.
- [ ] Patch-like output creates proposal candidate.
- [ ] Proposal appears in approvals/inbox UI.
- [ ] User can preview patch.
- [ ] User can approve/reject.
- [ ] No file write happens without approval.

## Gate 6 — Resume

- [ ] Reload browser.
- [ ] Resume mission.
- [ ] Mission name, goal, tasks, runs visible.
- [ ] Pending approvals visible.
- [ ] Next recommended action visible.

## Gate 7 — Regression

- [ ] Atomek chat still works.
- [ ] Pod chat target selector still works.
- [ ] File open/save still works for local files.
- [ ] Monaco/editor tabs still work.
- [ ] Output panel still works.
- [ ] Patch preview still works.
- [ ] `npm run typecheck` passes.
- [ ] `npm run build` passes.
- [ ] `npm run release:check` passes before release.

## Ship/no-ship rule

No release if Gate 3 or Gate 4 fails. The feature exists to make mission tasks runnable and durable. If that does not work, visual polish is irrelevant.
