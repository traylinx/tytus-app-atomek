# Scope — Corrected Sprint Definition

## Goal

Make Atomek intelligent enough to behave like a trustworthy AI coding workbench: chat is dynamically connected to files/editor state, context is explicit/removable/versioned, streaming/follow works, edits become preview/apply workspace changes, and only then project indexing/RAG/embeddings are layered on top.

## Out of scope

- Juli3ta changes.
- Hardcoded model/provider choices.
- Browser current-events tool injection.
- Full IDE terminal implementation.
- Cloud-only memory that ignores local/private routing.

## Definition of “Cortex integrated” for this sprint

Cortex integration means all of the following exist:

0. **IDE context foundation**
   - Maintain a live document registry with path/URI/version/dirty/language/selection state.
   - Maintain a chat context store with explicit attachments and configurable implicit context.
   - Context chips can be inspected, revealed in editor, removed, and scoped per message.
   - Chat requests build context from selected attachments/scope, not unconditional active/open files.

1. **Chat UX foundation**
   - Transcript auto-follows new messages while the user is at the bottom.
   - Streaming renders incrementally and visibly.
   - File-edit prompts open preview/apply instead of only returning prose.
   - Composer is clean; routing/model/mode controls do not pollute the input lane.
   - Chat and files feel like one IDE workflow, not separated panels.

2. **Project context ingestion**
   - Index opened files and optionally opened folder files.
   - Chunk content with path/language/mtime/hash metadata.
   - Avoid giant binary/vendor directories.

3. **Embedding-backed retrieval**
   - Embed chunks through global AIL embedding config/alias.
   - Store vectors in app-scoped local storage/SQLite layer.
   - Search by semantic similarity.
   - Combine semantic hits with existing FTS5 memory hits.

4. **Chat context assembly**
   - Before `host.ai.sendMessage()`, retrieve relevant chunks.
   - Attach concise context with filenames, snippets, and scores.
   - Avoid overloading context window.

5. **Agentic edit/check loop**
   - Ask AI for diff against open/indexed files.
   - Preview/apply patch with file safety checks.
   - Run configured checks when available.
   - Feed failures back into follow-up prompt.

6. **User-facing UX**
   - Clear index status.
   - “Index workspace” / “Refresh index”.
   - “Ask project” mode.
   - “Apply and check” action.
   - Visible model/routing/embedding source.
