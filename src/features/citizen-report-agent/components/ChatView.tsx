'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useChatStream } from '../hooks/use-chat-stream';
import { useChatStore } from '../stores/chat-store';
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
  const initializedRef = useRef(false);

  // Store state - use selectors to avoid unnecessary re-renders
  const threadId = useChatStore((state) => state.threadId);
  const messages = useChatStore((state) => state.messages);
  const inputValue = useChatStore((state) => state.inputValue);
  const isLoadingHistory = useChatStore((state) => state.isLoadingHistory);
  const historyError = useChatStore((state) => state.historyError);

  // Store actions - these are stable references
  const setThreadId = useChatStore((state) => state.setThreadId);
  const addMessage = useChatStore((state) => state.addMessage);
  const setInputValue = useChatStore((state) => state.setInputValue);
  const loadHistoryStart = useChatStore((state) => state.loadHistoryStart);
  const loadHistorySuccess = useChatStore((state) => state.loadHistorySuccess);
  const loadHistoryError = useChatStore((state) => state.loadHistoryError);
  const updateMessageIfNotExists = useChatStore((state) => state.updateMessageIfNotExists);
  const startNewChat = useChatStore((state) => state.startNewChat);

  // Chat stream hook
  const { sendMessage, isStreaming, isPending, streamingMessage, error } = useChatStream({
    threadId,
    onMessageComplete: (message) => {
      updateMessageIfNotExists(message);
    },
    onThreadCreated: (newThreadId) => {
      setThreadId(newThreadId);
    },
    onError: (errorMsg) => {
      console.error('Chat error:', errorMsg);
    },
  });

  // Initialize thread from props - only run once
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    if (initialThreadId) {
      setThreadId(initialThreadId);
    } else {
      // New chat page - ensure clean state
      startNewChat();
    }
  }, [initialThreadId, setThreadId, startNewChat]);

  // Update URL when threadId changes (new thread created)
  useEffect(() => {
    if (threadId && !initialThreadId) {
      window.history.replaceState(null, '', `/lapor/${threadId}`);
    }
  }, [threadId, initialThreadId]);

  // Load message history
  const loadHistory = useCallback(
    async (tid: string) => {
      loadHistoryStart();

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

          loadHistorySuccess(rawMessages);
        } else {
          loadHistorySuccess([]);
        }
      } catch (err) {
        loadHistoryError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      }
    },
    [loadHistoryStart, loadHistorySuccess, loadHistoryError]
  );

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
    addMessage(userMessage);

    // Send to API
    await sendMessage(messageContent, userMessage.id);
  };

  const handleNewChat = () => {
    startNewChat();
    router.push('/lapor');
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
            <button onClick={handleNewChat} className="text-primary text-sm hover:underline">
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
        onNewChat={handleNewChat}
        disabled={isStreaming || isPending}
        showNewChatButton={messages.length > 0 || !!threadId}
      />
    </main>
  );
}
