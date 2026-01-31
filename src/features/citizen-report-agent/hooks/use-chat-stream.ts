'use client';

import { useState, useCallback, useRef } from 'react';
import { readSSEStream } from '../utils/sse-parser';
import {
  IMessage,
  IContentBlock,
  StreamingState,
  initialStreamingState,
  BlockState,
  TextBlockState,
  ThoughtBlockState,
  ToolCallBlockState,
  ToolResultBlockState,
  SseEvent,
  isMessageStartedEvent,
  isBlockCreatedEvent,
  isBlockDeltaEvent,
  isBlockCompletedEvent,
  isMessageCompletedEvent,
  isErrorEvent,
} from '../types';

interface UseChatStreamProps {
  threadId?: string | null;
  onMessageComplete?: (message: IMessage) => void;
  onError?: (error: string) => void;
  onThreadCreated?: (threadId: string) => void;
}

export function useChatStream({
  threadId,
  onMessageComplete,
  onError,
  onThreadCreated,
}: UseChatStreamProps = {}) {
  const [streamingState, setStreamingState] = useState<StreamingState>(initialStreamingState);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const threadCreationNotifiedRef = useRef<boolean>(false);

  /**
   * Convert streaming blocks to content array
   */
  const blocksToContent = useCallback((blocks: Map<string, BlockState>): IContentBlock[] => {
    const sortedBlocks = Array.from(blocks.values()).sort((a, b) => a.index - b.index);

    // Create a map of tool_call_id to tool_result
    const toolResultsMap = new Map<string, ToolResultBlockState>();
    sortedBlocks.forEach((block) => {
      if (block.block_type === 'tool_result') {
        toolResultsMap.set(block.tool_call_id, block);
      }
    });

    // Filter out tool_result blocks and merge them into tool_call blocks
    return sortedBlocks
      .filter((block) => block.block_type !== 'tool_result')
      .map((block) => {
        switch (block.block_type) {
          case 'text':
            return { type: 'text' as const, text: block.content };

          case 'thought':
            return { type: 'thought' as const, text: block.content, signature: block.signature };

          case 'tool_call': {
            const toolResult = toolResultsMap.get(block.tool_call_id);
            if (toolResult) {
              return {
                type: 'tool_call' as const,
                id: block.tool_call_id,
                name: block.tool_name,
                arguments: block.arguments,
                result: toolResult.content,
                error: toolResult.error,
                success: toolResult.success,
                execution_time_ms: toolResult.execution_time_ms,
              };
            }
            return {
              type: 'tool_call' as const,
              id: block.tool_call_id,
              name: block.tool_name,
              arguments: block.arguments,
            };
          }

          default:
            return { type: 'text' as const, text: '' };
        }
      });
  }, []);

  /**
   * Get current streaming message as IMessage
   */
  const getStreamingMessage = useCallback((): IMessage | null => {
    if (!streamingState.message) return null;

    return {
      id: streamingState.message.id,
      thread_id: streamingState.message.thread_id,
      role: streamingState.message.role,
      content: blocksToContent(streamingState.blocks),
      created_at: streamingState.message.created_at,
    };
  }, [streamingState, blocksToContent]);

  /**
   * Send message and start SSE stream
   */
  const sendMessage = useCallback(
    async (content: string, userMessageId?: string) => {
      try {
        setError(null);
        setIsPending(true);

        abortControllerRef.current = new AbortController();

        const messageId = userMessageId || crypto.randomUUID();
        const requestBody = {
          content,
          thread_id: threadId || null,
          user_message_id: messageId,
        };

        const response = await fetch('/api/proxy-stream/core/citizen-report-agent/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Process SSE stream
        for await (const event of readSSEStream(response)) {
          try {
            const sseEvent = event as SseEvent<unknown>;

            if (sseEvent.event === 'ping') continue;

            if (isMessageStartedEvent(sseEvent)) {
              threadCreationNotifiedRef.current = false;
              setIsPending(false);

              setStreamingState({
                isStreaming: true,
                currentMessageId: sseEvent.data.message_id,
                message: {
                  id: sseEvent.data.message_id,
                  thread_id: sseEvent.data.thread_id,
                  role: sseEvent.data.role as 'user' | 'assistant',
                  model: sseEvent.data.model,
                  created_at: sseEvent.data.timestamp,
                },
                blocks: new Map(),
              });
            } else if (isBlockCreatedEvent(sseEvent)) {
              setStreamingState((prev) => {
                const newBlocks = new Map(prev.blocks);

                if (sseEvent.data.block_type === 'text') {
                  newBlocks.set(sseEvent.data.block_id, {
                    block_id: sseEvent.data.block_id,
                    block_type: 'text',
                    index: sseEvent.data.index,
                    status: 'streaming',
                    content: '',
                  } as TextBlockState);
                } else if (sseEvent.data.block_type === 'thought') {
                  newBlocks.set(sseEvent.data.block_id, {
                    block_id: sseEvent.data.block_id,
                    block_type: 'thought',
                    index: sseEvent.data.index,
                    status: 'streaming',
                    content: '',
                  } as ThoughtBlockState);
                } else if (sseEvent.data.block_type === 'tool_call') {
                  newBlocks.set(sseEvent.data.block_id, {
                    block_id: sseEvent.data.block_id,
                    block_type: 'tool_call',
                    index: sseEvent.data.index,
                    status: 'streaming',
                    tool_name: sseEvent.data.tool_name || '',
                    tool_call_id: sseEvent.data.tool_call_id || '',
                    arguments: '',
                  } as ToolCallBlockState);
                } else if (sseEvent.data.block_type === 'tool_result') {
                  newBlocks.set(sseEvent.data.block_id, {
                    block_id: sseEvent.data.block_id,
                    block_type: 'tool_result',
                    index: sseEvent.data.index,
                    status: 'streaming',
                    tool_call_id: sseEvent.data.tool_call_id || '',
                    tool_name: sseEvent.data.tool_name || '',
                    success: false,
                    content: '',
                  } as ToolResultBlockState);
                }

                return { ...prev, blocks: newBlocks };
              });
            } else if (isBlockDeltaEvent(sseEvent)) {
              setStreamingState((prev) => {
                const newBlocks = new Map(prev.blocks);
                const block = newBlocks.get(sseEvent.data.block_id);

                if (block) {
                  if (sseEvent.data.block_type === 'text' && sseEvent.data.delta.text) {
                    newBlocks.set(sseEvent.data.block_id, {
                      ...block,
                      content: (block as TextBlockState).content + sseEvent.data.delta.text,
                    } as TextBlockState);
                  } else if (sseEvent.data.block_type === 'thought') {
                    newBlocks.set(sseEvent.data.block_id, {
                      ...block,
                      content:
                        (block as ThoughtBlockState).content + (sseEvent.data.delta.text || ''),
                      signature:
                        sseEvent.data.delta.signature || (block as ThoughtBlockState).signature,
                    } as ThoughtBlockState);
                  } else if (
                    sseEvent.data.block_type === 'tool_call' &&
                    sseEvent.data.delta.arguments
                  ) {
                    newBlocks.set(sseEvent.data.block_id, {
                      ...block,
                      arguments:
                        (block as ToolCallBlockState).arguments + sseEvent.data.delta.arguments,
                    } as ToolCallBlockState);
                  } else if (sseEvent.data.block_type === 'tool_result') {
                    newBlocks.set(sseEvent.data.block_id, {
                      ...block,
                      success:
                        sseEvent.data.delta.success ?? (block as ToolResultBlockState).success,
                      content: sseEvent.data.delta.result
                        ? JSON.stringify(sseEvent.data.delta.result, null, 2)
                        : (block as ToolResultBlockState).content,
                      error: sseEvent.data.delta.error || (block as ToolResultBlockState).error,
                    } as ToolResultBlockState);
                  }
                }

                return { ...prev, blocks: newBlocks };
              });
            } else if (isBlockCompletedEvent(sseEvent)) {
              setStreamingState((prev) => {
                const newBlocks = new Map(prev.blocks);
                const block = newBlocks.get(sseEvent.data.block_id);

                if (block) {
                  if (sseEvent.data.block_type === 'text') {
                    newBlocks.set(sseEvent.data.block_id, {
                      ...block,
                      status: 'completed',
                      content: sseEvent.data.final_content || (block as TextBlockState).content,
                    } as TextBlockState);
                  } else if (sseEvent.data.block_type === 'thought') {
                    newBlocks.set(sseEvent.data.block_id, {
                      ...block,
                      status: 'completed',
                      content: sseEvent.data.final_content || (block as ThoughtBlockState).content,
                      signature: sseEvent.data.signature,
                    } as ThoughtBlockState);
                  } else if (sseEvent.data.block_type === 'tool_call') {
                    newBlocks.set(sseEvent.data.block_id, {
                      ...block,
                      status: 'completed',
                      arguments:
                        sseEvent.data.final_arguments || (block as ToolCallBlockState).arguments,
                      parsed_arguments: sseEvent.data.parsed_arguments,
                    } as ToolCallBlockState);
                  } else if (sseEvent.data.block_type === 'tool_result') {
                    newBlocks.set(sseEvent.data.block_id, {
                      ...block,
                      status: 'completed',
                      success: sseEvent.data.success ?? false,
                      content: sseEvent.data.result
                        ? JSON.stringify(sseEvent.data.result, null, 2)
                        : undefined,
                      error: sseEvent.data.error,
                      execution_time_ms: sseEvent.data.execution_time_ms,
                    } as ToolResultBlockState);
                  }
                }

                return { ...prev, blocks: newBlocks };
              });
            } else if (isMessageCompletedEvent(sseEvent)) {
              setStreamingState((prev) => {
                const finalMessage: IMessage = {
                  id: sseEvent.data.message_id,
                  thread_id: sseEvent.data.thread_id,
                  role: 'assistant',
                  content: blocksToContent(prev.blocks),
                  created_at: sseEvent.data.timestamp,
                };

                onMessageComplete?.(finalMessage);

                // Notify about new thread
                if (
                  !threadId &&
                  sseEvent.data.thread_id &&
                  onThreadCreated &&
                  !threadCreationNotifiedRef.current
                ) {
                  threadCreationNotifiedRef.current = true;
                  onThreadCreated(sseEvent.data.thread_id);
                }

                return initialStreamingState;
              });
            } else if (isErrorEvent(sseEvent)) {
              const errorMessage = sseEvent.data.message || 'Terjadi kesalahan';
              setError(errorMessage);
              setIsPending(false);
              onError?.(errorMessage);
              setStreamingState(initialStreamingState);
            }
          } catch (eventError) {
            console.error('[SSE] Error processing event:', eventError);
          }
        }
      } catch (err) {
        const error = err as Error;
        if (error.name === 'AbortError') {
          setIsPending(false);
          return;
        }

        const errorMessage = error.message || 'Gagal mengirim pesan';
        setError(errorMessage);
        setIsPending(false);
        onError?.(errorMessage);
        setStreamingState(initialStreamingState);
      }
    },
    [threadId, blocksToContent, onMessageComplete, onError, onThreadCreated]
  );

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsPending(false);
    setStreamingState(initialStreamingState);
  }, []);

  return {
    sendMessage,
    stopStreaming,
    isStreaming: streamingState.isStreaming,
    isPending,
    streamingMessage: getStreamingMessage(),
    error,
  };
}
