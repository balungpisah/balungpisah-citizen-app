'use client';

import { memo } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface TextBlockProps {
  content: string;
  isStreaming?: boolean;
}

/**
 * Memoized markdown components to prevent re-renders
 */
const markdownComponents: Components = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="my-2 list-disc pl-4">{children}</ul>,
  ol: ({ children }) => <ol className="my-2 list-decimal pl-4">{children}</ol>,
  li: ({ children }) => <li className="my-1">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  code: ({ children, className }) => {
    const isInline = !className;
    if (isInline) {
      return <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-sm">{children}</code>;
    }
    return <code className={className}>{children}</code>;
  },
  pre: ({ children }) => (
    <pre className="bg-muted my-2 overflow-x-auto rounded-lg p-3 text-sm">{children}</pre>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary break-all hover:underline"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-primary/50 my-2 border-l-4 pl-4 italic">{children}</blockquote>
  ),
  h1: ({ children }) => <h1 className="mb-2 text-xl font-bold">{children}</h1>,
  h2: ({ children }) => <h2 className="mb-2 text-lg font-bold">{children}</h2>,
  h3: ({ children }) => <h3 className="mb-2 text-base font-bold">{children}</h3>,
  hr: () => <hr className="border-border my-4" />,
  table: ({ children }) => (
    <div className="my-2 overflow-x-auto">
      <table className="border-border min-w-full border-collapse border text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-muted">{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr className="border-border border-b">{children}</tr>,
  th: ({ children }) => (
    <th className="border-border border px-3 py-2 text-left font-semibold">{children}</th>
  ),
  td: ({ children }) => <td className="border-border border px-3 py-2">{children}</td>,
};

const remarkPlugins = [remarkGfm];

function TextBlockComponent({ content }: TextBlockProps) {
  if (!content) return null;

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <ReactMarkdown remarkPlugins={remarkPlugins} components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

export const TextBlock = memo(TextBlockComponent);
