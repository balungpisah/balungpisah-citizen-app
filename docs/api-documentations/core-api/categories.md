# Categories API

---

## API Endpoints

| Method | Endpoint                 | Description                | Parameters               | Request Body | Response                               |
| ------ | ------------------------ | -------------------------- | ------------------------ | ------------ | -------------------------------------- |
| GET    | `/api/categories`        | List all active categories | `Ilist_categoriesParams` | -            | `IApiResponse_Vec_CategoryResponseDto` |
| GET    | `/api/categories/{slug}` | Get category by slug       | `Iget_categoryParams`    | -            | `IApiResponse_CategoryResponseDto`     |

---

## TypeScript Interfaces

```typescript
interface IApiResponse_CategoryResponseDto {
  data?: ICategoryResponseDto; // Response DTO for category
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IApiResponse_Vec_CategoryResponseDto {
  data?: ICategoryResponseDto[];
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface ICategoryResponseDto {
  color?: string | null;
  description?: string | null;
  display_order: number; // (int32)
  icon?: string | null;
  id: string; // (uuid)
  name: string;
  parent_id?: string | null; // (uuid)
  slug: string;
}

interface IMeta {
  total: number; // (int64)
}

interface Iget_categoryParams {
  slug: string; // Category slug (in: path)
}

interface Ilist_categoriesParams {
  tree?: boolean; // Return tree structure if true (in: query)
}
```
