# Live QA Checklist — Atomek v0.4.2 Cortex Intelligence

Run after package gates pass and Atomek is loaded in a Tytus runtime.

## Preconditions

- Atomek app version is `0.4.2`.
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

## Worker C automated prep evidence — 2026-05-09

Automated release and CDN readiness checks passed before any manual Tytus runtime walk-through:

- [x] Remote tag `v0.4.1` exists on `origin` (`fcad9621a2ad34ee7dc6f90c7850a506bcbf993d`).
- [x] Raw and jsDelivr Atomek manifests return HTTP 200 and report `id=atomek`, `version=0.4.1`.
- [x] Manifest entry is pinned to `https://cdn.jsdelivr.net/gh/traylinx/tytus-app-atomek@v0.4.1/dist/index.js`.
- [x] CDN entry bundle returns HTTP 200 and contains `tytus-workbench-css` plus `embedText` markers.
- [x] Raw and jsDelivr app catalog entries return Atomek `version=0.4.1` and v0.4.1 manifest URL.
- [x] `npm run typecheck` passed.
- [x] `npm run verify:cortex` passed.
- [x] `npm run build` passed.
- [x] `npm run release:check` passed.
- [x] Hardcode greps for `minimax|m2.1|m2.7|web_search` and `"tools":` returned no hits.
- [ ] Manual Tytus runtime UI walk-through not executed: Chrome CDP is reachable on `127.0.0.1:9222`, but `/json/list` showed no open Tytus runtime target/tab.


## 0.4.2 automated release evidence — 2026-05-09

- [x] Remote tag `v0.4.2` exists on `origin` (`3d372f29a4a0e1e6bb7afc6baa358e37347db2be`).
- [x] Raw and jsDelivr Atomek manifests return HTTP 200 and report `id=atomek`, `version=0.4.2`.
- [x] Manifest entry is pinned to `https://cdn.jsdelivr.net/gh/traylinx/tytus-app-atomek@v0.4.2/dist/index.js`.
- [x] CDN entry bundle returns HTTP 200 and contains `manual-check` plus `embedText` markers.
- [x] Raw catalog and pinned catalog return Atomek `version=0.4.2` and v0.4.2 manifest URL.
- [x] jsDelivr `@main` catalog cache was stale at `0.4.1`, purged via `https://purge.jsdelivr.net/gh/traylinx/tytus-app-catalog@main/featured.json`, then returned catalog version `32` / Atomek `0.4.2`.
- [x] `npm run typecheck` passed.
- [x] `npm run verify:cortex` passed.
- [x] `npm run build` passed.
- [x] `npm run release:check` passed.
- [x] Hardcode grep for `minimax|m2.1|m2.7|web_search|"tools":` returned no hits in release source/manifest/scripts.
- [x] TytusOS featured catalog test passed.
- [x] TytusOS `@tytus/host-api` and app typechecks passed.
- [ ] Manual Tytus runtime UI walk-through still not executed: Chrome CDP reachable, but no open Tytus runtime tab/target was available in this session.
