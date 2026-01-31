/**
 * JWT Utilities
 *
 * Single source of truth for JWT decoding and validation.
 * Works in both browser and server environments.
 */

export interface JwtPayload {
  sub?: string;
  exp?: number;
  iat?: number;
  aud?: string | string[];
  iss?: string;
  // Logto specific claims
  picture?: string;
  email?: string;
  email_verified?: boolean;
  phone_number?: string;
  [key: string]: unknown;
}

/**
 * Decode base64url string (works in both browser and server)
 */
function base64UrlDecode(input: string): string {
  // Replace URL-safe characters
  let str = input.replace(/-/g, '+').replace(/_/g, '/');

  // Add padding if needed
  const pad = str.length % 4;
  if (pad === 2) str += '==';
  else if (pad === 3) str += '=';

  // Decode based on environment
  if (typeof window !== 'undefined') {
    // Browser
    try {
      return atob(str);
    } catch {
      return '';
    }
  } else {
    // Server (Node.js)
    return Buffer.from(str, 'base64').toString('utf-8');
  }
}

/**
 * Decode JWT payload without verification
 * Note: This only decodes, does NOT verify signature
 */
export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payloadJson = base64UrlDecode(parts[1]);
    return JSON.parse(payloadJson) as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * Get token expiration timestamp (in seconds)
 */
export function getTokenExpiration(token: string): number | null {
  const payload = decodeJwtPayload(token);
  return payload?.exp ?? null;
}

/**
 * Check if token is expired
 * @param token - JWT token string
 * @param bufferSeconds - Buffer time before actual expiration (default 0)
 */
export function isTokenExpired(
  token: string | undefined | null,
  bufferSeconds: number = 0
): boolean {
  if (!token) return true;

  const exp = getTokenExpiration(token);
  if (!exp) return true;

  const now = Math.floor(Date.now() / 1000);
  return exp - now <= bufferSeconds;
}

/**
 * Get remaining time until token expires (in seconds)
 * Returns negative if already expired
 */
export function getTokenRemainingTime(token: string): number {
  const exp = getTokenExpiration(token);
  if (!exp) return -1;

  const now = Math.floor(Date.now() / 1000);
  return exp - now;
}
