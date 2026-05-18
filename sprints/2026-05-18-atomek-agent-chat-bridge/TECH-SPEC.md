# Tech Spec: Atomek Agent Chat Bridge

## Product behavior

Atomek chat has one composer and one target selector.

Targets:

1. `Atomek` - existing workspace assistant using `host.ai`.
2. `OpenClaw` - one target per running OpenClaw pod.
3. `Hermes` - one target per running Hermes pod.

When the user selects an agent target and sends a message:

- Atomek sends the message through `host.daemon.chatAgent()`.
- The response streams back into the same chat pane.
- Assistant messages visibly identify the selected agent, for example `OpenClaw` or `Hermes`.
- No infrastructure identifiers appear in user-visible chat labels or message body.
- If the agent is warming up, the selector shows that state and the send action returns a friendly retryable message.

## Architecture

```text
Atomek ChatPane
  uses useConversation(target)
    if target.kind == "atomek-ai"
      -> host.ai.sendMessage()
    if target.kind == "pod-agent"
      -> host.daemon.chatAgent()
        -> TytusOS runtime agent chat bridge
          -> /api/pods/:podId/cortex/chat
          -> fallback /api/pods/:podId/agent/chat
```

## Host API additions

File:

- `/Users/sebastian/Projects/makakoo/api/ProjectWannolot/services/tytus-os/packages/host-api/src/client.ts`

Add exported types:

```ts
export type AgentChatTarget = 'agent';
export type AgentChatMode = 'operator';
export type AgentChatPreference = 'fast' | 'balanced' | 'deep';

export interface AgentChatRequest {
  podId: string;
  message: string;
  routeId?: string | null;
  sessionId?: string | null;
  mode?: AgentChatMode;
  target?: AgentChatTarget;
  modelPreference?: AgentChatPreference;
  signal?: AbortSignal;
}

export type AgentChatEvent =
  | { type: 'session'; sessionId: string }
  | { type: 'token'; text: string }
  | { type: 'done' }
  | { type: 'error'; message: string; retryable?: boolean };
```

Extend `DaemonApi`:

```ts
chatAgent(request: AgentChatRequest): AsyncIterable<AgentChatEvent>;
```

Rules:

- `podId` is the stable internal id used by tray/provider routing.
- `routeId` is optional and only sent if already known by the selected resource. It must never be shown in UI.
- `mode` defaults to `operator`.
- `target` defaults to `agent`.
- `modelPreference` defaults to `balanced`.
- Runtime fills `app_id` from the host app id (`atomek`) when possible. Apps should not be able to forge another app id.

## TytusOS runtime implementation

Files:

- `services/tytus-os/app/src/runtime/host-impl.ts`
- new `services/tytus-os/app/src/runtime/agent-chat.ts`
- optional shared helper `services/tytus-os/app/src/lib/agent-chat.ts`

Implementation responsibilities:

1. Build same-origin tray requests:
   - Primary: `POST /api/pods/${podId}/cortex/chat`
   - Fallback: `POST /api/pods/${podId}/agent/chat`
2. Send payload:
   ```json
   {
     "route_id": "optional internal route id",
     "message": "user text",
     "agent_mode": "operator",
     "chat_target": "agent",
     "app_id": "atomek",
     "model_preference": "balanced",
     "stream": true
   }
   ```
3. Parse streaming event-stream responses.
4. Normalize upstream event shapes into `AgentChatEvent`.
5. Sanitize visible text before yielding tokens.
6. Convert upstream warmup/not-ready/timeout states into friendly retryable errors.
7. Keep Authorization stripped from app-supplied headers. Apps never provide headers for `chatAgent`.

Fallback policy:

- Use direct `/agent/chat` fallback when Cortex route returns 404, 502, 503, or 504.
- Do not fallback on 401/403.
- Do not fallback on 400 validation errors.
- If both fail, emit an `error` event with a user-safe message.

Timeout policy:

- Runtime should not use the old 30s page request timeout for long agent responses.
- Use streaming fetch with abort support from caller.
- UI can show `working` state and allow cancel.

## Shared sanitizer

Central redaction helper must catch at least:

