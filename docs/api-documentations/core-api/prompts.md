# Prompts API

---

## API Endpoints

| Method | Endpoint                          | Description                                                     | Parameters              | Request Body       | Response                               |
| ------ | --------------------------------- | --------------------------------------------------------------- | ----------------------- | ------------------ | -------------------------------------- |
| GET    | `/api/admin/prompts`              | List all prompts with pagination and filters (super admin only) | `Ilist_promptsParams`   | -                  | `IApiResponse_Vec_PromptResponseDto`   |
| POST   | `/api/admin/prompts`              | Create a new prompt template (super admin only)                 | -                       | `ICreatePromptDto` | `IApiResponse_PromptResponseDto`       |
| GET    | `/api/admin/prompts/keys`         | List all valid prompt keys from the registry (super admin only) | -                       | -                  | `IApiResponse_Vec_PromptKeyDefinition` |
| DELETE | `/api/admin/prompts/{id}`         | Delete a prompt (soft delete, super admin only)                 | `Idelete_promptParams`  | -                  | -                                      |
| GET    | `/api/admin/prompts/{id}`         | Get a prompt by ID (super admin only)                           | `Iget_promptParams`     | -                  | `IApiResponse_PromptResponseDto`       |
| PUT    | `/api/admin/prompts/{id}`         | Update a prompt (super admin only)                              | `Iupdate_promptParams`  | `IUpdatePromptDto` | `IApiResponse_PromptResponseDto`       |
| POST   | `/api/admin/prompts/{id}/restore` | Restore a soft-deleted prompt (super admin only)                | `Irestore_promptParams` | -                  | `IApiResponse_PromptResponseDto`       |

---

## TypeScript Interfaces

```typescript
interface IApiResponse_PromptResponseDto {
  data?: IPromptResponseDto;
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IApiResponse_Vec_PromptKeyDefinition {
  data?: IPromptKeyDefinition[];
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IApiResponse_Vec_PromptResponseDto {
  data?: IPromptResponseDto[];
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface ICreatePromptDto {
  description?: string | null;
  key: string; // Prompt key in format: `agent_name/prompt_type` (snake_case, no .jinja extension)
  name: string;
  template_content: string;
  variables?: any;
}

interface IMeta {
  total: number; // (int64)
}

interface IPromptKeyDefinition {
  description: string; // Human-readable description of what this prompt is used for
  key: string; // The unique prompt key (e.g. "citizen_report_agent/system")
}

interface IPromptResponseDto {
  created_at: string; // (date-time)
  description?: string | null;
  id: string; // (uuid)
  is_active: boolean;
  key: string;
  name: string;
  template_content: string;
  updated_at: string; // (date-time)
  variables?: any;
  version: number; // (int32)
}

interface ISortDirection {}

interface IUpdatePromptDto {
  description?: string | null;
  name?: string | null;
  template_content?: string | null;
  variables?: any;
}

interface Idelete_promptParams {
  id: string; // Prompt ID (in: path) (uuid)
}

interface Iget_promptParams {
  id: string; // Prompt ID (in: path) (uuid)
}

interface Ilist_promptsParams {
  is_active?: boolean | null; // Filter by active status (true = active, false = inactive, none = all) (in: query)
  page?: number; // Page number (1-indexed) (in: query) (min: 1, int64)
  page_size?: number; // Items per page (in: query) (min: 1, max: 100, int64)
  search?: string | null; // Search in key, name, or description (in: query)
  sort?: ISortDirection; // Sort direction (default: desc by created_at) (in: query)
}

interface Irestore_promptParams {
  id: string; // Prompt ID (in: path) (uuid)
}

interface Iupdate_promptParams {
  id: string; // Prompt ID (in: path) (uuid)
}
```
