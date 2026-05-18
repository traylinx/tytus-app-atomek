import { useCallback, useEffect, useRef, useState } from 'react';
import type { AgentChatEvent, AiArtifact, AiContextPart, AiMemoryHit, AiMessage, AiStatus, AiThread, HostClient } from '@tytus/host-api';
import type { ChatAiSettings, ChatMessage, ChatTarget, OutputArtifact } from '../types';
import { ATOMEK_CHAT_TARGET, friendlyAgentError, sanitizeVisibleAgentText } from './chatTargets';

type ConversationOpts = {
  host: HostClient;
  requestContext: readonly AiContextPart[];
  chatSettings: ChatAiSettings;
  selectedTarget?: ChatTarget;
  setStatus: (status: string) => void;
};

type AskAgentOptions = {
  requestContext?: readonly AiContextPart[];
};

type AgentChatDaemon = {
  chatAgent: (request: {
    podId: string;
    message: string;
    routeId?: string | null;
    sessionId?: string | null;
    mode?: 'operator';
    target?: 'agent';
    modelPreference?: 'balanced';
    signal?: AbortSignal;
  }) => AsyncIterable<AgentChatEvent>;
};

const WORKSPACE_KEY = 'atomek:default';
const MAX_MEMORY_CHARS = 3_000;
const THREAD_TITLE_OVERRIDES_KEY = 'tytus.atomek.threadTitleOverrides';
const SELECTED_THREAD_KEY = 'tytus.atomek.selectedThreadId';

const fallbackStatus: AiStatus = {
  available: false,
  source: 'none',
  label: 'Tytus AI unavailable',
  reason: 'host.ai is not available in this Tytus build.',
};

const toChatMessage = (msg: AiMessage): ChatMessage | null => {
  if (msg.role !== 'user' && msg.role !== 'assistant') return null;
  return {
    id: msg.id,
    role: msg.role,
    body: msg.body,
    status: msg.status,
    gatewayLabel: msg.gatewayLabel ?? undefined,
    sourceLabel: msg.role === 'assistant' ? 'Atomek' : undefined,
    error: msg.error ?? undefined,
    createdAt: msg.createdAt,
  };
};

