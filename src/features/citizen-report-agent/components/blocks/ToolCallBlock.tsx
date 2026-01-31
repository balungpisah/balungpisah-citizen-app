'use client';

import { useState } from 'react';
import {
  Wrench,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  XCircle,
  Loader2,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToolCallStatus = 'created' | 'streaming_args' | 'executing' | 'success' | 'error';

export interface ToolCallBlockProps {
  toolName: string;
  arguments?: string;
  result?: string;
  error?: string;
  success?: boolean;
  executionTimeMs?: number;
  status: ToolCallStatus;
  isStreaming?: boolean;
}

export function ToolCallBlock({
  toolName,
  arguments: args,
  result,
  error,
  executionTimeMs,
  status,
}: ToolCallBlockProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatToolName = (name: string) => {
    return name
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="size-4 text-green-500" />;
      case 'error':
        return <XCircle className="text-destructive size-4" />;
      case 'executing':
        return <Loader2 className="text-primary size-4 animate-spin" />;
      case 'streaming_args':
        return <Loader2 className="text-muted-foreground size-4 animate-spin" />;
      default:
        return <Wrench className="text-muted-foreground size-4" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'success':
        return 'Selesai';
      case 'error':
        return 'Gagal';
      case 'executing':
        return 'Mengeksekusi...';
      case 'streaming_args':
        return 'Menyiapkan...';
      default:
        return 'Menunggu';
    }
  };

  // Parse arguments safely
  let parsedArgsStr: string | null = null;
  if (args) {
    try {
      const parsed = JSON.parse(args);
      parsedArgsStr = JSON.stringify(parsed, null, 2);
    } catch {
      parsedArgsStr = args;
    }
  }

  // Parse result safely
  let parsedResultStr: string | null = null;
  if (result) {
    try {
      const parsed = JSON.parse(result);
      parsedResultStr = JSON.stringify(parsed, null, 2);
    } catch {
      parsedResultStr = result;
    }
  }

  return (
    <div className="bg-card my-2 overflow-hidden rounded-lg border">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="hover:bg-muted/50 flex w-full items-center gap-2 px-3 py-2 transition-colors"
      >
        {getStatusIcon()}
        <span className="flex-1 text-left text-sm font-medium">{formatToolName(toolName)}</span>
        <span className="text-muted-foreground text-xs">{getStatusText()}</span>
        {executionTimeMs !== undefined && (
          <span className="text-muted-foreground flex items-center gap-1 text-xs">
            <Clock className="size-3" />
            {executionTimeMs}ms
          </span>
        )}
        {isExpanded ? (
          <ChevronDown className="text-muted-foreground size-4" />
        ) : (
          <ChevronRight className="text-muted-foreground size-4" />
        )}
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="space-y-3 border-t px-3 pb-3">
          {/* Arguments */}
          {parsedArgsStr && (
            <div className="pt-3">
              <p className="text-muted-foreground mb-1 text-xs">Arguments</p>
              <pre className="bg-muted overflow-x-auto rounded p-2 text-xs">{parsedArgsStr}</pre>
            </div>
          )}

          {/* Result */}
          {parsedResultStr && status === 'success' && (
            <div>
              <p className="text-muted-foreground mb-1 text-xs">Result</p>
              <pre className="bg-muted max-h-60 overflow-x-auto rounded p-2 text-xs">
                {parsedResultStr}
              </pre>
            </div>
          )}

          {/* Error */}
          {error && (
            <div>
              <p className="text-destructive mb-1 text-xs">Error</p>
              <pre
                className={cn(
                  'overflow-x-auto rounded p-2 text-xs',
                  'bg-destructive/10 text-destructive'
                )}
              >
                {error}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
