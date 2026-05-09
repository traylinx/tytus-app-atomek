# UAT — Acceptance Checks

## Chat UX

- [ ] Transcript follows the latest message while user is at the bottom.
- [ ] Streaming answer visibly updates before completion.
- [ ] Scrolling up preserves position and shows `Jump to latest` on new output.
- [ ] `Jump to latest` restores follow mode.
- [ ] Attached file chips can be removed before send.
- [ ] Active-file context can be disabled for a message.
- [ ] Composer primary lane contains only context/attach, input, send/stop.
- [ ] Edit request against open file opens preview/apply and modifies Monaco buffer after apply.

## Chat and routing

- [ ] Auto/Remote/Local AIL routing still works.
- [ ] Model alias field still uses global AIL config.
- [ ] No hardcoded model IDs in source.
- [ ] No provider-specific `web_search` hardcode.

## Indexing

- [ ] Open files can be indexed.
- [ ] Index status shows file/chunk count.
- [ ] Editing a file marks index stale or refreshes hash.
- [ ] Vendor/binary/large files are skipped safely.

## Retrieval

- [ ] Ask a question about a non-active indexed file; answer includes correct context.
- [ ] Retrieved context list shows file paths/snippets.
- [ ] If embedding unavailable, UI says keyword retrieval fallback.
- [ ] If embedding available, semantic search finds paraphrased matches.

## Edit loop

- [ ] AI can generate a diff against an indexed/open file.
- [ ] Preview shows current/proposed changes.
- [ ] Apply marks file dirty and shows save warning.
- [ ] Save all persists changes.
- [ ] Failed/manual check path is explicit, not fake.

## Backward compatibility

- [ ] Works on TytusOS without `host.ai.updateThread`.
- [ ] Works on TytusOS without embedding API, using keyword fallback.
