'use client';

import { ReactNode } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { ChatNavbar } from './ChatNavbar';

interface LaporWrapperProps {
  children: ReactNode;
}

/**
 * Wrapper for Lapor pages
 *
 * Uses AppShell with:
 * - Custom ChatNavbar (consistent styling with TopNavbar)
 * - Full-height layout for chat interface
 * - Bottom nav hidden (via nav-config)
 */
export function LaporWrapper({ children }: LaporWrapperProps) {
  return (
    <AppShell customHeader={<ChatNavbar />} fullHeight>
      {children}
    </AppShell>
  );
}
