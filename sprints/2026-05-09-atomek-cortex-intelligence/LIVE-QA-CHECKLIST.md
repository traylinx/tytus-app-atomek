# Live QA Checklist — Atomek v0.4.0 Cortex Intelligence

Run after package gates pass and Atomek is loaded in a Tytus runtime.

## Preconditions

- Atomek app version is `0.4.0`.
- Open a small local folder with at least one TypeScript/Markdown file.
- Keep one file open and dirty-state visible.
- Do not touch JULI3TA.

## Context builder/store

- [ ] Open two files; make one active.
- [ ] Select a small range in the active file.
- [ ] Set context scope to active selection.
- [ ] Send a chat prompt asking what the selected code does.
- [ ] Confirm context chip shows the selected file/range, not every open file.
- [ ] Remove the chip and send again.
- [ ] Confirm request proceeds without the removed attachment.
- [ ] Switch to open-editors scope.
- [ ] Confirm chips include both open editors and can be revealed/removed.

## Patch parser/edit service

- [ ] Ask: `Change only the selected line to use a clearer variable name. Return a patch.`
- [ ] Confirm Atomek shows an edit preview, not a silent prose answer.
- [ ] Apply the preview.
- [ ] Confirm the editor buffer changes and is marked unsaved/dirty.
- [ ] Before applying a second generated preview, manually edit the target line.
- [ ] Confirm conflict guard blocks or warns unless force/apply is explicitly chosen.
- [ ] Save remains explicit; no automatic disk write happens without user action.

## Project index retrieval

- [ ] Click `Index open files` or `Refresh index`.
- [ ] Confirm status shows indexed file/chunk counts.
- [ ] Ask about a symbol or phrase that exists only in a non-active indexed file.
- [ ] Confirm an `index-hit` context chip appears with path/range/snippet.
- [ ] Remove the hit and confirm it is excluded from the next request.
- [ ] Edit an indexed file and confirm freshness/stale state changes after refresh/reporting.
- [ ] Confirm vendor/build outputs are not indexed as project context.

## Release smoke

- [ ] `npm run typecheck` passed.
- [ ] `npm run build` passed.
- [ ] `npm run release:check` passed.
- [ ] `node scripts/verify-cortex-contracts.mjs` passed.
- [ ] No hardcoded model IDs or provider tool names in `src/`.
- [ ] Live edit flow works on a throwaway file.

## Fail criteria

Stop release/live rollout if any of these happen:

- Context includes hidden/uninspectable file bodies.
- A removed context chip still leaves that file in request context.
- AI prose is presented as if a file changed.
- Patch apply silently overwrites user edits made after preview.
- Index retrieval includes `dist`, `node_modules`, binary files, or JULI3TA assets.
