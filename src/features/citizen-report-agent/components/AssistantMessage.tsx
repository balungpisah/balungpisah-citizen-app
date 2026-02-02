'use client';

import { memo } from 'react';
import { Bot } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ContentBlock } from './ContentBlock';
import type { IMessage } from '../types';

interface AssistantMessageProps {
  message: IMessage;
  isStreaming?: boolean;
}

function AssistantMessageComponent({ message, isStreaming = false }: AssistantMessageProps) {
  // Handle both array and string content
  const contentBlocks = Array.isArray(message.content)
    ? message.content
    : typeof message.content === 'string'
      ? [{ type: 'text' as const, text: message.content }]
      : [];

  return (
    <div className="flex items-start gap-3">
      {/* Avatar */}
      <Avatar className="size-8 shrink-0">
        <AvatarFallback className="bg-primary text-primary-foreground">
          <Bot className="size-4" />
        </AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div className="max-w-[80%] flex-1 space-y-2">
        {/* Render all content blocks in order */}
        {contentBlocks.map((block, index) => (
          <ContentBlock
            key={`${message.id}-block-${index}`}
            block={block}
            isStreaming={isStreaming && index === contentBlocks.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

export const AssistantMessage = memo(AssistantMessageComponent);
