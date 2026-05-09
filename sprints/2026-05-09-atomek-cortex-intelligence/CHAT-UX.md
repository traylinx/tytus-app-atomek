# Chat UX Repair Track

## Source complaints / screenshots

Screenshots reviewed:

- `/Users/sebastian/Desktop/Screenshot 2026-05-09 at 09.29.17.png`
- `/Users/sebastian/Desktop/Screenshot 2026-05-09 at 09.29.06.png`
- `/Users/sebastian/Desktop/Screenshot 2026-05-09 at 09.28.07.png`
- `/Users/sebastian/Desktop/Screenshot 2026-05-08 at 21.43.44.png`

Observed problem: Atomek has a chat surface, but it does not yet feel like an intelligent coding workbench. The transcript does not reliably follow the latest assistant output, streaming is not visibly alive, file-change requests can end as prose instead of an actual edit flow, context attachments are sticky/hard to remove, and the composer exposes confusing controls like `Auto` / `Plan` inside the primary input area.

## Required outcome

Before deeper Cortex/RAG work, the chat must become operationally trustworthy and dynamically connected to the workbench files/editor state:

1. User sees the assistant response update live while it is generated.
2. Transcript follows new messages while the user is at the bottom.
3. If the user scrolls up intentionally, Atomek preserves that position and shows a clear “Jump to latest” control.
4. File-edit prompts produce a concrete preview/apply flow, not only explanatory text.
5. Attached files/context are visible, inspectable, revealable in Monaco, and removable.
6. Active selection/active file/open editors are context choices, not hidden forced attachments.
7. The composer is clean: text input, context chips, attach controls, send/stop. Routing/model/settings live outside the main typing lane.
8. Model/provider controls remain dynamic through global AIL config. No hardcoded model IDs.
9. Juli3ta is not modified; it is only a UX reference for clean local/remote/model mapping.

## Work items

### A. Transcript follow mode

- Add a scroll container ref for the chat transcript.
- Track `isAtBottom` / `stickToLatest` from scroll position.
- On user message, assistant stream delta, assistant completion, retry, regenerate, and stop state changes:
  - auto-scroll if `stickToLatest === true`
  - do not force-scroll if user scrolled up to inspect old content
- Show a compact `Jump to latest` button when new content arrives while not at bottom.
- Keep composer anchored and visible.

### B. Visible streaming

- Ensure stream events mutate the active assistant message incrementally.
- Render partial content immediately, with a subtle streaming cursor or status.
- If the host sends chunk snapshots instead of token deltas, handle both append-style and replacement-style payloads.
- Stop button must stop the active stream and preserve the partial answer.
- Retry/regenerate must start a fresh visibly streaming message.

### C. Real edit semantics

For prompts like “change author to X”, “edit this file”, “replace Y with Z”, “update the open file”:

- Detect edit intent from the user request and active/attached file context.
- Ask the AI for a patch or replacement, using existing model alias/routing config.
- Open preview/apply UI automatically when a patch/replacement is available.
- After apply, update Monaco state and mark the file dirty/unsaved.
- Show a clear post-apply state: `Applied to editor — save file to persist`.
- If the AI responds with prose only, offer `Generate patch from this request` instead of pretending the file changed.

### D. Dynamic context chip controls

- Back chips with `ChatContextStore`, not static display markup.
- Represent active selection, active file, open editors, selected files, memory hits, and future index hits as chips.
- Every manually attached chip gets an `x` remove action.
- Active-file auto-context can be toggled off for the current message.
- Add a context scope selector:
  - `No context`
  - `Active file`
  - `Open editors`
  - `Indexed project` once indexing exists
- Show exact context count, paths, ranges, dirty/stale state, and estimated chars/tokens in a popover; no hidden sticky attachments.
- Click a file/range chip to reveal the referenced editor/range in Monaco.

### E. Composer cleanup

- Remove `Auto` and `Plan` from the main typing lane.
- Keep routing/model information as a small status pill above or below the transcript, e.g. `Local AIL · alias: auto`.
- Move planning/mode controls into a deliberate quick-actions menu if they remain useful.
- Primary composer controls should be only:
  - attach/context
  - message field
  - send/stop
- Preserve keyboard UX: Enter sends, Shift+Enter newline, Escape stops/cancels where safe.

### F. Settings/model UX

- Add/keep Atomek settings for:
  - gateway preference: `auto | remote AIL | local AIL`
  - chat model alias
  - embedding model alias when embeddings land
  - model discovery from `host.ai.listModels()`
- Match the clarity of Juli3ta’s settings pattern without copying code or editing Juli3ta.
- Model lists are runtime data, not source constants. Apps should pick aliases; AIL owns actual model mappings.

## Acceptance checks

- New user message at bottom scrolls transcript to the latest response.
- Streaming answer visibly grows in the UI before completion.
- Scrolling up disables auto-follow and shows `Jump to latest` when new content arrives.
- Clicking `Jump to latest` restores follow mode.
- Attached file chips can be removed before sending.
- Active-file context can be disabled for a message.
- “Change author to Sebastian Tytus Segiundo” against an open file produces preview/apply and changes Monaco buffer after apply.
- After apply, the file is dirty/unsaved until saved.
- `Auto` / `Plan` no longer pollute the primary input field.
- No model ID or provider tool is hardcoded in the implementation.
