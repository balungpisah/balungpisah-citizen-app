'use client';

import { memo } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

type TextBlockVariant = 'assistant' | 'user';

interface TextBlockProps {
  content: string;
  isStreaming?: boolean;
  variant?: TextBlockVariant;
}

/**
 * Create markdown components based on variant
 */
function createMarkdownComponents(variant: TextBlockVariant): Components {
  const isUser = variant === 'user';

  return {
    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
    ul: ({ children }) => <ul className="my-2 list-disc pl-4">{children}</ul>,
    ol: ({ children }) => <ol className="my-2 list-decimal pl-4">{children}</ol>,
    li: ({ children }) => <li className="my-1">{children}</li>,
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    code: ({ children, className }) => {
      const isInline = !className;
      if (isInline) {
        return (
          <code
            className={cn(
              'rounded px-1.5 py-0.5 font-mono text-sm',
              isUser ? 'bg-primary-foreground/20' : 'bg-muted'
            )}
          >
            {children}
          </code>
        );
      }
      return <code className={className}>{children}</code>;
    },
    pre: ({ children }) => (
      <pre
        className={cn(
          'my-2 overflow-x-auto rounded-lg p-3 text-sm',
          isUser ? 'bg-primary-foreground/20' : 'bg-muted'
        )}
      >
        {children}
      </pre>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn('break-all hover:underline', isUser ? 'underline' : 'text-primary')}
      >
        {children}
      </a>
    ),
    blockquote: ({ children }) => (
      <blockquote
        className={cn(
          'my-2 border-l-4 pl-4 italic',
          isUser ? 'border-primary-foreground/50' : 'border-primary/50'
        )}
      >
        {children}
      </blockquote>
    ),
    h1: ({ children }) => <h1 className="mb-2 text-xl font-bold">{children}</h1>,
    h2: ({ children }) => <h2 className="mb-2 text-lg font-bold">{children}</h2>,
    h3: ({ children }) => <h3 className="mb-2 text-base font-bold">{children}</h3>,
    hr: () => (
      <hr className={cn('my-4', isUser ? 'border-primary-foreground/30' : 'border-border')} />
    ),
    table: ({ children }) => (
      <div className="my-2 overflow-x-auto">
        <table
          className={cn(
            'min-w-full border-collapse border text-sm',
            isUser ? 'border-primary-foreground/30' : 'border-border'
          )}
        >
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className={isUser ? 'bg-primary-foreground/10' : 'bg-muted'}>{children}</thead>
    ),
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => (
      <tr className={cn('border-b', isUser ? 'border-primary-foreground/30' : 'border-border')}>
        {children}
      </tr>
    ),
    th: ({ children }) => (
      <th
        className={cn(
          'border px-3 py-2 text-left font-semibold',
          isUser ? 'border-primary-foreground/30' : 'border-border'
        )}
      >
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td
        className={cn(
          'border px-3 py-2',
          isUser ? 'border-primary-foreground/30' : 'border-border'
        )}
      >
        {children}
      </td>
    ),
  };
}

const remarkPlugins = [remarkGfm];

// Pre-create components for each variant to enable memoization
const assistantComponents = createMarkdownComponents('assistant');
const userComponents = createMarkdownComponents('user');

function TextBlockComponent({ content, variant = 'assistant' }: TextBlockProps) {
  if (!content) return null;

  const components = variant === 'user' ? userComponents : assistantComponents;

  return (
    <div
      className={cn(
        'prose prose-sm max-w-none',
        variant === 'assistant' && 'dark:prose-invert',
        variant === 'user' && 'prose-invert'
      )}
    >
      <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

export const TextBlock = memo(TextBlockComponent);
