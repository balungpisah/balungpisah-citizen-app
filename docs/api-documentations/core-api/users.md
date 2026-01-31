# Users API

---

## API Endpoints

| Method | Endpoint                | Description | Parameters | Request Body                | Response                              |
| ------ | ----------------------- | ----------- | ---------- | --------------------------- | ------------------------------------- |
| GET    | `/api/users/me`         | -           | -          | -                           | `IApiResponse_UserProfileResponseDto` |
| PATCH  | `/api/users/me`         | -           | -          | `IUpdateBasicProfileDto`    | `IApiResponse_UserProfileResponseDto` |
| PATCH  | `/api/users/me/profile` | -           | -          | `IUpdateExtendedProfileDto` | `IApiResponse_ExtendedProfileDto`     |

---

## TypeScript Interfaces

```typescript
interface IApiResponse_ExtendedProfileDto {
  data?: IExtendedProfileDto; // Extended profile following OIDC standard claims
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IApiResponse_UserProfileResponseDto {
  data?: IUserProfileResponseDto; // Complete user profile response
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IExtendedProfileDto {
  birthdate?: string | null;
  familyName?: string | null;
  gender?: string | null;
  givenName?: string | null;
  locale?: string | null;
  nickname?: string | null;
  website?: string | null;
  zoneinfo?: string | null;
}

interface IMeta {
  total: number; // (int64)
}

interface IUpdateBasicProfileDto {
  avatar?: string | null;
  name?: string | null;
  username?: string | null;
}

interface IUpdateExtendedProfileDto {
  birthdate?: string | null;
  familyName?: string | null;
  gender?: string | null;
  givenName?: string | null;
  locale?: string | null;
  nickname?: string | null;
  website?: string | null;
  zoneinfo?: string | null;
}

interface IUserProfileResponseDto {
  avatar?: string | null;
  createdAt?: number | null; // (int64)
  id: string;
  name?: string | null;
  primaryEmail?: string | null;
  primaryPhone?: string | null;
  profile: IExtendedProfileDto;
  roles: string[];
  updatedAt?: number | null; // (int64)
  username?: string | null;
}
```
