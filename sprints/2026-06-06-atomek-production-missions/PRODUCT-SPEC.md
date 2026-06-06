# Product Spec — Production Atomek Missions

## Product thesis

Atomek is not another IDE and not another chat app.

Atomek is the mission workbench for Tytus Resource Fabric: local files, local AI CLIs, pod agents, shared folders, app skills, outputs, proposals, approvals, and handoffs around one durable mission folder.

## Core mental model

```text
Mission
  Goal
  Folder
  Context files
  Team
  Tasks
  Runs
  Outputs
  Proposals
  Approvals
  Handoff
```

The mission folder is the truth. The UI is a projection of the folder plus live resource graph.

## Primary user flow

### Flow 1 — create mission

1. User opens Atomek.
2. User sees one obvious CTA: `New mission` / `Create mission`.
3. User enters goal.
4. User chooses context scope:
   - current workspace folder
   - selected open files
   - mission-only
   - shared folder/team desk
5. User chooses team preset.
6. User confirms approval policy.
7. Atomek creates mission folder.
8. Atomek immediately opens Mission Board and mission files tree.

Acceptance:

- User sees the created folder path.
- User sees `MISSION.md`, `TASKS.md`, `RESOURCES.md`, etc.
- User can open/edit these files inside Atomek.

### Flow 2 — run selected task

1. User clicks a task card.
2. The task detail panel shows:
   - prompt
   - assigned role/resource
   - what resource can see
   - run mode choices
3. User clicks `Run task`.
4. Atomek dispatches via the safest available route:
   - local background review
   - local terminal supervised run
   - pod agent task
   - app skill/chat attach/open app
5. Run appears in Runs panel immediately.
6. Transcript and run record are saved under mission folder.

Acceptance:

- Task cards are actionable.
- User never has to find hidden Setup buttons to run a task.

### Flow 3 — inspect/edit mission files

1. Mission Board shows a file tree for the mission folder.
2. User opens `MISSION.md`, `TASKS.md`, `RESOURCES.md`, `HANDOFF.md`, `INBOX.md`, `OUTBOX.md` in Atomek editor tabs.
3. User edits files.
4. Save writes back through mission host API or browser folder handle.
5. UI warns before overwriting user edits from generated context rewrites.

Acceptance:

- Mission files are first-class, not hidden implementation detail.

### Flow 4 — outputs/proposals/approvals

1. Runs produce transcripts and possible patch/proposal output.
2. Atomek detects proposal-like output.
3. Atomek stores proposal in `proposals/` and creates approval record.
4. Mission Board shows `Approval required` item.
5. User previews, approves, rejects, or asks for revision.
6. Approved patch uses existing Atomek preview/apply machinery.

Acceptance:

- No generated edit bypasses approval.
- Decisions persist in mission folder.

### Flow 5 — resume mission

1. User opens Atomek later.
2. Resume list shows missions with real status, last run, open approvals.
3. User resumes one.
4. Mission Board restores:
   - mission folder file tree
   - task statuses
   - run history
   - outputs/proposals/approvals
   - current handoff

Acceptance:

- User does not need chat history to understand what happened.

## Production UX principles

1. **Task-first, not tool-first.** User runs the task; Atomek chooses or offers resources.
2. **Folder-visible.** If files are truth, show them.
3. **No fake status.** `ready` means actionable; `waiting` means pending; run counts count real runs only.
4. **No hidden execution.** Setup configures resources; Mission runs work.
5. **No destructive direct writes.** Preview/approval first.
6. **One Agent Team surface.** Avoid duplicate panels with competing state.
7. **Plain names.** Use `Create mission`, `Run task`, `Open mission folder`, `Approval required`.

## Non-goals for this Atomek-only sprint

- Do not add new Tytus host endpoints.
- Do not redesign TytusOS shell.
- Do not add arbitrary shell execution.
- Do not make pod/shared-folder provisioning changes.
- Do not make release/catalog changes until implementation is done and verified.
