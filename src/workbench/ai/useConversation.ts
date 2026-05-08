import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { AiArtifact, AiContextPart, AiMemoryHit, AiMessage, AiStatus, AiThread, HostClient } from '@tytus/host-api';
import type { ChatAiSettings, ChatMessage, OutputArtifact, WorkbenchFile } from '../types';
import { buildAiContext } from './contextBuilder';

type ConversationOpts = {
  host: HostClient;
  activeFile: WorkbenchFile | null;
  openEditors: readonly WorkbenchFile[];
  chatSettings: ChatAiSettings;
  setStatus: (status: string) => void;
};

const WORKSPACE_KEY = 'atomek:default';
const MAX_MEMORY_CHARS = 3_000;

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

export function useConversation({ host, activeFile, openEditors, chatSettings, setStatus }: ConversationOpts) {
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

  const context = useMemo(() => buildAiContext(activeFile, openEditors), [activeFile, openEditors]);

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
      const existing = await ai.listThreads({ workspaceKey: WORKSPACE_KEY, status: 'active' });
      const selected = existing[0] ?? await ai.createThread({ workspaceKey: WORKSPACE_KEY, title: 'Atomek chat' });
      if (!mounted.current) return;
      setThreads(existing[0] ? existing : [selected]);
      setThread(selected);
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

  const ensureThread = useCallback(async () => {
    if (!ai) return null;
    if (thread) return thread;
    const created = await ai.createThread({ workspaceKey: WORKSPACE_KEY, title: 'Atomek chat' });
    if (mounted.current) {
      setThread(created);
      setThreads((current) => [created, ...current.filter((item) => item.id !== created.id)]);
    }
    return created;
  }, [ai, thread]);

  const newChat = useCallback(async () => {
    if (!ai) return;
    const created = await ai.createThread({ workspaceKey: WORKSPACE_KEY, title: 'Atomek chat' });
    setThread(created);
    setThreads((current) => [created, ...current.filter((item) => item.id !== created.id)]);
    setMessages([]);
    setArtifacts([]);
    setMemoryHits([]);
    setStatus('New AI chat created');
  }, [ai, setStatus]);

  const renameThread = useCallback(async (threadId: string, title: string) => {
    if (!ai) return;
    const nextTitle = title.trim();
    if (!nextTitle) return;
    try {
      const updated = await ai.updateThread({ threadId, title: nextTitle });
      setThreads((current) => current.map((item) => item.id === updated.id ? updated : item));
      setThread((current) => current?.id === updated.id ? updated : current);
      setStatus(`Renamed chat: ${updated.title}`);
    } catch (err) {
      setStatus(`Rename chat failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [ai, setStatus]);

  const deleteThread = useCallback(async (threadId: string) => {
    if (!ai) return;
    try {
      await ai.deleteThread(threadId);
      const remaining = threads.filter((item) => item.id !== threadId);
      setThreads(remaining);
      if (thread?.id === threadId) {
        const next = remaining[0] ?? await ai.createThread({ workspaceKey: WORKSPACE_KEY, title: 'Atomek chat' });
        setThread(next);
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

  const askAgent = useCallback(async (prompt: string): Promise<ChatMessage | null> => {
    const body = prompt.trim();
    if (!body || !ai) return null;
    setBusy(true);
    let finalAssistant: ChatMessage | null = null;
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const activeThread = await ensureThread();
      if (!activeThread) return null;
      const hits = await recall(body).catch(() => [] as AiMemoryHit[]);
      const memoryPart = memoryContextPart(hits);
      const requestContext = memoryPart ? [...context, memoryPart] : context;
      let assistantId: string | null = null;
      for await (const event of ai.sendMessage({
        threadId: activeThread.id,
        body,
        gatewayPreference: chatSettings.gatewayPreference,
        model: chatSettings.model.trim() || undefined,
        context: requestContext,
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
          setMessages((current) => current.map((m) =>
            m.id === event.messageId ? { ...m, body: event.body, status: 'streaming' } : m,
          ));
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
            setMessages((current) => current.map((m) =>
              m.id === assistantId ? { ...m, status: 'error', error: event.error, body: stopped ? 'Stopped by user.' : event.error } : m,
            ));
          }
        }
      }
      const refreshedThreads = await ai.listThreads({ workspaceKey: WORKSPACE_KEY, status: 'active' }).catch(() => [] as AiThread[]);
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
  }, [ai, chatSettings.gatewayPreference, chatSettings.model, context, ensureThread, recall, refreshStatus, setStatus]);

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
