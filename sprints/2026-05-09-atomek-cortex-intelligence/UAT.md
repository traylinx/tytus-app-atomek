# UAT — Acceptance Checks

Audit note after `0.4.2`: source-level and package-gate acceptance is closed where marked below. Unchecked items are still live/manual UI checks and must stay unchecked until Worker Live-QA provides Tytus runtime evidence.

## Dynamic chat/file context

- [x] Active file appears as removable context only when the current scope includes it. Live source-runtime evidence: `Context Active file` / `Active file: Untitled-1 dirty` on `http://localhost:4243`.
- [x] Active selection can be attached and is sent before full-file context. Source/contract verified by `npm run verify:cortex`; live UI evidence still tracked in `LIVE-QA-CHECKLIST.md`.
- [x] Removing the active-file chip disables that context for the next message. Source/contract verified by `npm run verify:cortex`; live UI evidence still tracked in `LIVE-QA-CHECKLIST.md`.
- [x] `No context` sends no file bodies. Source verified: `scope: "none"` builds no attachments/context parts.
- [x] `Open editors` sends only the current open editors within budget. Source/contract verified by `npm run verify:cortex`; live UI evidence still tracked in `LIVE-QA-CHECKLIST.md`.
- [ ] Context chip click reveals the file/range in Monaco. Live UI evidence required.
- [ ] Context preview shows path/range/version/dirty or stale state. Live UI evidence required.
- [x] Changing editor content increments document version/hash used for context and edit conflict checks. Source/contract verified by `npm run verify:cortex`; live UI evidence still tracked in `LIVE-QA-CHECKLIST.md`.

## Chat UX

- [ ] Transcript follows the latest message while user is at the bottom. Live UI evidence required.
- [x] Streaming answer visibly updates before completion. Live source-runtime evidence: message showed `Atomek streaming` before final diff response.
- [ ] Scrolling up preserves position and shows `Jump to latest` on new output. Live UI evidence required.
- [ ] `Jump to latest` restores follow mode. Live UI evidence required.
- [ ] Attached file chips can be removed before send. Live UI evidence required.
- [ ] Active-file context can be disabled for a message. Live UI evidence required.
- [ ] Composer primary lane contains only context/attach, input, send/stop. Live UI evidence required.
- [x] Edit request against open file opens preview/apply and modifies Monaco buffer after apply. Live source-runtime evidence: `Review AI edit`, `Apply to active file`, `Preview Live QA Fixed`.
- [ ] AI returning prose for an edit request shows `Generate patch`; it does not claim the file changed. Live UI evidence required.

## Chat and routing

- [x] Auto/Remote/Local AIL routing still works. Live source-runtime evidence: settings expose Auto/Remote/Local, chat answered via configured AIL gateway/local path without hardcoded model IDs.
- [x] Model alias field still uses global AIL config. Source verified in `WorkbenchShell.tsx` settings and `useConversation.ts`; live/runtime evidence still pending.
- [x] No hardcoded model IDs in source.
- [x] No provider-specific `web_search` hardcode.

## Indexing

- [x] Open files can be indexed. Source/contract verified by `npm run verify:cortex`; live UI evidence still tracked in `LIVE-QA-CHECKLIST.md`.
- [ ] Index status shows file/chunk count. Live UI evidence required.
- [x] Editing a file marks index stale or refreshes hash. Source/contract verified by `npm run verify:cortex`; live UI evidence still tracked in `LIVE-QA-CHECKLIST.md`.
- [x] Vendor/binary/large files are skipped safely. Source/contract verified by `npm run verify:cortex` plus release hardcode/vendor greps.

## Retrieval

- [x] Ask a question about a non-active indexed file; answer includes correct context. Source/contract retrieval ranking verified by `npm run verify:cortex`; live UI evidence still tracked in `LIVE-QA-CHECKLIST.md`.
- [x] Retrieved context list shows file paths/snippets. Source/contract verified by `npm run verify:cortex`; live UI evidence still tracked in `LIVE-QA-CHECKLIST.md`.
- [x] If embedding unavailable, UI says keyword retrieval fallback. Source verified in semantic retrieval and embedding capability handling; live UI evidence still pending.
- [ ] If embedding available, semantic search finds paraphrased matches. Live/runtime embedding evidence required.

## Edit loop

- [x] AI can generate a diff against an indexed/open file. Parser/edit-service contract verified by `npm run verify:cortex`; live UI evidence still tracked in `LIVE-QA-CHECKLIST.md`.
- [x] Preview shows current/proposed changes. Live source-runtime evidence: `CURRENT # Untitled` / `PROPOSED # Live QA Fixed`.
- [x] Apply marks file dirty and shows save warning. Apply/dirty state source contract verified by `npm run verify:cortex`; live UI evidence still tracked in `LIVE-QA-CHECKLIST.md`.
- [ ] Save all persists changes. Browser File System Access persistence remains manual/user-mediated and was not clicked in live QA.
- [x] Failed/manual check path is explicit, not fake.

## Backward compatibility

- [x] Works on TytusOS without `host.ai.updateThread`. Source verified: title updates fall back to local title override when host API lacks `updateThread`.
- [x] Works on TytusOS without embedding API, using keyword fallback. Source verified: missing `host.ai.embedText` returns keyword retrieval mode.


## Live source-runtime QA evidence — 2026-05-09

- [x] Source Tytus runtime `http://localhost:4243/` loaded Atomek from `https://cdn.jsdelivr.net/gh/traylinx/tytus-app-atomek@v0.4.2/dist/index.js`.
- [x] New throwaway file created; active context chip showed `Untitled-1` / dirty active file.
- [x] AIL chat returned unified diff for active file.
- [x] Preview/apply flow changed the editor preview from `# Untitled` to `# Live QA Fixed` and kept the file unsaved.
- [x] Manual edit-check panel opened after apply with explicit no-host-execution copy/paste workflow.
- [ ] Packaged Tytus runtime `http://127.0.0.1:4242/` still needs rebuild/reinstall from TytusOS `ea56524`; before the fix it showed stale Atomek `0.4.1`.
