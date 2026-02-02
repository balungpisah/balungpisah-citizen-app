# Rate Limits API

---

## API Endpoints

| Method | Endpoint                       | Description                                    | Parameters                        | Request Body                | Response                                      |
| ------ | ------------------------------ | ---------------------------------------------- | --------------------------------- | --------------------------- | --------------------------------------------- |
| GET    | `/api/admin/rate-limits`       | List all rate limit configurations             | -                                 | -                           | `IApiResponse_Vec_RateLimitConfigResponseDto` |
| GET    | `/api/admin/rate-limits/{key}` | Get a specific rate limit configuration by key | `Iget_rate_limit_configParams`    | -                           | `IApiResponse_RateLimitConfigResponseDto`     |
| PUT    | `/api/admin/rate-limits/{key}` | Update a rate limit configuration value        | `Iupdate_rate_limit_configParams` | `IUpdateRateLimitConfigDto` | `IApiResponse_RateLimitConfigResponseDto`     |

---

## TypeScript Interfaces

```typescript
interface IApiResponse_RateLimitConfigResponseDto {
  data?: IRateLimitConfigResponseDto; // Response DTO for rate limit configuration
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IApiResponse_Vec_RateLimitConfigResponseDto {
  data?: IRateLimitConfigResponseDto[];
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IMeta {
  total: number; // (int64)
}

interface IRateLimitConfigResponseDto {
  description?: string | null;
  key: string;
  updated_at: string; // (date-time)
  value: number; // (int32)
}

interface IUpdateRateLimitConfigDto {
  value: number; // (int32)
}

interface Iget_rate_limit_configParams {
  key: string; // Configuration key (in: path)
}

interface Iupdate_rate_limit_configParams {
  key: string; // Configuration key (in: path)
}
```