const clip = (text: string, max = MAX_MEMORY_CHARS): string => {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}\n\n[...clipped ${text.length - max} chars...]`;
};

const titleFromBody = (body: string, fallback: string): string => {
  const first = body.split('\n').map((line) => line.replace(/^#+\s*/, '').trim()).find(Boolean);
  if (!first) return fallback;
  return first.length > 80 ? `${first.slice(0, 77)}...` : first;
};

const normalizeArtifactKind = (kind: string): OutputArtifact['kind'] => {
  const allowed: OutputArtifact['kind'][] = ['briefing', 'action-list', 'quiz', 'plan', 'storyboard', 'report', 'local-draft', 'markdown', 'memory'];
  return allowed.includes(kind as OutputArtifact['kind']) ? kind as OutputArtifact['kind'] : 'report';
};

const toOutputArtifact = (artifact: AiArtifact): OutputArtifact => ({
  id: artifact.id,
  title: artifact.title,
  kind: normalizeArtifactKind(artifact.kind),
  body: artifact.body,
  createdAt: artifact.createdAt,
  source: 'ai',
});

const memoryContextPart = (hits: AiMemoryHit[]): AiContextPart | null => {
  if (hits.length === 0) return null;
  return {
    kind: 'workspace',
    title: 'Relevant Atomek memory',
    text: hits.map((hit, index) => [
      `Memory ${index + 1}: ${hit.title}`,
      clip(hit.body, 900),
    ].join('\n')).join('\n\n---\n\n'),
  };
};

const readThreadTitleOverrides = (): Record<string, string> => {
  try {
    const raw = localStorage.getItem(THREAD_TITLE_OVERRIDES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return {};
    return Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>)
        .filter(([, value]) => typeof value === 'string' && value.trim())
        .map(([key, value]) => [key, String(value)]),
    );
  } catch {
    return {};
  }
};

const writeThreadTitleOverride = (threadId: string, title: string): void => {
  try {
    const overrides = readThreadTitleOverrides();
    overrides[threadId] = title;
    localStorage.setItem(THREAD_TITLE_OVERRIDES_KEY, JSON.stringify(overrides));
  } catch {
    // Local-only compatibility fallback; ignore storage failures.
  }
};

const deleteThreadTitleOverride = (threadId: string): void => {
  try {
    const overrides = readThreadTitleOverrides();
    delete overrides[threadId];
    localStorage.setItem(THREAD_TITLE_OVERRIDES_KEY, JSON.stringify(overrides));
  } catch {
    // Local-only compatibility fallback; ignore storage failures.
  }
};

const applyThreadTitleOverrides = (items: AiThread[]): AiThread[] => {
  const overrides = readThreadTitleOverrides();
  return items.map((item) => overrides[item.id] ? { ...item, title: overrides[item.id] } : item);
};

const readSelectedThreadId = (): string | null => {
  try {
    const value = localStorage.getItem(SELECTED_THREAD_KEY);
    return value?.trim() || null;
  } catch {
    return null;
  }
};

const writeSelectedThreadId = (threadId: string): void => {
  try {
    localStorage.setItem(SELECTED_THREAD_KEY, threadId);
  } catch {
    // Local-only compatibility fallback; ignore storage failures.
  }
};


const agentSessionKey = (podId: string): string => `${WORKSPACE_KEY}:agent-session:${podId}`;
const agentTranscriptKey = (podId: string): string => `${WORKSPACE_KEY}:agent-transcript:${podId}`;
const MAX_AGENT_TRANSCRIPT_MESSAGES = 100;

const readAgentSessionId = (targetId: string, legacyPodId?: string | null): string | null => {
  try {
    const current = localStorage.getItem(agentSessionKey(targetId))?.trim();
    if (current) return current;
    if (legacyPodId && legacyPodId !== targetId) {
      return localStorage.getItem(agentSessionKey(legacyPodId))?.trim() || null;
    }
    return null;
  } catch {
    return null;
  }
};

const writeAgentSessionId = (podId: string, sessionId: string): void => {
  try {
    localStorage.setItem(agentSessionKey(podId), sessionId);
  } catch {
    // Local-only compatibility fallback; ignore storage failures.
  }
};

const persistAgentTranscript = (podId: string, messages: ChatMessage[]): void => {
  try {
    const raw = localStorage.getItem(agentTranscriptKey(podId));
    const existing = raw ? JSON.parse(raw) as ChatMessage[] : [];
    const byId = new Map<string, ChatMessage>();
    for (const message of [...existing, ...messages]) byId.set(message.id, message);
    localStorage.setItem(agentTranscriptKey(podId), JSON.stringify([...byId.values()].slice(-MAX_AGENT_TRANSCRIPT_MESSAGES)));
  } catch {
    // Transcript persistence is best-effort; live chat remains usable.
  }
};

const parseAgentTranscript = (raw: string | null): ChatMessage[] => {
  if (!raw) return [];
  const parsed = JSON.parse(raw) as unknown;
  if (!Array.isArray(parsed)) return [];
  return parsed
    .filter((item): item is ChatMessage =>
      item &&
      typeof item === 'object' &&
      (item as ChatMessage).role !== undefined &&
      typeof (item as ChatMessage).body === 'string',
    )
    .slice(-MAX_AGENT_TRANSCRIPT_MESSAGES);
};

const readAgentTranscript = (targetId: string, legacyPodId?: string | null): ChatMessage[] => {
  try {
    const current = parseAgentTranscript(localStorage.getItem(agentTranscriptKey(targetId)));
    if (current.length > 0 || !legacyPodId || legacyPodId === targetId) return current;
    return parseAgentTranscript(localStorage.getItem(agentTranscriptKey(legacyPodId)));
  } catch {
    return [];
  }
};

const clearAgentTranscript = (targetId: string, legacyPodId?: string | null): void => {
  try {
    localStorage.removeItem(agentTranscriptKey(targetId));
    localStorage.removeItem(agentSessionKey(targetId));
    if (legacyPodId && legacyPodId !== targetId) {
      localStorage.removeItem(agentTranscriptKey(legacyPodId));
      localStorage.removeItem(agentSessionKey(legacyPodId));
    }
  } catch {
    // Local-only compatibility fallback; ignore storage failures.
  }
};

const getChatAgentDaemon = (host: HostClient): AgentChatDaemon | null => {
  const daemon = host.daemon as typeof host.daemon & Partial<AgentChatDaemon>;
  return typeof daemon.chatAgent === 'function' ? daemon as AgentChatDaemon : null;
};

const contextPrompt = (parts: readonly AiContextPart[]): string => {
  const body = parts
    .map((part) => [`## ${part.title}`, part.text].filter(Boolean).join('\n'))
    .join('\n\n---\n\n')
    .trim();
  if (!body) return '';
  return [
    'Atomek workspace context follows. Use it only if relevant. Do not expose internal routing, providers, model names, private network addresses, or pod identifiers.',
    '',
    body,
  ].join('\n');
};

