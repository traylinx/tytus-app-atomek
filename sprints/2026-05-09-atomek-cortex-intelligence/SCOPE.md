# Scope — Corrected Sprint Definition

## Goal

Make Atomek intelligent enough to behave like a trustworthy AI coding workbench: follow/stream chat correctly, manage context explicitly, understand a workspace, retrieve relevant project context, propose edits, apply them safely, and verify results.

## Out of scope

- Juli3ta changes.
- Hardcoded model/provider choices.
- Browser current-events tool injection.
- Full IDE terminal implementation.
- Cloud-only memory that ignores local/private routing.

## Definition of “Cortex integrated” for this sprint

Cortex integration means all of the following exist:

0. **Chat UX foundation**
   - Transcript auto-follows new messages while the user is at the bottom.
   - Streaming renders incrementally and visibly.
   - File-edit prompts open preview/apply instead of only returning prose.
   - Context chips can be removed and context scope can be changed per message.
   - Composer is clean; routing/model/mode controls do not pollute the input lane.

1. **Project context ingestion**
   - Index opened files and optionally opened folder files.
   - Chunk content with path/language/mtime/hash metadata.
   - Avoid giant binary/vendor directories.

2. **Embedding-backed retrieval**
   - Embed chunks through global AIL embedding config/alias.
   - Store vectors in app-scoped local storage/SQLite layer.
   - Search by semantic similarity.
   - Combine semantic hits with existing FTS5 memory hits.

3. **Chat context assembly**
   - Before `host.ai.sendMessage()`, retrieve relevant chunks.
   - Attach concise context with filenames, snippets, and scores.
   - Avoid overloading context window.

4. **Agentic edit/check loop**
   - Ask AI for diff against open/indexed files.
   - Preview/apply patch with file safety checks.
   - Run configured checks when available.
   - Feed failures back into follow-up prompt.

5. **User-facing UX**
   - Clear index status.
   - “Index workspace” / “Refresh index”.
   - “Ask project” mode.
   - “Apply and check” action.
   - Visible model/routing/embedding source.
