'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  breadcrumbs: BreadcrumbItem[];
  description?: string;
  maxWidth?: 'max-w-3xl' | 'max-w-4xl' | 'max-w-5xl' | 'max-w-6xl';
  actions?: React.ReactNode;
}

export function PageHeader({
  breadcrumbs,
  description,
  maxWidth = 'max-w-6xl',
  actions,
}: PageHeaderProps) {
  return (
    <header className="border-border/50 border-b">
      <div className={cn('mx-auto px-4 py-3', maxWidth)}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <nav className="flex items-center gap-1 text-base">
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
            {description && <p className="text-muted-foreground mt-0.5 text-sm">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>
    </header>
  );
}
