import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { AiMessage, AiStatus, AiThread, HostClient } from '@tytus/host-api';
import type { ChatMessage, WorkbenchFile } from '../types';
import { buildAiContext } from './contextBuilder';

type ConversationOpts = {
  host: HostClient;
  activeFile: WorkbenchFile | null;
  openEditors: readonly WorkbenchFile[];
  setStatus: (status: string) => void;
};

const WORKSPACE_KEY = 'atomek:default';

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
  };
};

export function useConversation({ host, activeFile, openEditors, setStatus }: ConversationOpts) {
  const ai = host.ai;
  const [thread, setThread] = useState<AiThread | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [aiStatus, setAiStatus] = useState<AiStatus>(fallbackStatus);
  const [busy, setBusy] = useState(false);
  const mounted = useRef(true);

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

  const loadThread = useCallback(async () => {
    if (!ai) return;
    try {
      const existing = await ai.listThreads({ workspaceKey: WORKSPACE_KEY, status: 'active' });
      const selected = existing[0] ?? await ai.createThread({ workspaceKey: WORKSPACE_KEY, title: 'Atomek chat' });
      if (!mounted.current) return;
      setThread(selected);
      const loaded = await ai.listMessages(selected.id);
      if (!mounted.current) return;
      setMessages(loaded.map(toChatMessage).filter(Boolean) as ChatMessage[]);
    } catch (err) {
      setStatus(`AI chat unavailable: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [ai, setStatus]);

  useEffect(() => {
    mounted.current = true;
    void refreshStatus();
    void loadThread();
    return () => {
      mounted.current = false;
    };
  }, [loadThread, refreshStatus]);

  const newChat = useCallback(async () => {
    if (!ai) return;
    const created = await ai.createThread({ workspaceKey: WORKSPACE_KEY, title: 'Atomek chat' });
    setThread(created);
    setMessages([]);
    setStatus('New AI chat created');
  }, [ai, setStatus]);

  const askAgent = useCallback(async (prompt: string) => {
    const body = prompt.trim();
    if (!body || !ai) return;
    setBusy(true);
    try {
      const activeThread = thread ?? await ai.createThread({ workspaceKey: WORKSPACE_KEY, title: 'Atomek chat' });
      if (!thread) setThread(activeThread);
      let assistantId: string | null = null;
      for await (const event of ai.sendMessage({
        threadId: activeThread.id,
        body,
        context,
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
          setMessages((current) => current.map((m) => (m.id === chat.id ? chat : m)));
          if (chat.gatewayLabel) setStatus(`AI answered via ${chat.gatewayLabel}`);
        }
        if (event.type === 'run_failed') {
          setStatus(`AI failed: ${event.error}`);
          if (assistantId) {
            setMessages((current) => current.map((m) =>
              m.id === assistantId ? { ...m, status: 'error', error: event.error, body: event.error } : m,
            ));
          }
        }
      }
      void refreshStatus();
    } catch (err) {
      setStatus(`AI failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setBusy(false);
    }
  }, [ai, context, refreshStatus, setStatus, thread]);

  return { aiStatus, busy, messages, askAgent, newChat };
}
