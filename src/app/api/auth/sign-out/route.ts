/**
 * Sign Out API Route
 *
 * Clears all auth cookies and redirects to Logto for sign-out.
 * After Logto sign-out, user is redirected back to /sign-in page.
 */

import { signOut } from '@logto/next/server-actions';
import { getLogtoConfig } from '@/features/auth/config/logto';
import { cookies } from 'next/headers';
import { ACCESS_TOKEN_COOKIE } from '@/features/auth/services/token-service';

export async function GET() {
  const cookieStore = await cookies();

  // Clear access token cookie
  cookieStore.delete(ACCESS_TOKEN_COOKIE);

  // clear all cookies with prefix 'logto_'
  cookieStore.getAll().forEach((cookie) => {
    if (cookie.name.startsWith('logto_')) {
      cookieStore.delete(cookie.name);
    }
  });

  // Get Logto config and sign out
  // Logto will redirect to the post-logout redirect URI configured in Logto console
  // Make sure to configure it as: {baseUrl}/sign-in
  const logtoConfig = getLogtoConfig();

  // Sign out with redirect to sign-in page
  return await signOut(logtoConfig);
}
