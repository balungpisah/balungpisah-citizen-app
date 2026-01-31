# Files API

---

## API Endpoints

| Method | Endpoint            | Description              | Parameters | Request Body          | Response                             |
| ------ | ------------------- | ------------------------ | ---------- | --------------------- | ------------------------------------ |
| DELETE | `/api/files`        | Delete a file by its URL | -          | `IDeleteFileByUrlDto` | `IApiResponse_DeleteFileResponseDto` |
| POST   | `/api/files/upload` | Upload a file            | -          | `IUploadFileDto`      | `IApiResponse_FileResponseDto`       |

---

## TypeScript Interfaces

```typescript
interface IApiResponse_DeleteFileResponseDto {
  data?: IDeleteFileResponseDto; // Response DTO for delete operations
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IApiResponse_FileResponseDto {
  data?: IFileResponseDto; // Response DTO for file operations
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IDeleteFileByUrlDto {
  url: string; // The URL of the file to delete
}

interface IDeleteFileResponseDto {
  deleted: boolean; // Confirmation that the file was deleted
}

interface IFileResponseDto {
  content_type: string; // MIME type of the file
  created_at: string; // Timestamp when the file was uploaded (date-time)
  file_size: number; // Size of the file in bytes (int64)
  id: string; // Unique identifier for the file (uuid)
  original_filename: string; // Original filename as uploaded
  purpose?: string | null; // Purpose/category of the file
  url: string; // URL to access the file (public URL for public files, presigned URL for private files)
  visibility: IFileVisibilityDto; // File visibility (public or private)
}

interface IFileVisibilityDto {}

interface IMeta {
  total: number; // (int64)
}

interface IUploadFileDto {
  file: string; // The file to upload (binary)
  purpose?: string | null; // Optional purpose/category for the file
  visibility?: string | null; // File visibility: "public" (default) or "private"
}
```
