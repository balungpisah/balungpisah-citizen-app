/**
 * Logto OAuth Callback Handler
 *
 * This route handles the OAuth callback from Logto after sign-in.
 *
 * Flow:
 * 1. User completes sign-in on Logto
 * 2. Logto redirects to /callback with auth code
 * 3. handleSignIn exchanges code for tokens and sets Logto cookies
 * 4. Redirect to auth processing page
 */

import { handleSignIn } from '@logto/next/server-actions';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';
import { getLogtoConfig } from '@/features/auth/config/logto';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const logtoConfig = getLogtoConfig();

  // Handle the Logto sign-in callback
  await handleSignIn(logtoConfig, searchParams);

  redirect('/auth/processing');
}
