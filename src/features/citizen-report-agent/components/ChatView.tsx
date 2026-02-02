'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOne } from '@/hooks/api/use-one';
import { useAutoScroll } from '../hooks/use-auto-scroll';
import { useChatStream } from '../hooks/use-chat-stream';
import { useChatStore } from '../stores/chat-store';
import type { IMessage, IContentBlock, IRateLimitStatus } from '../types';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { AttachmentDrawer } from './AttachmentDrawer';
import { RateLimitNotice } from './RateLimitNotice';
import { useAttachments } from '../hooks/use-attachments';

// ==================== History Transformation ====================

/**
 * Raw content block from history API
 */
interface RawHistoryContentBlock {
  type: string;
  // text block
  text?: string;
  // tool_use block (API format)
  id?: string;
  name?: string;
  input?: unknown;
  // tool_result block
  content?: string;
  is_error?: boolean;
  tool_use_id?: string;
}

/**
 * Transform history content blocks to match streaming format.
 *
 * History API returns:
 * - tool_use blocks with `input` (object) and `type: "tool_use"`
 * - tool_result blocks as separate entries
 *
 * Streaming format expects:
 * - tool_call blocks with `arguments` (string) and `type: "tool_call"`
 * - tool_result merged into tool_call block
 */
function transformHistoryContent(rawContent: RawHistoryContentBlock[]): IContentBlock[] {
  // Build map of tool_use_id -> tool_result
  const toolResultsMap = new Map<string, { content?: string; is_error?: boolean; name?: string }>();

  for (const block of rawContent) {
    if (block.type === 'tool_result' && block.tool_use_id) {
      toolResultsMap.set(block.tool_use_id, {
        content: block.content,
        is_error: block.is_error,
        name: block.name,
      });
    }
  }

  // Transform blocks (filter out tool_result as they get merged)
  return rawContent
    .filter((block) => block.type !== 'tool_result')
    .map((block): IContentBlock => {
      if (block.type === 'text') {
        return {
          type: 'text',
          text: block.text,
        };
      }

      if (block.type === 'tool_use' && block.id) {
        const toolResult = toolResultsMap.get(block.id);
        return {
          type: 'tool_call',
          id: block.id,
          name: block.name,
          arguments: block.input ? JSON.stringify(block.input, null, 2) : undefined,
          // Merge tool_result data
          result: toolResult?.content,
          error: toolResult?.is_error ? toolResult.content : undefined,
          success: toolResult ? !toolResult.is_error : undefined,
        };
      }

      // Pass through other types as-is
      return block as IContentBlock;
    });
}

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

  // Rate limit check - only for new chats (no existing thread)
  const isNewChat = !initialThreadId;
  const { data: rateLimitStatus, isLoading: isLoadingRateLimit } = useOne<IRateLimitStatus>({
    resource: 'citizen-report-agent/rate-limit',
    enabled: isNewChat,
  });

  // Attachments hook
  const {
    localAttachments,
    serverAttachments,
    isLoadingAttachments,
    isDrawerOpen,
    setDrawerOpen,
    addFiles,
    removeLocalFile,
    removeServerFile,
    uploadPendingAttachments,
    retryUpload,
    totalCount: attachmentCount,
    canAddMore: canAddMoreAttachments,
  } = useAttachments();

  // Chat stream hook
  const { sendMessage, isStreaming, isPending, streamingMessage, error } = useChatStream({
    threadId,
    onMessageComplete: (message) => {
      updateMessageIfNotExists(message);
    },
    onThreadCreated: (newThreadId) => {
      setThreadId(newThreadId);
      // Upload pending attachments after thread is created
      // Use store state directly to avoid stale closure
      const currentPendingCount = useChatStore
        .getState()
        .localAttachments.filter((a) => a.status === 'pending').length;
      if (currentPendingCount > 0) {
        uploadPendingAttachments(newThreadId);
      }
    },
    onError: (errorMsg) => {
      console.error('Chat error:', errorMsg);
    },
  });

  // Auto-scroll hook
  const { scrollContainerRef, bottomRef, isAtBottom, scrollToBottom, handleScroll } = useAutoScroll(
    {
      threshold: 150,
      isStreaming,
    }
  );

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
              content: string | RawHistoryContentBlock[];
              created_at: string;
            }) => {
              // Transform content to match streaming format
              let content: IContentBlock[];

              if (typeof msg.content === 'string') {
                content = [{ type: 'text', text: msg.content }];
              } else if (msg.role === 'assistant') {
                // Transform assistant content (may contain tool_use/tool_result)
                content = transformHistoryContent(msg.content);
              } else {
                // User messages - pass through as-is
                content = msg.content as IContentBlock[];
              }

              return {
                id: msg.id,
                thread_id: msg.thread_id,
                role: msg.role as 'user' | 'assistant',
                content,
                created_at: msg.created_at,
              };
            }
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

  // Loading state for rate limit check (new chats only)
  if (isNewChat && isLoadingRateLimit) {
    return (
      <main className="bg-background flex h-full flex-col overflow-hidden">
        {showHeader && <ChatHeader title="Lapor Masalah" />}
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="text-primary size-8 animate-spin" />
            <p className="text-muted-foreground">Memeriksa kuota laporan...</p>
          </div>
        </div>
      </main>
    );
  }

  // Rate limited state (new chats only)
  if (isNewChat && rateLimitStatus && !rateLimitStatus.can_chat) {
    return (
      <main className="bg-background flex h-full flex-col overflow-hidden">
        {showHeader && <ChatHeader title="Lapor Masalah" />}
        <RateLimitNotice status={rateLimitStatus} />
      </main>
    );
  }

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

  const showScrollButton = !isAtBottom && messages.length > 0;

  return (
    <main className="bg-background flex h-full flex-col overflow-hidden">
      {showHeader && <ChatHeader title="Lapor Masalah" />}

      <MessageList
        ref={scrollContainerRef}
        messages={messages}
        streamingMessage={streamingMessage}
        isPending={isPending}
        error={error}
        onScroll={handleScroll}
        bottomRef={bottomRef}
      />

      {/* Floating scroll to bottom button - positioned above input */}
      {showScrollButton && (
        <div className="flex justify-center pb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scrollToBottom('smooth')}
            className="bg-muted/60 hover:bg-muted/80 size-8 rounded-full backdrop-blur-sm"
          >
            <ArrowDown className="text-muted-foreground size-4" />
          </Button>
        </div>
      )}

      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSendMessage}
        onNewChat={handleNewChat}
        disabled={isStreaming || isPending}
        showNewChatButton={messages.length > 0 || !!threadId}
        attachmentCount={attachmentCount}
        canAddMoreAttachments={canAddMoreAttachments}
        onFilesSelected={addFiles}
        onOpenAttachments={() => setDrawerOpen(true)}
      />

      {/* Attachment drawer */}
      <AttachmentDrawer
        open={isDrawerOpen}
        onOpenChange={setDrawerOpen}
        localAttachments={localAttachments}
        serverAttachments={serverAttachments}
        isLoading={isLoadingAttachments}
        onFilesSelected={addFiles}
        onRemoveLocal={removeLocalFile}
        onRemoveServer={removeServerFile}
        onRetry={retryUpload}
        canAddMore={canAddMoreAttachments}
      />
    </main>
  );
}
