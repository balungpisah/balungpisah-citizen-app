'use client';

import { TextBlock } from './blocks/TextBlock';
import { ToolCallBlock, type ToolCallStatus } from './blocks/ToolCallBlock';
import { ReportCreatedBlock, type ReportCreatedStatus } from './blocks/ReportCreatedBlock';
import type { IContentBlock } from '../types';

interface ContentBlockProps {
  block: IContentBlock;
  isStreaming?: boolean;
}

/**
 * Parse the result JSON from create_report tool to extract reference number
 */
function parseReportResult(result?: string): { referenceNumber?: string; error?: string } {
  if (!result) return {};

  try {
    const parsed = JSON.parse(result);
    return {
      referenceNumber: parsed.reference_number,
      error: parsed.message && !parsed.success ? parsed.message : undefined,
    };
  } catch {
    return {};
  }
}

export function ContentBlock({ block, isStreaming = false }: ContentBlockProps) {
  switch (block.type) {
    case 'text':
      return <TextBlock content={block.text || ''} isStreaming={isStreaming} />;

    case 'thought':
      // Hide thought blocks (internal reasoning)
      return null;

    case 'tool_call': {
      // Special handling for create_report tool
      if (block.name === 'create_report') {
        const hasResult = block.result !== undefined || block.content !== undefined;
        const hasError = !!block.error;

        let reportStatus: ReportCreatedStatus = 'processing';
        if (hasError) {
          reportStatus = 'error';
        } else if (hasResult) {
          reportStatus = 'success';
        }

        const { referenceNumber, error } = parseReportResult(block.result || block.content);

        return (
          <ReportCreatedBlock
            status={reportStatus}
            referenceNumber={referenceNumber}
            error={error || block.error}
          />
        );
      }

      // Default handling for other tools
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
