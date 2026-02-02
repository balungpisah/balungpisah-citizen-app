'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuthStatus, clearAuthCache } from '../services/token-service';
import { ROUTES } from '@/components/layout/nav-config';

interface UseAuthReturn {
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
  /** Whether the auth check is still loading */
  isLoading: boolean;
  /** Sign out the user and redirect to home */
  signOut: () => Promise<void>;
  /** Refresh the auth status */
  refresh: () => Promise<void>;
}

/**
 * Client-side authentication hook
 *
 * Wraps the token service to provide reactive auth state for components.
 * Uses the cached auth status to avoid repeated API calls.
 */
export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const authenticated = await checkAuthStatus();
      setIsAuthenticated(authenticated);
    } catch (error) {
      console.error('[useAuth] Error checking auth:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const signOut = useCallback(async () => {
    clearAuthCache();
    setIsAuthenticated(false);
    // Redirect to sign-out endpoint which clears cookies
    router.push(ROUTES.signOut);
  }, [router]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    clearAuthCache();
    await checkAuth();
  }, [checkAuth]);

  return {
    isAuthenticated,
    isLoading,
    signOut,
    refresh,
  };
}
