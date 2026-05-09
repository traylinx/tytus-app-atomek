# Status — Atomek Cortex Intelligence Sprint

## Current truth

Atomek `0.4.2` is published as an intelligent IDE-chat workbench. The sprint moved from implicit chat over open files to explicit, per-message, inspectable context with project indexing, semantic retrieval when `host.ai.embedText` exists, preview/apply edit flow, and a manual edit-check loop that does not fake host command execution.

## Implemented in this sprint

- Dynamic editor/chat context spine:
  - `DocumentRegistry` tracks file id/path/language/dirty/version/hash/active selection.
  - `ChatContextStore` exposes per-message scopes: no context, selection, active file, open editors, indexed project.
  - Context chips are removable and reveal file/range when possible.
- Chat UX repair:
  - transcript auto-follow for incoming stream tokens.
  - `Jump to latest` when user scrolls away.
  - stop preserves partial streamed text.
  - primary composer controls cleaned; old `Auto`/`Plan` buttons removed from input lane.
- AIL routing/model settings:
  - Remote Tytus AIL / Local AIL / Auto selection lives in Atomek Settings.
  - Chat model alias is free-form/discovered from AIL; no hardcoded model IDs.
  - Embedding model alias field added, also dynamic; empty means AIL global default.
- Workspace edit pipeline:
  - parser/service extracted to `src/workbench/edits/`.
  - supports fenced diff/patch, raw unified diff, and `atomek-replace`/replacement blocks.
  - AI edit responses auto-open single or multi-file preview/apply dialogs when parseable.
  - prose-only edit answers trigger explicit `Generate patch` CTA instead of pretending files changed.
- Project index without embeddings:
  - chunker/index store/retrieval hook added under `src/workbench/projectIndex/`.
  - skips binary/vendor/huge/empty files.
  - indexed-project mode retrieves query-scoped chunks and sends them as removable `index-hit` context.
  - UI shows file/chunk count and refresh/staleness state.
- Embedding capability discovery:
  - `src/workbench/ai/modelCapabilities.ts` and `embeddingCapability.ts` inspect runtime AIL capabilities.
  - Atomek does not infer or hardcode embedding models.
  - host embedding absence is surfaced as a capability/status issue, not hidden.
- Release prep:
  - version bumped to `0.4.0`.
  - dist rebuilt.
  - manifest entry moved to `v0.4.0`.

## Host/API boundary

Semantic/vector RAG is intentionally not faked in Atomek. Current Atomek can discover an embedding API if the host exposes one, but if `host.ai.embedText` is absent it uses keyword retrieval and shows embedding capability unavailable. True vector persistence/search should be a TytusOS host API sprint, not an Atomek hardcode.

## Gates run

```bash
npm run typecheck
npm run build
npm run release:check
grep -RInE 'minimax|m2\.1|m2\.7|web_search' src package.json package-lock.json tytus-app.json scripts || true
grep -RInE '"tools"[[:space:]]*:' src package.json package-lock.json tytus-app.json scripts || true
```

Results: typecheck/build/release-check pass; hardcode greps produced no hits.

## Remaining after Atomek 0.4.2

- Live browser/Tytus QA after tag/catalog publish remains unchecked. Do not mark it passed without Worker Live-QA evidence from a Tytus runtime tab.
- Host command runner remains deferred by design. Current TytusOS installed-app API has no safe shell/check runner.
- Optional future host API work: allow-listed non-shell check execution with consent/audit, if product wants automated checks inside installed apps.

## Lope escalation

Technical escalation was sent to Lope validators `kimi`, `pi`, and `opencode` about the missing host embedding API. All three validator runs errored/timed out, but Lope synthesis still recommended Option A: ship Atomek 0.4.0 with keyword retrieval + dynamic embedding alias/capability fallback, and defer true vector RAG to a separate TytusOS `host.ai.embedText` API sprint.

## Release closeout

- Atomek commit: `6ee73c0` (`Ship Atomek intelligent chat 0.4.0`) pushed to `origin/main`.
- Atomek tag: `v0.4.0` pushed.
- Catalog commit: `1fe09da` (`Publish Atomek 0.4.0`) pushed to `tytus-app-catalog` `origin/main`; catalog version `30`.


## Semantic/host continuation

- Continued sprint beyond `0.4.0` in swarm.
- TytusOS host API now exposes `host.ai.embedText(input)` and routes to AIL `/v1/embeddings` with `gatewayPreference` and optional dynamic `model` alias; no hardcoded embedding model IDs.
- Atomek now uses semantic hybrid retrieval when `host.ai.embedText` exists:
  - query embedding through selected local/remote/auto AIL gateway,
  - chunk embedding through `chatSettings.embeddingModel`,
  - localStorage vector cache keyed by app id, model alias, chunk id, and content hash,
  - cosine similarity + keyword score ranking,
  - fallback to keyword retrieval if embedding is unavailable or fails,
  - removable `index-hit` chips show scores/snippets.
- Added `scripts/verify-cortex-contracts.mjs` and `npm run verify:cortex` for pure-module regression coverage.
- Atomek semantic release version bumped to `0.4.1`; release/tag/catalog closeout follows this change.

