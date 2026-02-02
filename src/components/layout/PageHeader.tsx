'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  /** Page title */
  title: string;
  /** Page description */
  description?: string;
  /** Breadcrumb items (optional) */
  breadcrumbs?: BreadcrumbItem[];
  /** Max width class (default: max-w-6xl) */
  maxWidth?: 'max-w-3xl' | 'max-w-4xl' | 'max-w-5xl' | 'max-w-6xl';
  /** Right side content (e.g., action buttons) */
  actions?: React.ReactNode;
}

/**
 * Reusable page header with optional breadcrumbs
 *
 * Provides consistent styling across all pages.
 */
export function PageHeader({
  title,
  description,
  breadcrumbs,
  maxWidth = 'max-w-6xl',
  actions,
}: PageHeaderProps) {
  return (
    <header className="border-border/50 border-b">
      <div className={cn('mx-auto px-4 py-4', maxWidth)}>
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-2 flex items-center gap-1 text-sm">
            {breadcrumbs.map((item, index) => (
              <span key={index} className="flex items-center gap-1">
                {index > 0 && <ChevronRight className="text-muted-foreground size-3" />}
                {item.href ? (
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-foreground font-medium">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        {/* Title and Actions */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-lg font-bold">{title}</h1>
            {description && <p className="text-muted-foreground text-sm">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>
    </header>
  );
}
