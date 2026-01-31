import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ACCESS_TOKEN_COOKIE } from '@/features/auth/services/token-service';

/**
 * Lightweight auth check endpoint
 * Returns { authenticated: boolean } based on access token cookie existence
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE);

    // Check if access token exists
    const authenticated = !!accessToken?.value;

    return NextResponse.json(
      { authenticated },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('[Auth Check] Error:', error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
