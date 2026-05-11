# Lope Review Summary

Reviewed file: `IMPLEMENTATION-PLAN.md`  
Validators: `claude`, `pi`, `kimi`  
Result: Claude + pi returned useful critique; kimi exited 1 and left resume id in raw log.

Raw output: `LOPE-REVIEW.raw.txt`

## Consensus findings

### 1. Core product spine is right

Both working validators agreed the north star is correct:

```text
mission -> team -> run -> output -> approval -> handoff
```

This should remain the sprint guardrail.

### 2. Original plan had too many phases before value

Original 12-phase plan delayed the first real differentiator. It risked polishing local-agent UX before proving pod/local teamwork.

Correction:

- split into **Core Vertical** and **Expansion**
- ship local + pod task runs earlier
- keep responsive/visual acceptance inside every UI phase, not as last cleanup only

### 3. Mission Board and approval model must arrive earlier

Original Phase 3 promised approvals before the approval model existed.

Correction:

- add approval schema/directories in mission protocol phase
- minimal Mission Board ships with team/task/run/output/approval placeholders immediately after mission protocol

### 4. Pod dispatch is the differentiator

Local job runs already mostly exist. Pod dispatch is what makes Atomek uniquely Tytus.

Correction:

- move pod dispatch into Core Vertical, directly after local task-first run model
- do not defer pods behind app-skill polish

### 5. Shared folders and mission chat are not standalone phases

Shared folder is a Team Mission context choice. Mission chat cleanup is part of IA/product simplification.

Correction:

- fold shared folder into mission protocol/team setup
- fold chat label/context cleanup into Phase 0/Board work

### 6. Channels need explicit placement

Original plan mentioned external-message approvals but had no channel phase.

Correction:

- add channels as Expansion phase after core run/approval model
- no auto-send; drafts/approval only

### 7. Avoid redundant logs/directories

Validators warned about `AUDIT.jsonl` vs `RUNS.jsonl` and proposals vs approvals drift.

Correction:

- `AUDIT.jsonl` is canonical event stream
- `RUNS.jsonl` is a projection/cache written from run records
- `proposals/` stores payloads; `approvals/` stores decisions referencing payload paths

## Accepted plan change

`IMPLEMENTATION-PLAN.md` is rewritten around:

1. Core Vertical MVP — makes Atomek useful.
2. Expansion — app skills, channels, deeper polish.
3. Release — verify/publish once UAT passes.
