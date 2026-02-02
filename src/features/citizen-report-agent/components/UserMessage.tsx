'use client';

import { memo } from 'react';
import { User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { IMessage } from '../types';

interface UserMessageProps {
  message: IMessage;
}

function UserMessageComponent({ message }: UserMessageProps) {
  // Handle both array and string content
  const contentBlocks = Array.isArray(message.content)
    ? message.content
    : typeof message.content === 'string'
      ? [{ type: 'text' as const, text: message.content }]
      : [];

  // Extract text from content blocks
  const textContent = contentBlocks
    .filter((block) => block.type === 'text')
    .map((block) => block.text || '')
    .join('\n');

  return (
    <div className="flex flex-row-reverse items-start gap-3">
      {/* Avatar */}
      <Avatar className="size-8 shrink-0">
        <AvatarFallback className="bg-card text-foreground">
          <User className="size-4" />
        </AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div className="max-w-[80%]">
        {textContent && (
          <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-md p-4">
            <p className="leading-relaxed whitespace-pre-wrap">{textContent}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export const UserMessage = memo(UserMessageComponent);
