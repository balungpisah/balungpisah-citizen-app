# Citizen Report Agent API

---

## API Endpoints

| Method | Endpoint                                                                    | Description                                                                | Parameters                 | Request Body           | Response                                       |
| ------ | --------------------------------------------------------------------------- | -------------------------------------------------------------------------- | -------------------------- | ---------------------- | ---------------------------------------------- |
| POST   | `/api/citizen-report-agent/chat`                                            | Send a message and receive a streaming SSE response                        | -                          | `IChatRequestDto`      | -                                              |
| POST   | `/api/citizen-report-agent/chat/sync`                                       | Send a message and receive a synchronous response (non-streaming fallback) | -                          | `IChatRequestDto`      | `IApiResponse_ChatResponseDto`                 |
| GET    | `/api/citizen-report-agent/rate-limit`                                      | Get current user's rate limit status                                       | -                          | -                      | `IApiResponse_UserRateLimitStatusDto`          |
| GET    | `/api/citizen-report-agent/threads`                                         | List user's conversation threads                                           | `Ilist_threadsParams`      | -                      | `IApiResponse_Vec_ThreadResponseDto`           |
| GET    | `/api/citizen-report-agent/threads/{id}`                                    | Get thread details                                                         | `Iget_threadParams`        | -                      | `IApiResponse_ThreadDetailDto`                 |
| GET    | `/api/citizen-report-agent/threads/{id}/messages`                           | List messages in a thread                                                  | `Ilist_messagesParams`     | -                      | `IApiResponse_Vec_MessageResponseDto`          |
| GET    | `/api/citizen-report-agent/threads/{thread_id}/attachments`                 | List all attachments for a thread                                          | `Ilist_attachmentsParams`  | -                      | `IApiResponse_Vec_ThreadAttachmentResponseDto` |
| POST   | `/api/citizen-report-agent/threads/{thread_id}/attachments`                 | Upload an attachment to a thread                                           | `Iupload_attachmentParams` | `IUploadAttachmentDto` | `IApiResponse_ThreadAttachmentResponseDto`     |
| GET    | `/api/citizen-report-agent/threads/{thread_id}/attachments/count`           | Get attachment count for a thread                                          | `Icount_attachmentsParams` | -                      | `IApiResponse_AttachmentCountDto`              |
| DELETE | `/api/citizen-report-agent/threads/{thread_id}/attachments/{attachment_id}` | Delete an attachment from a thread                                         | `Idelete_attachmentParams` | -                      | `IApiResponse_DeleteAttachmentResponseDto`     |

---

## TypeScript Interfaces

```typescript
interface IApiResponse_AttachmentCountDto {
  data?: IAttachmentCountDto;  // DTO for attachment count information
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IApiResponse_ChatResponseDto {
  data?: IChatResponseDto;  // Response DTO for synchronous chat
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IApiResponse_DeleteAttachmentResponseDto {
  data?: IDeleteAttachmentResponseDto;  // Response DTO for delete attachment operations
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IApiResponse_ThreadAttachmentResponseDto {
  data?: IThreadAttachmentResponseDto;  // Response DTO for thread attachment
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

interface IApiResponse_UserRateLimitStatusDto {
  data?: IUserRateLimitStatusDto;  // Response DTO for user's rate limit status
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

interface IApiResponse_Vec_ThreadAttachmentResponseDto {
  data?: IThreadAttachmentResponseDto[];
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

interface IAttachmentCountDto {
  can_upload: boolean;  // Whether more attachments can be uploaded
  count: number;  // Current number of attachments in the thread (int64)
  max_allowed: number;  // Maximum allowed attachments per thread (int64)
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

interface IDeleteAttachmentResponseDto {
  deleted: boolean;  // Confirmation that the attachment was deleted
}

interface IMessageContentInput {
}

interface IMessageResponseDto {
  content: any;  // Message content - can be a string or array of content blocks (text, tool_use, tool_result)
  created_at: string;  // When the message was created (date-time)
  episode_id?: string | null;  // TensorZero episode ID (for assistant messages) (uuid)
  id: string;  // Message ID (uuid)
  role: string;  // Message role: "user" or "assistant"
  thread_id: string;  // Thread ID this message belongs to (uuid)
}

interface IMeta {
  total: number;  // (int64)
}

interface IThreadAttachmentResponseDto {
  content_type: string;  // MIME type of the file
  created_at: string;  // Timestamp when the attachment was created (date-time)
  file_id: string;  // File ID reference (uuid)
  file_size: number;  // Size of the file in bytes (int64)
  id: string;  // Unique identifier for the attachment (uuid)
  original_filename: string;  // Original filename
  thread_id: string;  // Thread ID this attachment belongs to (uuid)
  url: string;  // URL to access the file (presigned URL for private files)
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

interface IUploadAttachmentDto {
  file: string;  // The file to upload (binary)
}

interface IUserRateLimitStatusDto {
  can_chat: boolean;  // Whether the user can still chat (hasn't reached the limit)
  max_reports: number;  // Maximum reports allowed per day (int64)
  max_tickets: number;  // Alias for max_reports (backward compatibility) (int64)
  reports_remaining: number;  // Number of reports remaining before hitting the limit (int64)
  reports_used: number;  // Number of reports the user has created today (int64)
  resets_at: string;  // When the limit resets (next 00:00 WIB in UTC) (date-time)
  tickets_remaining: number;  // Alias for reports_remaining (backward compatibility) (int64)
  tickets_used: number;  // Alias for reports_used (backward compatibility) (int64)
}

interface Icount_attachmentsParams {
  thread_id: string;  // Thread ID (in: path) (uuid)
}

interface Idelete_attachmentParams {
  attachment_id: string;  // Attachment ID (in: path) (uuid)
  thread_id: string;  // Thread ID (in: path) (uuid)
}

interface Iget_threadParams {
  id: string;  // Thread ID (in: path) (uuid)
}

interface Ilist_attachmentsParams {
  thread_id: string;  // Thread ID (in: path) (uuid)
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

interface Iupload_attachmentParams {
  thread_id: string;  // Thread ID (in: path) (uuid)
}

```