- private network URLs: `http://10.x.x.x`, `172.16-31.x.x`, `192.168.x.x`
- public pod subdomains/tokens where possible
- provider names: Minimax, MiniMax, Moonshot, Kimi, DeepSeek, Qwen, Alibaba, Xiaomi, Nous, OpenRouter, etc.
- model ids: `MiniMax-M*`, `ail-compound` if used as model id in raw response, provider-specific ids
- droplet/provider labels: Strato, Scalesys, Wannolot droplet ids, `strato-eu-*`

Replacement examples:

- `private gateway`
- `current model`
- `your Tytus pod`
- `agent runtime`

## Atomek target model

New files recommended:

- `src/workbench/ai/chatTargets.ts`
- `src/workbench/ai/useAgentConversation.ts` or extension inside `useConversation.ts`

Types:

```ts
type ChatTargetKind = 'atomek-ai' | 'pod-agent';

type ChatTarget =
  | {
      kind: 'atomek-ai';
      id: 'atomek';
      label: 'Atomek';
      description: 'Workspace assistant';
      available: true;
    }
  | {
      kind: 'pod-agent';
      id: string;
      podId: string;
      routeId?: string | null;
      agentFamily: 'openclaw' | 'hermes';
      label: string;
      description: string;
      status: 'running' | 'warming' | 'stopped' | 'unknown';
      available: boolean;
    };
```

Target discovery:

- Primary source: host resources if they include richer agent metadata and display names.
- Secondary source: `host.daemon.state.agents`.
- Normalize labels:
  - custom display name if present and safe
  - else `OpenClaw` / `Hermes`
  - add short disambiguator only if multiple same-family agents exist: `OpenClaw 1`, `OpenClaw 2`
- Never show raw pod id, route id, provider, droplet, IP, or model.

Session storage:

- Keep one session id per pod target:
  - `atomek:agent-session:${workspaceKey}:${podId}`
- Store last selected target:
  - `atomek:selected-chat-target:${workspaceKey}`
- Store lightweight local transcript per pod target if Atomek does not have a host-level conversation store for non-`host.ai` messages:
  - `atomek:agent-transcript:${workspaceKey}:${podId}`

Transcript storage constraints:

- Max retained messages per target: 100.
- Do not store raw tokens with infra leakage before sanitization.
- Clear transcript if pod is no longer owned/visible.

## Atomek UI changes

Files likely touched:

- `src/workbench/components/WorkbenchShell.tsx`
- existing chat pane components inside WorkbenchShell or extracted chat components
- `src/workbench/ai/useConversation.ts`
- `src/workbench/types.ts`

UI requirements:

- Target selector in chat composer/header.
- Atomek remains default.
- Agent targets show only when available from host state/resources.
- Disabled/warming targets visible with clear status, not selectable for send or selectable with friendly error.
- Message header/source label shows response source: `Atomek`, `OpenClaw`, `Hermes`, or custom safe name.
- No duplicate chat panel. Reuse existing Atomek chat surface.

## Mission runner relationship

Atomek's `runPodTask(resource)` currently uses raw `/v1/chat/completions` via `callPodEndpoint`. This sprint's core acceptance is interactive chat. Mission runner convergence is included as a hardening phase, not the first dependency.

Recommended treatment:

- Phase 1-4: leave mission runner functional.
- Phase 5: sanitize model/provider logs and optionally use `host.daemon.chatAgent()` for agent-family resources.

## Security model

- Apps can request chat only for pod ids visible in daemon state/resources.
- Runtime validates pod id through tray/provider ownership checks.
- Apps cannot pass arbitrary upstream URL.
- Apps cannot pass custom headers.
- `Authorization` remains stripped by host runtime for pod calls.
- All output shown to users passes sanitizer.
- Tests cover redaction and target label safety.

## Async semantics

This sprint delivers streaming, retryable chat. It does not deliver durable offline async delivery.

What works after sprint:

- Long responses stream into the UI.
- Page does not fail because of a fixed 30s browser timeout.
- User can retry if agent is warming.
- Session id continues conversation when Cortex returns it.

Future phase if needed:

- Durable job/message queue.
- Pollable session updates.
- Notifications when an agent answers while page is not focused.
- Telegram/Slack-style delivery semantics.
