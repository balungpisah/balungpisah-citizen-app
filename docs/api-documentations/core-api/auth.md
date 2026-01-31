# Auth API

---

## API Endpoints

| Method | Endpoint             | Description                              | Parameters | Request Body              | Response                               |
| ------ | -------------------- | ---------------------------------------- | ---------- | ------------------------- | -------------------------------------- |
| POST   | `/api/auth/login`    | Login with email and password            | -          | `ILoginRequestDto`        | `IApiResponse_AuthResponseDto`         |
| GET    | `/api/auth/me`       | Get current authenticated user info      | -          | -                         | `IApiResponse_MeResponseDto`           |
| POST   | `/api/auth/refresh`  | Refresh access token using refresh token | -          | `IRefreshTokenRequestDto` | `IApiResponse_RefreshTokenResponseDto` |
| POST   | `/api/auth/register` | Register a new user                      | -          | `IRegisterRequestDto`     | `IApiResponse_AuthResponseDto`         |

---

## TypeScript Interfaces

```typescript
interface IApiResponse_AuthResponseDto {
  data?: IAuthResponseDto; // Response DTO for authentication (register/login)
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IApiResponse_MeResponseDto {
  data?: IAuthenticatedUser; // DTO for /auth/me response
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IApiResponse_RefreshTokenResponseDto {
  data?: IRefreshTokenResponseDto; // Response DTO for token refresh (same structure as auth response but without user info)
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IAuthResponseDto {
  access_token: string; // JWT access token (Logto OIDC token)
  expires_in: number; // Token expiry time in seconds (int64)
  refresh_token?: string | null; // Refresh token for obtaining new access tokens (optional)
  token_type: string; // Token type (always "Bearer")
  user: IAuthUserDto; // Authenticated user info
}

interface IAuthUserDto {
  avatar?: string | null; // Avatar URL (optional)
  email?: string | null; // Email address (optional, may be null if not verified)
  email_verified: boolean; // Whether email is verified
  id: string; // Logto user ID
  name?: string | null; // Display name (optional)
  username?: string | null; // Username (optional)
}

interface IAuthenticatedUser {
  account_id: string;
  roles: string[];
  session_uid?: string | null; // Session UID (only present for interactive OIDC flows, not for token exchange)
  sub: string;
}

interface ILoginRequestDto {
  email: string;
  password: string;
}

interface IMeta {
  total: number; // (int64)
}

interface IRefreshTokenRequestDto {
  refresh_token: string;
}

interface IRefreshTokenResponseDto {
  access_token: string; // New JWT access token
  expires_in: number; // Token expiry time in seconds (int64)
  refresh_token?: string | null; // New refresh token (if rotated)
  token_type: string; // Token type (always "Bearer")
}

interface IRegisterRequestDto {
  email: string;
  password: string;
  username?: string | null;
}
```
