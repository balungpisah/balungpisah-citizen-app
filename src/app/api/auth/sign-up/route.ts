import { signIn } from '@logto/next/server-actions';
import { getLogtoConfig } from '@/features/auth/config/logto';

export async function GET() {
  const logtoConfig = getLogtoConfig();

  // Sign-up flow with interactionMode
  return await signIn(logtoConfig, {
    redirectUri: `${logtoConfig.baseUrl}/callback`,
    interactionMode: 'signUp',
  });
}
