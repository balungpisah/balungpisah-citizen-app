'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useChatStream } from '../hooks/use-chat-stream';
import type { IMessage, IContentBlock } from '../types';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';

interface ChatViewProps {
  /** Thread ID if loading existing conversation, undefined for new */
  threadId?: string;
  /** Whether to show the default header (default: true) */
  showHeader?: boolean;
}

export function ChatView({ threadId: initialThreadId, showHeader = true }: ChatViewProps) {
  const router = useRouter();

  // Thread state
  const [threadId, setThreadId] = useState<string | null>(initialThreadId || null);

  // History loading state
  const [isLoadingHistory, setIsLoadingHistory] = useState(!!initialThreadId);
  const [historyError, setHistoryError] = useState<string | null>(null);

  // Conversation state
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [inputValue, setInputValue] = useState('');

  // Chat stream hook
  const { sendMessage, isStreaming, isPending, streamingMessage, error } = useChatStream({
    threadId,
    onMessageComplete: (message) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === message.id);
        if (exists) return prev;
        return [...prev, message];
      });
    },
    onThreadCreated: (newThreadId) => {
      setThreadId(newThreadId);
    },
    onError: (errorMsg) => {
      console.error('Chat error:', errorMsg);
    },
  });

  // Update URL when threadId changes (new thread created)
  useEffect(() => {
    if (threadId && !initialThreadId) {
      window.history.replaceState(null, '', `/lapor/${threadId}`);
    }
  }, [threadId, initialThreadId]);

  // Load message history
  const loadHistory = useCallback(async (tid: string) => {
    setIsLoadingHistory(true);
    setHistoryError(null);

    try {
      const response = await fetch(
        `/api/proxy/core/citizen-report-agent/threads/${tid}/messages?page_size=100`
      );

      if (!response.ok) {
        throw new Error('Gagal memuat riwayat percakapan');
      }

      const result = await response.json();
      if (result.success && result.data) {
        const rawMessages: IMessage[] = result.data.map(
          (msg: {
            id: string;
            thread_id: string;
            role: string;
            content: string | IContentBlock[];
            created_at: string;
          }) => ({
            id: msg.id,
            thread_id: msg.thread_id,
            role: msg.role as 'user' | 'assistant',
            content:
              typeof msg.content === 'string'
                ? [{ type: 'text' as const, text: msg.content }]
                : msg.content,
            created_at: msg.created_at,
          })
        );

        rawMessages.sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );

        setMessages(rawMessages);
      }
    } catch (err) {
      setHistoryError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  // Load history on mount if threadId provided
  useEffect(() => {
    if (initialThreadId) {
      loadHistory(initialThreadId);
    }
  }, [initialThreadId, loadHistory]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isStreaming || isPending) return;

    const messageContent = inputValue.trim();
    setInputValue('');

    // Add optimistic user message
    const userMessage: IMessage = {
      id: crypto.randomUUID(),
      thread_id: threadId || 'new',
      role: 'user',
      content: [{ type: 'text', text: messageContent }],
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Send to API
    await sendMessage(messageContent, userMessage.id);
  };

  // Loading state for history
  if (isLoadingHistory) {
    return (
      <main className="bg-background flex h-full flex-col overflow-hidden">
        {showHeader && <ChatHeader title="Lapor Masalah" />}
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="text-primary size-8 animate-spin" />
            <p className="text-muted-foreground">Memuat riwayat percakapan...</p>
          </div>
        </div>
      </main>
    );
  }

  // Error state for history
  if (historyError) {
    return (
      <main className="bg-background flex h-full flex-col overflow-hidden">
        {showHeader && <ChatHeader title="Lapor Masalah" />}
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4 px-4 text-center">
            <p className="text-destructive">{historyError}</p>
            <button
              onClick={() => router.push('/lapor')}
              className="text-primary text-sm hover:underline"
            >
              Mulai percakapan baru
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-background flex h-full flex-col overflow-hidden">
      {showHeader && <ChatHeader title="Lapor Masalah" />}

      <MessageList
        messages={messages}
        streamingMessage={streamingMessage}
        isPending={isPending}
        error={error}
      />

      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSendMessage}
        disabled={isStreaming || isPending}
      />
    </main>
  );
}
