# Codebase Review — Chat/File Integration

**Review date:** 2026-05-09  
**Goal:** Make the sprint production-ready by grounding it in the actual Atomek, Monaco, and VSCode codebases.

## Repos reviewed

- Atomek: `/Users/sebastian/Projects/tytus-apps/tytus-app-atomek`
- Monaco sample/apps: `/Users/sebastian/Projects/makakoo/agents/sample_apps/monaco-editor`
- VSCode sample/apps: `/Users/sebastian/Projects/makakoo/agents/sample_apps/vscode`

## Atomek current truth

Relevant files:

- `src/workbench/components/WorkbenchShell.tsx`
- `src/workbench/ai/useConversation.ts`
- `src/workbench/ai/contextBuilder.ts`
- `src/workbench/types.ts`
- `src/workbench/workbench.css`

Findings:

1. **Chat context is static and implicit.**
   - `useConversation()` builds context from `activeFile` and `openEditors` via `buildAiContext()`.
   - There is no persistent `ChatContextStore`, no per-message context selection, and no removable attachment model.
   - The composer shows a chip, but it is display-only and cannot reliably remove the active/open file context.

2. **Chat and files are connected only at send time.**
   - The active/open files are sampled when `askAgent()` runs.
   - There is no live model/document registry with file URI, version, selection, cursor, dirty state, or range attachments.
   - If editor content changes, no first-class context delta is emitted to chat state.

3. **Streaming exists in data flow but not production UX.**
   - `useConversation()` handles `message_created`, `token`, `message_updated`, and `done` events.
   - `ChatPane` has no transcript follow mode, scroll lock, jump-to-latest, or streaming body renderer guarantees.

4. **Edit preview/apply exists but is manual and disconnected from user intent.**
   - `previewEditFromText()` can parse diffs/replacement blocks and apply to Monaco state.
   - User prompts like “change author to X” are not automatically converted into edit preview/apply flow.
   - The AI can answer in prose and the file remains unchanged unless the user manually finds/clicks preview.

5. **Composer is not production-ready.**
   - `Auto` and `Plan` appear inside the primary composer toolbar.
   - `+` attach button is not backed by a real attachment picker/model.
   - Context chips are not interactive enough: no clear remove, reveal, scope, or stale-state behavior.

## Monaco sample takeaways

Relevant files:

- `monaco-lsp-client/src/adapters/ITextModelBridge.ts`
- `monaco-lsp-client/src/adapters/TextDocumentSynchronizer.ts`

Patterns to adapt:

1. **Treat Monaco models as documents with identity.**
   - The sample bridges Monaco models to document identifiers by URI.
   - Atomek should keep a registry keyed by file id/path/URI and expose URI/version/range to chat.

2. **Content change events are first-class.**
   - `TextDocumentSynchronizer` opens models, listens to `onDidChangeContent`, emits deltas, and closes on dispose.
   - Atomek should emit document/context changes when Monaco content, selection, active editor, or open editors change.

3. **Range translation matters.**
   - The sample translates Monaco positions/ranges to protocol positions.
   - Atomek should support attaching the active selection/range to chat, not only whole files.

## VSCode sample takeaways

Relevant files:

- `src/vs/workbench/contrib/chat/chatCodeOrganization.md`
- `src/vs/workbench/api/browser/mainThreadDocumentsAndEditors.ts`
- `src/vs/workbench/contrib/chat/browser/widget/input/chatInputPart.ts`
- `src/vs/workbench/api/browser/mainThreadChatContext.ts`
- `src/vs/workbench/api/browser/mainThreadBulkEdits.ts`
- `src/vs/workbench/api/browser/mainThreadEmbeddings.ts`

Patterns to adapt:

1. **Separate chat concerns into models/services.**
   - VSCode separates `attachments`, `contextContrib`, `chatEditing`, `widget`, and `model`.
   - Atomek should stop packing chat, context, attachments, edit application, and rendering into one shell component.

2. **Documents/editors have a delta model.**
   - `mainThreadDocumentsAndEditors.ts` computes added/removed documents/editors and active-editor changes.
   - Atomek needs a lightweight equivalent: document registry + editor state delta + active editor tracking.

3. **Chat attachments are a model, not a visual hack.**
   - `chatInputPart.ts` uses an attachment model, emits `onDidChangeContext`, supports restore/delete/open, and merges explicit + implicit context.
   - Atomek should use explicit attachments plus configurable implicit context.

4. **Workspace edits are applied through a dedicated edit service.**
   - `mainThreadBulkEdits.ts` revives workspace edits and applies them with canonical URIs and result status.
   - Atomek should introduce `WorkbenchEditService` for preview/apply/reject/version-conflict handling instead of ad hoc shell callbacks.

5. **Embedding providers are dynamic.**
   - `mainThreadEmbeddings.ts` registers providers by id and computes embeddings through the selected provider.
   - Atomek must use AIL aliases/provider discovery for embeddings, never source-level model IDs.

## Production correction

The sprint must not treat “chat” as a separate sidebar feature. The correct production architecture is:

```text
Monaco editor models + file store
  -> DocumentRegistry: uri/path/version/dirty/language/selection/ranges
  -> ChatContextStore: explicit attachments + implicit context policy
  -> ContextBuilder: selected snippets/files/index hits/memory hits
  -> useConversation: sends dynamic context with each request
  -> Chat renderer: stream/follow/jump/action UI
  -> WorkbenchEditService: preview/apply/reject workspace edits
  -> Monaco/file store: dirty buffers updated, save required
```

This becomes the spine of the final sprint. Indexing/RAG/embeddings attach to this spine later; they do not replace it.
