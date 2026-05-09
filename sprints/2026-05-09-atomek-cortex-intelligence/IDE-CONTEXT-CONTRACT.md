# IDE Context Contract — Production Shape

This contract defines the dynamic connection between chat, files, editor state, and generated edits. It is the non-negotiable spine for the sprint.

## Principles

1. **Chat is part of the workbench state, not a detached Q&A pane.**
2. **Context is explicit, inspectable, removable, and versioned.**
3. **Implicit context exists, but the user can turn it off per message.**
4. **Every AI edit is a workspace edit candidate with preview/apply/reject.**
5. **No model IDs or provider tools are hardcoded. AIL config owns routing/models/tools.**

## Core modules to add/refactor

```text
src/workbench/context/
  documentRegistry.ts       # file/editor model identity, version, dirty, selection, range snapshots
  chatContextStore.ts       # explicit attachments + implicit context policy
  contextBuilder.ts         # final AiContextPart[] assembly from attachments/index/memory
  contextTypes.ts           # shared types

src/workbench/ai/
  useConversation.ts        # sends request-specific dynamic context
  editIntent.ts             # detects edit-like prompts and requests diff/replacement output

src/workbench/edits/
  workbenchEditService.ts   # parse/preview/apply/reject workspace edits with conflict checks
  patchParser.ts            # unified diff/fenced replacement extraction

src/workbench/components/chat/
  ChatPane.tsx
  ChatComposer.tsx
  ChatTranscript.tsx
  ContextChips.tsx
  ChatSettingsDialog.tsx
```

Refactor target: keep `WorkbenchShell.tsx` as orchestrator only. Do not keep growing it as a 2,000-line god component.

## DocumentRegistry

Tracks every editable workbench document.

```ts
type WorkbenchDocument = {
  id: string;
  uri: string;
  path: string;
  name: string;
  language: WorkbenchLanguage;
  version: number;
  contentHash: string;
  dirty: boolean;
  source: WorkbenchFile['source'];
  selection?: WorkbenchRange;
  updatedAt: number;
};
```

Required behavior:

- Register on file open / folder load / generated artifact open.
- Update version/hash/dirty when Monaco content changes.
- Update active document and selection when editor focus/cursor/selection changes.
- Remove or mark closed when editor closes.
- Expose snapshots for context building and edit conflict detection.

## ChatContextStore

Tracks per-message context.

```ts
type ChatContextScope =
  | 'none'
  | 'active-selection'
  | 'active-file'
  | 'open-editors'
  | 'selected-files'
  | 'indexed-project';

type ChatContextAttachment = {
  id: string;
  kind: 'file' | 'selection' | 'open-editors' | 'memory' | 'index-hit';
  label: string;
  fileId?: string;
  path?: string;
  range?: WorkbenchRange;
  version?: number;
  includeBody: boolean;
  removable: boolean;
  implicit: boolean;
};
```

Required behavior:

- Composer shows explicit chips for all context that will be sent.
- Chip remove disables/removes that attachment for the current draft.
- Removing an implicit active-file chip disables active-file implicit context for that draft.
- Chip click reveals file/range in Monaco.
- Context picker can add active selection, active file, open editors, selected files, and later index hits.
- Context preview shows exact paths, ranges, estimated chars/tokens, and stale/version warnings.

## ContextBuilder

Builds `AiContextPart[]` from request-specific context.

Required behavior:

- No unconditional active/open file injection.
- Respect `ChatContextScope` and removed chips.
- Include active selection before whole file when available.
- Clip by budget with deterministic priority:
  1. user-attached selection
  2. user-attached files
  3. active file if enabled
  4. open editors if enabled
  5. retrieved project chunks
  6. memory hits
- Add metadata in context text: path, range, language, version, dirty/stale marker.

## Streaming and transcript contract

Required behavior:

- User message appears immediately.
- Assistant message appears immediately on `message_created` or first token.
- Token/chunk events update visible body incrementally.
- Scroll follows if user was already at bottom.
- Scroll does not jump if user scrolled up; show `Jump to latest`.
- Stop preserves partial text and marks status as stopped, not generic error.

## Edit intent + workspace edit contract

For edit-like prompts, Atomek must bridge chat to files automatically.

Flow:

```text
user asks edit
  -> editIntent detects target/scope from active context
  -> prompt instructs AI to return workspace diff or replacement
  -> parser extracts WorkspaceEditCandidate
  -> preview opens automatically
  -> user applies/rejects
  -> WorkbenchEditService checks document version/content hash
  -> Monaco buffer updates and becomes dirty
  -> save persists through existing file access API
```

Workspace edit candidate:

```ts
type WorkspaceEditCandidate = {
  id: string;
  sourceMessageId: string;
  edits: Array<{
    fileId: string;
    path: string;
    baseVersion: number;
    baseHash: string;
    originalContent: string;
    proposedContent: string;
    range?: WorkbenchRange;
  }>;
  skipped: Array<{ path: string; reason: string }>;
};
```

Required behavior:

- Single-file and multi-file diffs supported.
- Conflict dialog if file changed after preview.
- Apply updates Monaco buffer, not only internal state.
- Dirty/save warning visible after apply.
- If AI returns prose only, show `Generate patch` CTA; do not imply the file changed.

## Settings/model contract

- Gateway preference: `auto | remote AIL | local AIL`.
- Chat model alias: free-form global AIL alias with runtime suggestions.
- Embedding model alias: only after embeddings phase; free-form global AIL alias.
- Model discovery uses `host.ai.listModels()` when available.
- Empty model field means global/default AIL route.
- No source-level model constants.
- No provider-specific tool injection in app code.

## Minimum production tests/gates

Add test coverage where missing. If a test runner is not present, add a small Vitest setup rather than leaving behavior manual-only.

Required tests:

- `contextBuilder` respects scope, removed chips, clipping order.
- `chatContextStore` add/remove/reveal/stale behavior.
- `editIntent` detects common edit prompts without over-triggering pure Q&A.
- `patchParser` handles fenced diff, git diff, replacement block, and skipped paths.
- `workbenchEditService` applies edits with version guard and dirty state.
- `ChatTranscript` auto-follow vs scroll-lock behavior.

Required gates:

```bash
cd /Users/sebastian/Projects/tytus-apps/tytus-app-atomek
npm run typecheck
npm run build
npm run release:check
# after test runner lands:
npm test
```

Hard greps before release:

```bash
! grep -R "minimax\|m2\.1\|m2\.7\|web_search" src --exclude-dir=node_modules
! grep -R '"tools"[[:space:]]*:' src --exclude-dir=node_modules
```
