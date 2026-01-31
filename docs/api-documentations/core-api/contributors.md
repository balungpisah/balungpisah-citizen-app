# Contributors API

---

## API Endpoints

| Method | Endpoint                     | Description                | Parameters | Request Body            | Response                              |
| ------ | ---------------------------- | -------------------------- | ---------- | ----------------------- | ------------------------------------- |
| POST   | `/api/contributors/register` | Register a new contributor | -          | `ICreateContributorDto` | `IApiResponse_ContributorResponseDto` |

---

## TypeScript Interfaces

```typescript
interface IApiResponse_ContributorResponseDto {
  data?: IContributorResponseDto; // Response DTO for contributor registration
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IContributorResponseDto {
  id: string; // (uuid)
  submission_type: string;
}

interface ICreateContributorDto {
  agreed?: boolean;
  aspiration?: string | null;
  bio?: string | null;
  city?: string | null;
  contact_email?: string | null;
  contact_name?: string | null;
  contact_position?: string | null;
  contact_whatsapp?: string | null;
  contribution_offer?: string | null;
  email?: string | null;
  name?: string | null;
  organization_name?: string | null;
  organization_type?: string | null;
  portfolio_url?: string | null;
  role?: string | null;
  skills?: string | null;
  submission_type: string; // Submission type: "personal" or "organization"
  whatsapp?: string | null;
}

interface IMeta {
  total: number; // (int64)
}
```
