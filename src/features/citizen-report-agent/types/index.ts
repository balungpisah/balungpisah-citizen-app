/**
 * Citizen Report Agent Types
 */

// ==================== Rate Limit Types ====================

export interface IRateLimitStatus {
  /** Whether the user can still chat (hasn't reached the limit) */
  can_chat: boolean;
  /** Maximum tickets allowed per day */
  max_tickets: number;
  /** When the limit resets (next 00:00 WIB in UTC) */
  resets_at: string;
  /** Number of tickets remaining before hitting the limit */
  tickets_remaining: number;
  /** Number of tickets the user has created today */
  tickets_used: number;
}

// ==================== Message Types ====================

export interface IContentBlock {
  type: 'text' | 'thought' | 'tool_call' | 'tool_result';
  // Text/Thought fields
  text?: string;
  signature?: string;
  // Tool call fields
  id?: string;
  name?: string;
  arguments?: string;
  // Tool result fields
  tool_call_id?: string;
  tool_name?: string;
  success?: boolean;
  content?: string;
  error?: string;
  execution_time_ms?: number;
  result?: string;
}

export interface IMessage {
  id: string;
  thread_id: string;
  role: 'user' | 'assistant';
  content: IContentBlock[];
  created_at: string;
}

// ==================== SSE Event Types ====================

export interface SseEvent<T = unknown> {
  event: string;
  data: T;
}

export interface MessageStartedData {
  message_id: string;
  thread_id: string;
  role: string;
  model: string;
  timestamp: string;
}

export interface MessageCompletedData {
  message_id: string;
  thread_id: string;
  total_blocks: number;
  finish_reason: string;
  timestamp: string;
}

export interface BlockCreatedData {
  message_id: string;
  block_id: string;
  block_type: 'text' | 'thought' | 'tool_call' | 'tool_result';
  index: number;
  tool_name?: string;
  tool_call_id?: string;
}

export interface BlockDeltaData {
  message_id: string;
  block_id: string;
  block_type: 'text' | 'thought' | 'tool_call' | 'tool_result';
  delta: {
    text?: string;
    arguments?: string;
    signature?: string;
    result?: unknown;
    error?: string;
    success?: boolean;
  };
  partial_arguments?: string;
  tool_name?: string;
  tool_call_id?: string;
}

export interface BlockCompletedData {
  message_id: string;
  block_id: string;
  block_type: 'text' | 'thought' | 'tool_call' | 'tool_result';
  final_content?: string;
  final_arguments?: string;
  parsed_arguments?: unknown;
  signature?: string;
  tool_name?: string;
  tool_call_id?: string;
  execution_time_ms?: number;
  success?: boolean;
  result?: unknown;
  error?: string;
}

export interface ErrorEventData {
  type: string;
  message: string;
}

// ==================== Block State Types ====================

export type BlockStatus = 'streaming' | 'completed' | 'error';

export interface BaseBlockState {
  block_id: string;
  block_type: 'text' | 'thought' | 'tool_call' | 'tool_result';
  index: number;
  status: BlockStatus;
}

export interface TextBlockState extends BaseBlockState {
  block_type: 'text';
  content: string;
}

export interface ThoughtBlockState extends BaseBlockState {
  block_type: 'thought';
  content: string;
  signature?: string;
}

export interface ToolCallBlockState extends BaseBlockState {
  block_type: 'tool_call';
  tool_name: string;
  tool_call_id: string;
  arguments: string;
  parsed_arguments?: unknown;
}

export interface ToolResultBlockState extends BaseBlockState {
  block_type: 'tool_result';
  tool_call_id: string;
  tool_name: string;
  success: boolean;
  content?: string;
  error?: string;
  execution_time_ms?: number;
}

export type BlockState =
  | TextBlockState
  | ThoughtBlockState
  | ToolCallBlockState
  | ToolResultBlockState;

// ==================== Streaming State ====================

export interface StreamingState {
  isStreaming: boolean;
  currentMessageId: string | null;
  message: {
    id: string;
    thread_id: string;
    role: 'user' | 'assistant';
    model: string;
    created_at: string;
  } | null;
  blocks: Map<string, BlockState>;
}

export const initialStreamingState: StreamingState = {
  isStreaming: false,
  currentMessageId: null,
  message: null,
  blocks: new Map(),
};

// ==================== Type Guards ====================

export function isMessageStartedEvent(event: SseEvent): event is SseEvent<MessageStartedData> {
  return event.event === 'message.started';
}

export function isMessageCompletedEvent(event: SseEvent): event is SseEvent<MessageCompletedData> {
  return event.event === 'message.completed';
}

export function isBlockCreatedEvent(event: SseEvent): event is SseEvent<BlockCreatedData> {
  return event.event === 'block.created';
}

export function isBlockDeltaEvent(event: SseEvent): event is SseEvent<BlockDeltaData> {
  return event.event === 'block.delta';
}

export function isBlockCompletedEvent(event: SseEvent): event is SseEvent<BlockCompletedData> {
  return event.event === 'block.completed';
}

export function isErrorEvent(event: SseEvent): event is SseEvent<ErrorEventData> {
  return event.event === 'error';
}
