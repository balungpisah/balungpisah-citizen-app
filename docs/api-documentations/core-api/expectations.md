# Expectations API

---

## API Endpoints

| Method | Endpoint            | Description                               | Parameters | Request Body            | Response                              |
| ------ | ------------------- | ----------------------------------------- | ---------- | ----------------------- | ------------------------------------- |
| POST   | `/api/expectations` | Submit user expectation from landing page | -          | `ICreateExpectationDto` | `IApiResponse_ExpectationResponseDto` |

---

## TypeScript Interfaces

```typescript
interface IApiResponse_ExpectationResponseDto {
  data?: IExpectationResponseDto; // Response DTO for expectation
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface ICreateExpectationDto {
  email?: string | null; // Optional email for follow-up
  expectation: string; // The expectation text (required)
  name?: string | null; // Optional name of the submitter
}

interface IExpectationResponseDto {
  createdAt: string; // (date-time)
  email?: string | null;
  expectation: string;
  id: string; // (uuid)
  name?: string | null;
}

interface IMeta {
  total: number; // (int64)
}
```
