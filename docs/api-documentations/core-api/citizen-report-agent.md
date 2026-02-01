# Citizen Report Agent API

---

## API Endpoints

| Method | Endpoint                                          | Description                                                                                                         | Parameters             | Request Body      | Response                              |
| ------ | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ---------------------- | ----------------- | ------------------------------------- |
| POST   | `/api/citizen-report-agent/chat`                  | POST /api/citizen-report-agent/chat Send a message and receive a streaming SSE response                             | -                      | `IChatRequestDto` | -                                     |
| POST   | `/api/citizen-report-agent/chat/sync`             | POST /api/citizen-report-agent/chat/sync Send a message and receive a synchronous response (non-streaming fallback) | -                      | `IChatRequestDto` | `IApiResponse_ChatResponseDto`        |
| GET    | `/api/citizen-report-agent/threads`               | GET /api/citizen-report-agent/threads List user's conversation threads                                              | `Ilist_threadsParams`  | -                 | `IApiResponse_Vec_ThreadResponseDto`  |
| GET    | `/api/citizen-report-agent/threads/{id}`          | GET /api/citizen-report-agent/threads/{id} Get thread details                                                       | `Iget_threadParams`    | -                 | `IApiResponse_ThreadDetailDto`        |
| GET    | `/api/citizen-report-agent/threads/{id}/messages` | GET /api/citizen-report-agent/threads/{id}/messages List messages in a thread                                       | `Ilist_messagesParams` | -                 | `IApiResponse_Vec_MessageResponseDto` |

---

## TypeScript Interfaces

```typescript
interface IApiResponse_ChatResponseDto {
  data?: IChatResponseDto;  // Response DTO for synchronous chat
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IApiResponse_ThreadDetailDto {
  data?: IThreadDetailDto;  // Response DTO for thread details (includes message count)
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IApiResponse_Vec_MessageResponseDto {
  data?: IMessageResponseDto[];
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IApiResponse_Vec_ThreadResponseDto {
  data?: IThreadResponseDto[];
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IChatRequestDto {
  content: IMessageContentInput;  // The message content (text string or multimodal blocks)
  thread_id?: string | null;  // Optional thread ID.
- If not provided, a new thread will be created.
- If provided but not found, the thread will be created with this ID (optimistic UI).
- If provided and found, the existing thread will be used. (uuid)
  user_message_id?: string | null;  // Optional user message ID for optimistic UI or edit mode.
- If not provided, a new message ID will be auto-generated.
- If provided but not found, the message will be created with this ID (optimistic UI).
- If provided and found, edit mode is triggered: the message is updated and
  all subsequent messages in the thread are deleted before generating a new response. (uuid)
}

interface IChatResponseDto {
  episode_id: string;  // TensorZero episode ID for tracking (uuid)
  response: string;  // The assistant's response text
  thread_id: string;  // The thread ID (useful if a new thread was created) (uuid)
}

interface IMessageContentInput {
}

interface IMessageResponseDto {
  content: string;  // Message content (text)
  created_at: string;  // When the message was created (date-time)
  episode_id?: string | null;  // TensorZero episode ID (for assistant messages) (uuid)
  id: string;  // Message ID (uuid)
  role: string;  // Message role: "user" or "assistant"
  thread_id: string;  // Thread ID this message belongs to (uuid)
}

interface IMeta {
  total: number;  // (int64)
}

interface IThreadDetailDto {
  created_at: string;  // When the thread was created (date-time)
  id: string;  // Thread ID (uuid)
  message_count: number;  // Number of messages in the thread (int64)
  title?: string | null;  // Optional thread title
  updated_at: string;  // When the thread was last updated (date-time)
}

interface IThreadResponseDto {
  created_at: string;  // When the thread was created (date-time)
  id: string;  // Thread ID (uuid)
  title?: string | null;  // Optional thread title
  updated_at: string;  // When the thread was last updated (date-time)
}

interface Iget_threadParams {
  id: string;  // Thread ID (in: path) (uuid)
}

interface Ilist_messagesParams {
  id: string;  // Thread ID (in: path) (uuid)
  page?: number;  // Page number (1-indexed) (in: query) (min: 1, int64)
  page_size?: number;  // Number of items per page (default: 50, max: 200) (in: query) (min: 1, max: 200, int64)
}

interface Ilist_threadsParams {
  page?: number;  // Page number (1-indexed) (in: query) (min: 1, int64)
  page_size?: number;  // Number of items per page (default: 10, max: 100) (in: query) (min: 1, max: 100, int64)
}

```
