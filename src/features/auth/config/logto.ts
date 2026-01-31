/**
 * Logto Configuration
 *
 * Server-only config for Logto authentication.
 * Reads directly from environment variables.
 */

import { LogtoNextConfig, UserScope } from '@logto/next';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
}

export function getLogtoConfig(): LogtoNextConfig {
  return {
    endpoint: requireEnv('LOGTO_ENDPOINT'),
    appId: requireEnv('LOGTO_APP_ID'),
    appSecret: requireEnv('LOGTO_APP_SECRET'),
    baseUrl: requireEnv('LOGTO_BASE_URL'),
    cookieSecret: requireEnv('LOGTO_COOKIE_SECRET'),
    cookieSecure: process.env.NODE_ENV === 'production',
    resources: [requireEnv('LOGTO_RESOURCE')],
    scopes: [UserScope.Email, UserScope.Phone, UserScope.CustomData, UserScope.Profile],
  };
}
