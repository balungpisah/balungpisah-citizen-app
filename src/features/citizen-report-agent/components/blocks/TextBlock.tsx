'use client';

import { cn } from '@/lib/utils';

interface TextBlockProps {
  content: string;
  isStreaming?: boolean;
}

export function TextBlock({ content, isStreaming = false }: TextBlockProps) {
  if (!content) return null;

  return (
    <p className={cn('leading-relaxed whitespace-pre-wrap', isStreaming && 'animate-pulse')}>
      {content}
    </p>
  );
}
