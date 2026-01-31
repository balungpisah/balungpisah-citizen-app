import { signIn } from '@logto/next/server-actions';
import { getLogtoConfig } from '@/features/auth/config/logto';

export async function GET() {
  const logtoConfig = getLogtoConfig();

  // Normal sign-in flow
  return await signIn(logtoConfig);
}