## Additional gates run

```bash
# Atomek
npm run typecheck
npm run verify:cortex
npm run build
npm run release:check

# TytusOS host API
npm run test --workspace app -- src/runtime/ai/gateway-candidates.test.ts src/runtime/ai/conversation-service.test.ts
npm run typecheck --workspace @tytus/host-api
npm run typecheck --workspace app
```

Results: all passed.


## Semantic release closeout

- Atomek semantic commit: `96c9e17` (`Add Atomek semantic retrieval 0.4.1`) pushed to `origin/main`.
- Atomek tag: `v0.4.1` pushed.
- App catalog commit: `f7fa66c` (`Publish Atomek 0.4.1`) pushed; catalog version `31`.
- TytusOS host/runtime branch: `feature/tytus-forge-mvp` pushed with `f6a1905` (`host.ai.embedText`) and `e4d5689` (featured Atomek pointer to `0.4.1`).
- Browser/CDP prep rechecked by Worker C on 2026-05-09: Chrome CDP responds on `127.0.0.1:9222`, but `/json/list` returned no open Tytus runtime tab, so live UI QA remains not executed. Automated CLI/build/release and remote CDN/catalog checks passed.

## Worker C live QA preparation evidence — 2026-05-09

- Remote release refs verified:
  - `git ls-remote --tags origin refs/tags/v0.4.1` -> `fcad9621a2ad34ee7dc6f90c7850a506bcbf993d`.
  - `git ls-remote origin refs/heads/main` -> `790173a9274a0da84c43109227ebda019e7c2787`.
- Remote manifest/catalog/CDN verified with HTTP 200 responses:
  - `https://raw.githubusercontent.com/traylinx/tytus-app-atomek/v0.4.1/tytus-app.json` -> `id=atomek`, `version=0.4.1`, entry pinned to `https://cdn.jsdelivr.net/gh/traylinx/tytus-app-atomek@v0.4.1/dist/index.js`.
  - `https://cdn.jsdelivr.net/gh/traylinx/tytus-app-atomek@v0.4.1/tytus-app.json` -> same manifest values.
  - `https://cdn.jsdelivr.net/gh/traylinx/tytus-app-atomek@v0.4.1/dist/index.js` -> HTTP 200, CSS marker `tytus-workbench-css` present, semantic `embedText` marker present.
  - `https://raw.githubusercontent.com/traylinx/tytus-app-catalog/main/featured.json` and `https://cdn.jsdelivr.net/gh/traylinx/tytus-app-catalog@main/featured.json` -> Atomek `version=0.4.1`, manifest URL pinned to the v0.4.1 raw manifest.
- Local gates rerun from `/Users/sebastian/Projects/tytus-apps/tytus-app-atomek`:
  - `npm run typecheck` -> PASS.
  - `npm run verify:cortex` -> PASS (`Atomek cortex contract harness: PASS`).
  - `npm run build` -> PASS (`✓ built in 2m 9s`).
  - `npm run release:check` -> PASS (`[release-check] ok atomek 0.4.1`).
  - Hardcode greps for `minimax|m2.1|m2.7|web_search` and `"tools":` -> PASS/no hits.
- Browser/CDP prep:
  - `curl http://127.0.0.1:9222/json/version` -> PASS, Chrome `147.0.7727.138` responded.
  - `curl http://127.0.0.1:9222/json/list` -> PASS but no open target rows printed; no Tytus runtime tab available for UI walk-through.
- Repo state after gates: pre-existing non-doc swarm edits remain in `src/workbench/components/WorkbenchShell.tsx` and `src/workbench/checks/`; Worker C did not revert or edit them.
## 2026-05-09 — Worker A manual edit-check capture

- Implemented Atomek-side manual check capture for Phase 7 without host command execution.
- Added `src/workbench/checks/manualChecks.ts` for package-script command discovery, manual command/result capture, and follow-up prompt construction.
- Workbench now opens the bottom Terminal panel after AI edit apply, lets the user copy commands, paste check output, and send that output back to Atomek for a diff follow-up.
- Gate: `npm run typecheck` passed.


## Manual check / 0.4.2 release closeout — 2026-05-09

- Atomek manual-check commit: `3d372f2` (`Add Atomek manual check loop 0.4.2`) pushed to `origin/main`.
- Atomek tag: `v0.4.2` pushed.
- App catalog commit: `2a59e4e` (`Publish Atomek 0.4.2`) pushed; catalog version `32`.
- TytusOS branch: `feature/tytus-forge-mvp` pushed with `57c078c` pointing featured Atomek/catalog to `0.4.2` and documenting that `@tytus/host-api` exposes no host shell runner for installed apps.
- Manual edit-check loop shipped: after AI edit/workspace patch apply, Atomek opens the bottom Terminal/manual-check panel, suggests project check commands from opened `package.json` files, lets the user copy commands, paste stdout/stderr, mark pass/fail/pending, and ask Atomek to continue from the captured result.
- Automatic host command execution deliberately not implemented: current host API has no installed-app command runner; built-in Terminal uses tray daemon PTY endpoints and is not a capability for installed apps. Future implementation must be an allow-listed non-shell check API with explicit consent/audit.
- Remote verification: raw manifest, jsDelivr manifest, jsDelivr bundle, raw catalog, pinned catalog all return `0.4.2`; jsDelivr `@main` catalog cache was purged and now returns catalog version `32`.

