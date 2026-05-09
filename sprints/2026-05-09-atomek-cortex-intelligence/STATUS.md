# Status — Atomek Cortex Intelligence Sprint

## Current truth

Atomek `0.4.0` is now an intelligent IDE-chat workbench, shipped as a standalone app release candidate. The sprint moved from implicit chat over open files to explicit, per-message, inspectable context with project indexing and real preview/apply edit flow.

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

## Remaining after Atomek 0.4.0

- Optional live browser/Tytus QA after tag/catalog publish.
- Separate TytusOS host API sprint for `host.ai.embedText`, vector storage, and semantic RAG.
- Optional automated tests once the app repo adds a test runner.

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
- Browser live QA still blocked on local Chrome CDP not running (`DevToolsActivePort not found`); CLI/build/release gates passed.
