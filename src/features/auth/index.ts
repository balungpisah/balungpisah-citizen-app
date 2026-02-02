/**
 * Auth Feature Exports
 *
 * NOTE: Server-only utilities (server-token.ts) are NOT exported here
 * to avoid import issues with client components.
 * Import server utilities directly: '@/features/auth/utils/server-token'
 */

// Constants (safe for Edge runtime / middleware)
export {
  ACCESS_TOKEN_COOKIE,
  REDIRECT_PATH_COOKIE,
  REFRESH_BUFFER_SECONDS,
  AUTH_CACHE_TTL,
} from './constants';

// Services
export {
  checkAuthStatus,
  isAuthenticated,
  refreshAuthStatus,
  clearAuthCache,
} from './services/token-service';

// Utils - JWT (works in both client and server)
export {
  decodeJwtPayload,
  getTokenExpiration,
  isTokenExpired,
  getTokenRemainingTime,
  type JwtPayload,
} from './utils/jwt';

// Hooks
export { useAuth } from './hooks/use-auth';

// Types
export type { IUserProfile } from './types';