Gates run for 0.4.2:

```bash
# Atomek
npm run typecheck
npm run verify:cortex
npm run build
npm run release:check
grep: no minimax/m2.1/m2.7/web_search/"tools": hardcodes

# TytusOS
npm run test --workspace app -- src/apps/featured-apps-catalog.test.ts
npm run typecheck --workspace @tytus/host-api
npm run typecheck --workspace app
```

Results: all passed.

## Sprint-audit closeout — 2026-05-09

Worker Sprint-Audit inspected `PLAN.md`, `UAT.md`, `STATUS.md`, `LIVE-QA-CHECKLIST.md`, and `SPRINT-MANIFEST.json` after the `0.4.2` release. Current repo truth:

- Atomek `origin/main`: `540b066` (`Close Atomek 0.4.2 sprint docs`), with release code tag `v0.4.2` at `3d372f2`.
- Catalog `origin/main`: `2a59e4e`, catalog version `32`.
- TytusOS `origin/feature/tytus-forge-mvp`: `57c078c`, featured Atomek pointer at `0.4.2`.
- Re-run gates passed from `/Users/sebastian/Projects/tytus-apps/tytus-app-atomek`: `npm run typecheck`, `npm run verify:cortex`, `npm run build`, `npm run release:check`.
- Re-run hardcode grep returned no hits for `minimax|m2.1|m2.7|web_search|"tools":` in `src`, package files, manifest, or scripts.
- No remaining unchecked implementation item was found in the sprint docs. Remaining unchecked items are live/manual runtime checks only.
- Live UI QA is still not executed in these docs; no checkbox requiring Tytus runtime/browser evidence was marked complete by this audit.



## Live QA and TytusOS downgrade fix — 2026-05-09

- Worker Live-QA found a real packaged-runtime blocker: `/Applications/Tytus.app` on `http://127.0.0.1:4242` still showed Atomek `0.4.1`.
- Root cause: TytusOS `app-rebrand-migrations.ts` pinned Atomek rebrand repair to `v0.3.8` and treated any non-exact Atomek row as stale, so current catalog installs could be coerced to old Atomek bundles.
- Fixed in TytusOS commit `ea56524` (`Stop Atomek rebrand migration downgrades`): migration floor moved to `0.4.2`, stale detection no longer downgrades newer Atomek rows, and tests assert future `0.4.3` rows are preserved.
- Source dev runtime `http://localhost:4243/` passed live QA after clearing the dev origin store: Atomek loaded `@v0.4.2/tytus-app.json` and `@v0.4.2/dist/index.js`; chat answered; edit request returned diff; preview/apply changed throwaway editor; file stayed unsaved; manual edit-check panel opened after apply.
- Evidence screenshots: `/tmp/atomek-live-smoke-final-4243.png`, `/tmp/atomek-042-fixed-live-full.png`.
- Remaining operational packaging task: rebuild/reinstall packaged Tytus.app from `feature/tytus-forge-mvp` at `ea56524` so port `4242` matches source runtime.


## Packaged runtime closeout — 2026-05-09

- Rebuilt TytusOS web dist from `services/tytus-os` commit `ea56524` and synced it into `services/tytus-cli/tray/web/os`.
- Rebuilt local release binaries and reinstalled `/Applications/Tytus.app`; new running PID on port `4242`: `59717`; `/api/version` still reports tray version `0.6.14` as expected.
- Embedded packaged runtime now serves `assets/index-Xb4UzeDM.js` and contains no stale Atomek `v0.3.8`, `v0.4.1`, or catalog `f7fa66c` references.
- Packaged runtime `http://127.0.0.1:4242/` live QA passed in headless Chrome:
  - loaded `https://cdn.jsdelivr.net/gh/traylinx/tytus-app-atomek@v0.4.2/tytus-app.json`;
  - loaded `https://cdn.jsdelivr.net/gh/traylinx/tytus-app-atomek@v0.4.2/dist/index.js`;
  - created throwaway `Untitled-1`;
  - Local AIL streamed and completed an `atomek-replace` edit;
  - Atomek showed `Review AI edit`, applied it to the active file, kept the file unsaved/dirty, and opened the manual edit-check panel.
- Evidence files:
  - `/tmp/atomek-4242-flow3-after-response.png`
  - `/tmp/atomek-4242-flow3-preview.png`
  - `/tmp/atomek-4242-flow3-after-apply.png`
  - `/tmp/atomek-4242-flow3-result.json`
- Tytus CLI gates passed:
  - `TYTUS_OS_SOURCE=../tytus-os scripts/sync-tytus-os-dist.sh --check`
  - `git diff --check`
  - `cargo build --release -p atomek-cli -p tytus-mcp -p tytus-tray`
  - `cargo test -p atomek-cli --lib`
  - `cargo test -p tytus-tray --bin tytus-tray`
