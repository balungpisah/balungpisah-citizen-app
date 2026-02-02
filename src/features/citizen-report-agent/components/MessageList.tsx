'use client';

import { forwardRef, useEffect, useRef } from 'react';
import { Bot, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { IMessage } from '../types';
import { UserMessage } from './UserMessage';
import { AssistantMessage } from './AssistantMessage';
import { ChatWelcome } from './ChatWelcome';

interface MessageListProps {
  messages: IMessage[];
  streamingMessage?: IMessage | null;
  isPending?: boolean;
  error?: string | null;
  showWelcome?: boolean;
  onScroll?: () => void;
  bottomRef?: React.RefObject<HTMLDivElement | null>;
}

export const MessageList = forwardRef<HTMLDivElement, MessageListProps>(function MessageList(
  { messages, streamingMessage, isPending, error, showWelcome = true, onScroll, bottomRef },
  ref
) {
  const internalBottomRef = useRef<HTMLDivElement>(null);
  const actualBottomRef = bottomRef || internalBottomRef;

  const prevMessageCountRef = useRef(0);
  const prevIsPendingRef = useRef(false);

  // Scroll to bottom when new message or pending starts
  useEffect(() => {
    const messageCount = messages.length;
    const isNewMessage = messageCount > prevMessageCountRef.current;
    const isPendingStarted = isPending && !prevIsPendingRef.current;

    prevMessageCountRef.current = messageCount;
    prevIsPendingRef.current = !!isPending;

    if (isNewMessage || isPendingStarted) {
      actualBottomRef.current?.scrollIntoView({ behavior: 'instant', block: 'end' });
    }
  }, [messages.length, isPending, actualBottomRef]);

  const shouldShowWelcome = showWelcome && messages.length === 0 && !streamingMessage;

  return (
    <div ref={ref} onScroll={onScroll} className="flex-1 overflow-y-auto overscroll-contain">
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-6">
        {/* Welcome message if no messages yet */}
        {shouldShowWelcome && <ChatWelcome />}

        {/* Existing messages */}
        {messages.map((message) =>
          message.role === 'user' ? (
            <UserMessage key={message.id} message={message} />
          ) : (
            <AssistantMessage key={message.id} message={message} />
          )
        )}

        {/* Streaming message */}
        {streamingMessage &&
          (streamingMessage.role === 'user' ? (
            <UserMessage message={streamingMessage} />
          ) : (
            <AssistantMessage message={streamingMessage} isStreaming />
          ))}

        {/* Pending indicator (waiting for response) */}
        {isPending && !streamingMessage && (
          <div className="flex gap-3">
            <Avatar className="size-8 shrink-0">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Bot className="size-4" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-card flex items-center gap-2 rounded-2xl rounded-tl-md px-4 py-3">
              <Loader2 className="text-primary size-4 animate-spin" />
              <span className="text-muted-foreground text-sm">AI sedang berpikir...</span>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-destructive/20 text-destructive rounded-lg p-3 text-sm">
            Terjadi kesalahan: {error}
          </div>
        )}

        {/* Bottom anchor for scrolling */}
        <div ref={actualBottomRef} />
      </div>
    </div>
  );
});
