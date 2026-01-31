'use client';

import { TextBlock } from './blocks/TextBlock';
import { ToolCallBlock, type ToolCallStatus } from './blocks/ToolCallBlock';
import type { IContentBlock } from '../types';

interface ContentBlockProps {
  block: IContentBlock;
  isStreaming?: boolean;
}

export function ContentBlock({ block, isStreaming = false }: ContentBlockProps) {
  switch (block.type) {
    case 'text':
      return <TextBlock content={block.text || ''} isStreaming={isStreaming} />;

    case 'thought':
      // Hide thought blocks (internal reasoning)
      return null;

    case 'tool_call': {
      // Determine status based on result presence
      const hasResult = block.result !== undefined || block.content !== undefined;
      const hasError = !!block.error;

      let status: ToolCallStatus = 'created';
      if (hasError) {
        status = 'error';
      } else if (hasResult) {
        status = 'success';
      } else if (isStreaming) {
        status = 'streaming_args';
      }

      return (
        <ToolCallBlock
          toolName={block.name || 'Unknown Tool'}
          arguments={block.arguments}
          result={block.result || block.content}
          error={block.error}
          success={block.success}
          executionTimeMs={block.execution_time_ms}
          status={status}
          isStreaming={isStreaming}
        />
      );
    }

    case 'tool_result':
      // Tool results are merged into tool_call blocks, skip standalone rendering
      return null;

    default:
      return null;
  }
}