const agentPrompt = (body: string, parts: readonly AiContextPart[]): string => {
  const context = contextPrompt(parts);
  if (!context) return body;
  return [context, '', 'User message:', body].join('\n');
};

export function useConversation({ host, requestContext, chatSettings, selectedTarget = ATOMEK_CHAT_TARGET, setStatus }: ConversationOpts) {
  const ai = host.ai;
  const [thread, setThread] = useState<AiThread | null>(null);
  const [threads, setThreads] = useState<AiThread[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [artifacts, setArtifacts] = useState<OutputArtifact[]>([]);
  const [memoryHits, setMemoryHits] = useState<AiMemoryHit[]>([]);
  const [aiStatus, setAiStatus] = useState<AiStatus>(fallbackStatus);
  const [busy, setBusy] = useState(false);
  const mounted = useRef(true);
  const abortRef = useRef<AbortController | null>(null);

  const refreshStatus = useCallback(async () => {
    if (!ai) {
      setAiStatus(fallbackStatus);
      return;
    }
    try {
      setAiStatus(await ai.status());
    } catch (err) {
      setAiStatus({
        available: false,
        source: 'none',
        label: 'Tytus AI unavailable',
        reason: err instanceof Error ? err.message : String(err),
      });
    }
  }, [ai]);

  const loadArtifacts = useCallback(async (threadId: string) => {
    if (!ai) return;
    try {
      const loaded = await ai.listArtifacts({ threadId });
      if (!mounted.current) return;
      setArtifacts(loaded.map(toOutputArtifact));
    } catch (err) {
      setStatus(`AI artifacts unavailable: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [ai, setStatus]);

  const selectThread = useCallback(async (threadId: string) => {
    if (!ai) return;
    try {
      const loaded = await ai.listMessages(threadId);
      if (!mounted.current) return;
      const found = threads.find((item) => item.id === threadId) ?? null;
      if (found) setThread(found);
      writeSelectedThreadId(threadId);
      setMessages(loaded.map(toChatMessage).filter(Boolean) as ChatMessage[]);
      setMemoryHits([]);
      await loadArtifacts(threadId);
    } catch (err) {
      setStatus(`Load chat failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [ai, loadArtifacts, setStatus, threads]);

  const loadThread = useCallback(async () => {
    if (!ai) return;
    try {
      const existing = applyThreadTitleOverrides(await ai.listThreads({ workspaceKey: WORKSPACE_KEY, status: 'active' }));
      const rememberedThreadId = readSelectedThreadId();
      const selected = existing.find((item) => item.id === rememberedThreadId) ?? existing[0] ?? await ai.createThread({ workspaceKey: WORKSPACE_KEY, title: 'Atomek chat' });
      if (!mounted.current) return;
      setThreads(existing[0] ? existing : [selected]);
      setThread(selected);
      writeSelectedThreadId(selected.id);
      const loaded = await ai.listMessages(selected.id);
      if (!mounted.current) return;
      setMessages(loaded.map(toChatMessage).filter(Boolean) as ChatMessage[]);
      await loadArtifacts(selected.id);
    } catch (err) {
      setStatus(`AI chat unavailable: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [ai, loadArtifacts, setStatus]);

  useEffect(() => {
    mounted.current = true;
    void refreshStatus();
    void loadThread();
    return () => {
      mounted.current = false;
    };
  }, [loadThread, refreshStatus]);

  const selectedPodId = selectedTarget.kind === 'pod-agent' ? selectedTarget.podId : null;

  useEffect(() => {
    if (selectedTarget.kind === 'pod-agent') {
      setMessages(readAgentTranscript(selectedTarget.id, selectedTarget.podId));
      setMemoryHits([]);
      return;
    }
    if (!ai || !thread) return;
    let cancelled = false;
    void (async () => {
      try {
        const loaded = await ai.listMessages(thread.id);
        if (!cancelled && mounted.current) {
          setMessages(loaded.map(toChatMessage).filter(Boolean) as ChatMessage[]);
        }
      } catch {
        // Thread load errors are handled by the regular thread loading paths.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ai, selectedTarget, selectedPodId, thread]);

  const ensureThread = useCallback(async () => {
    if (!ai) return null;
    if (thread) return thread;
    const created = await ai.createThread({ workspaceKey: WORKSPACE_KEY, title: 'Atomek chat' });
    if (mounted.current) {
      setThread(created);
      writeSelectedThreadId(created.id);
      setThreads((current) => [created, ...current.filter((item) => item.id !== created.id)]);
    }
    return created;
  }, [ai, thread]);

  const newChat = useCallback(async () => {
    if (selectedTarget.kind === 'pod-agent') {
      clearAgentTranscript(selectedTarget.id, selectedTarget.podId);
      setMessages([]);
      setMemoryHits([]);
      setStatus(`Cleared ${selectedTarget.label} chat`);
      return;
    }
    if (!ai) return;
    const created = await ai.createThread({ workspaceKey: WORKSPACE_KEY, title: 'Atomek chat' });
    setThread(created);
    writeSelectedThreadId(created.id);
    setThreads((current) => [created, ...current.filter((item) => item.id !== created.id)]);
    setMessages([]);
    setArtifacts([]);
    setMemoryHits([]);
    setStatus('New AI chat created');
  }, [ai, selectedTarget, setStatus]);

  const renameThread = useCallback(async (threadId: string, title: string) => {
    if (!ai) return;
    const nextTitle = title.trim();
    if (!nextTitle) return;
    try {
      const updateThread = (ai as typeof ai & { updateThread?: (input: { threadId: string; title?: string }) => Promise<AiThread> }).updateThread;
      const existing = threads.find((item) => item.id === threadId) ?? thread;
      const updated = typeof updateThread === 'function'
        ? await updateThread({ threadId, title: nextTitle })
        : { ...(existing ?? await ensureThread()), id: threadId, title: nextTitle, updatedAt: Date.now() } as AiThread;
      if (typeof updateThread !== 'function') writeThreadTitleOverride(threadId, nextTitle);
      setThreads((current) => current.map((item) => item.id === updated.id ? updated : item));
      setThread((current) => current?.id === updated.id ? updated : current);
      setStatus(typeof updateThread === 'function'
        ? `Renamed chat: ${updated.title}`
        : `Renamed chat locally: ${updated.title}`);
    } catch (err) {
      setStatus(`Rename chat failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [ai, ensureThread, setStatus, thread, threads]);

  const deleteThread = useCallback(async (threadId: string) => {
    if (!ai) return;
    try {
      await ai.deleteThread(threadId);
      deleteThreadTitleOverride(threadId);
      const remaining = threads.filter((item) => item.id !== threadId);
      setThreads(remaining);
      if (thread?.id === threadId) {
        const next = remaining[0] ?? await ai.createThread({ workspaceKey: WORKSPACE_KEY, title: 'Atomek chat' });
        setThread(next);
        writeSelectedThreadId(next.id);
        setThreads((current) => current.some((item) => item.id === next.id) ? current : [next, ...current]);
        const loaded = await ai.listMessages(next.id);
        setMessages(loaded.map(toChatMessage).filter(Boolean) as ChatMessage[]);
        await loadArtifacts(next.id);
      }
      setStatus('Deleted AI chat');
    } catch (err) {
      setStatus(`Delete chat failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [ai, loadArtifacts, setStatus, thread?.id, threads]);

  const createArtifact = useCallback(async (input: { title?: string; kind?: OutputArtifact['kind']; body: string; messageId?: string | null }) => {
    if (!ai) return null;
    try {
      const activeThread = await ensureThread();
      if (!activeThread) return null;
      writeSelectedThreadId(activeThread.id);
      const artifact = await ai.createArtifact({
        threadId: activeThread.id,
        messageId: input.messageId ?? null,
        title: input.title?.trim() || titleFromBody(input.body, 'Atomek artifact'),
        kind: input.kind ?? 'markdown',
        body: input.body,
      });
      const output = toOutputArtifact(artifact);
      setArtifacts((current) => [output, ...current.filter((item) => item.id !== output.id)]);
      setStatus(`Saved AI artifact: ${output.title}`);
      return output;
    } catch (err) {
      setStatus(`Save artifact failed: ${err instanceof Error ? err.message : String(err)}`);
      return null;
    }
  }, [ai, ensureThread, setStatus]);

  const deleteArtifact = useCallback(async (artifactId: string) => {
    if (!ai) return;
    try {
      await ai.deleteArtifact(artifactId);
      setArtifacts((current) => current.filter((artifact) => artifact.id !== artifactId));
      setStatus('Deleted AI artifact');
    } catch (err) {
      setStatus(`Delete artifact failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [ai, setStatus]);

  const remember = useCallback(async (input: { title?: string; body: string; messageId?: string }) => {
    if (!ai) return null;
    try {
      const memory = await ai.writeMemory({
        title: input.title?.trim() || titleFromBody(input.body, 'Atomek memory'),
        body: input.body,
        metadata: {
          source: 'atomek',
          messageId: input.messageId ?? null,
        },
      });
      setMemoryHits((current) => [memory, ...current.filter((hit) => hit.id !== memory.id)].slice(0, 5));
      setStatus(`Remembered: ${memory.title}`);
      return memory;
    } catch (err) {
      setStatus(`Remember failed: ${err instanceof Error ? err.message : String(err)}`);
      return null;
    }
  }, [ai, setStatus]);

  const recall = useCallback(async (query: string) => {
    if (!ai) return [] as AiMemoryHit[];
    const hits = await ai.searchMemory({ query, limit: 5 });
    if (mounted.current) setMemoryHits(hits);
    return hits;
  }, [ai]);

  const askAgent = useCallback(async (prompt: string, options: AskAgentOptions = {}): Promise<ChatMessage | null> => {
    const body = prompt.trim();
    if (!body) return null;
    const target = selectedTarget;
    if (target.kind === 'atomek-ai' && !ai) return null;
    setBusy(true);
    let finalAssistant: ChatMessage | null = null;
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const baseContext = options.requestContext ?? requestContext;
      if (target.kind === 'pod-agent') {
        const daemon = getChatAgentDaemon(host);
        const createdAt = Date.now();
        const userMessage: ChatMessage = {
          id: `agent-user-${createdAt}`,
          role: 'user',
          body,
          status: 'complete',
          createdAt,
        };
        const assistantId = `agent-assistant-${createdAt}`;
        const assistantBase: ChatMessage = {
          id: assistantId,
          role: 'assistant',
          body: '',
          status: 'streaming',
          gatewayLabel: 'Tytus pod agent',
          sourceLabel: target.label,
          createdAt: createdAt + 1,
        };
        setMessages((current) => [...current, userMessage, assistantBase]);
        persistAgentTranscript(target.id, [userMessage, assistantBase]);
        if (!target.available) {
          const safe = friendlyAgentError(target.description);
          const failed = { ...assistantBase, body: safe.message, status: 'error' as const, error: safe.message };
          setMessages((current) => current.map((message) => message.id === assistantId ? failed : message));
          persistAgentTranscript(target.id, [failed]);
          setStatus(safe.message);
          return failed;
        }
        if (!daemon) {
          const message = 'Agent chat bridge unavailable in this Tytus host build. Update TytusOS host API/runtime to enable OpenClaw and Hermes chat.';
          const failed = { ...assistantBase, body: message, status: 'error' as const, error: message };
          setMessages((current) => current.map((item) => item.id === assistantId ? failed : item));
          persistAgentTranscript(target.id, [failed]);
          setStatus('Agent chat bridge unavailable');
          return failed;
        }
        let bodySoFar = '';
        const finishAgentMessage = (message: ChatMessage, status: string): ChatMessage => {
          setMessages((current) => current.map((item) => item.id === assistantId ? message : item));
          persistAgentTranscript(target.id, [userMessage, message]);
          setStatus(status);
          return message;
        };
        try {
          for await (const event of daemon.chatAgent({
            podId: target.podId,
            routeId: target.routeId ?? null,
            sessionId: readAgentSessionId(target.id, target.podId),
            message: agentPrompt(body, baseContext),
            mode: 'operator',
            target: 'agent',
            modelPreference: 'balanced',
            signal: controller.signal,
          })) {
            if (event.type === 'session') {
              writeAgentSessionId(target.id, event.sessionId);
            }
            if (event.type === 'token') {
              bodySoFar = sanitizeVisibleAgentText(`${bodySoFar}${event.text}`);
              setMessages((current) => current.map((message) => (message.id === assistantId ? { ...message, body: bodySoFar, status: 'streaming' } : message)));
            }
            if (event.type === 'error') {
              const safe = friendlyAgentError(event.message);
              const failed = { ...assistantBase, body: safe.message, status: 'error' as const, error: safe.message };
              return finishAgentMessage(failed, safe.message);
            }
            if (event.type === 'done') {
              finalAssistant = { ...assistantBase, body: bodySoFar || 'Agent finished without visible output.', status: 'complete' };
              return finishAgentMessage(finalAssistant, `${target.label} answered`);
            }
          }
        } catch (err) {
          if (controller.signal.aborted || (err instanceof DOMException && err.name === 'AbortError')) {
            finalAssistant = { ...assistantBase, body: bodySoFar || 'Stopped by user.', status: 'complete' };
            return finishAgentMessage(finalAssistant, `${target.label} response stopped`);
          }
          throw err;
        }
        if (controller.signal.aborted) {
          finalAssistant = { ...assistantBase, body: bodySoFar || 'Stopped by user.', status: 'complete' };
          return finishAgentMessage(finalAssistant, `${target.label} response stopped`);
        }
        if (!finalAssistant) {
          finalAssistant = { ...assistantBase, body: bodySoFar || 'Agent finished without visible output.', status: 'complete' };
          return finishAgentMessage(finalAssistant, `${target.label} answered`);
        }
        return finalAssistant;
      }

      const activeThread = await ensureThread();
      if (!activeThread || !ai) return null;
      writeSelectedThreadId(activeThread.id);
      const hits = await recall(body).catch(() => [] as AiMemoryHit[]);
      const memoryPart = memoryContextPart(hits);
      const contextParts = memoryPart ? [...baseContext, memoryPart] : [...baseContext];
      let assistantId: string | null = null;
      for await (const event of ai.sendMessage({
        threadId: activeThread.id,
        body,
        gatewayPreference: chatSettings.gatewayPreference,
        model: chatSettings.model.trim() || undefined,
        context: contextParts,
        signal: controller.signal,
      })) {
        if (event.type === 'message_created') {
          const chat = toChatMessage(event.message);
          if (!chat) continue;
          if (chat.role === 'assistant') assistantId = chat.id;
          setMessages((current) => [...current.filter((m) => m.id !== chat.id), chat]);
        }
        if (event.type === 'token') {
          assistantId = event.messageId;
          setMessages((current) => {
            if (current.some((m) => m.id === event.messageId)) {
              return current.map((m) =>
                m.id === event.messageId ? { ...m, body: event.body, status: 'streaming', sourceLabel: 'Atomek' } : m,
              );
            }
            return [...current, {
              id: event.messageId,
              role: 'assistant',
              body: event.body,
              status: 'streaming',
              sourceLabel: 'Atomek',
              createdAt: Date.now(),
            }];
          });
        }
        if (event.type === 'message_updated' || event.type === 'done') {
          const chat = toChatMessage(event.message);
          if (!chat) continue;
          if (chat.role === 'assistant') finalAssistant = chat;
          setMessages((current) => current.map((m) => (m.id === chat.id ? chat : m)));
          if (chat.gatewayLabel) setStatus(`AI answered via ${chat.gatewayLabel}`);
        }
        if (event.type === 'run_failed') {
          const stopped = controller.signal.aborted;
          setStatus(stopped ? 'AI response stopped' : `AI failed: ${event.error}`);
          if (assistantId) {
            setMessages((current) => current.map((m) => {
              if (m.id !== assistantId) return m;
              return stopped
                ? { ...m, status: 'complete', error: undefined, body: m.body || 'Stopped by user.' }
                : { ...m, status: 'error', error: event.error, body: event.error };
            }));
          }
        }
      }
      const refreshedThreads = applyThreadTitleOverrides(await ai.listThreads({ workspaceKey: WORKSPACE_KEY, status: 'active' }).catch(() => [] as AiThread[]));
      if (mounted.current && refreshedThreads.length > 0) setThreads(refreshedThreads);
      void refreshStatus();
      return finalAssistant;
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setStatus('AI response stopped');
        return finalAssistant;
      }
      setStatus(`AI failed: ${err instanceof Error ? err.message : String(err)}`);
      return null;
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      setBusy(false);
    }
  }, [ai, chatSettings.gatewayPreference, chatSettings.model, ensureThread, host, recall, refreshStatus, requestContext, selectedTarget, setStatus]);

  const stopChat = useCallback(() => {
    abortRef.current?.abort();
    setStatus('Stopping AI response…');
  }, [setStatus]);

  return {
    aiStatus,
    artifacts,
    busy,
    memoryHits,
    messages,
    thread,
    threads,
    askAgent,
    createArtifact,
    deleteArtifact,
    deleteThread,
    newChat,
    recall,
    remember,
    renameThread,
    selectThread,
    stopChat,
  };
}
