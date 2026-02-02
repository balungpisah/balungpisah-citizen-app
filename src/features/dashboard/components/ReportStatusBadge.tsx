import { cn } from '@/lib/utils';
import type { IReportStatus } from '@/features/dashboard/types';
import { STATUS_LABELS } from '@/features/dashboard/types';

interface ReportStatusBadgeProps {
  status: IReportStatus | undefined | null;
  className?: string;
}

const statusStyles: Record<IReportStatus, string> = {
  draft: 'bg-status-draft text-foreground',
  pending: 'bg-status-pending text-white',
  verified: 'bg-status-verified text-white',
  in_progress: 'bg-status-in-progress text-white',
  resolved: 'bg-status-resolved text-white',
  rejected: 'bg-status-rejected text-white',
};

const DEFAULT_STYLE = 'bg-muted text-muted-foreground';

export function ReportStatusBadge({ status, className }: ReportStatusBadgeProps) {
  const safeStatus = status && statusStyles[status] ? status : null;
  const style = safeStatus ? statusStyles[safeStatus] : DEFAULT_STYLE;
  const label = safeStatus ? STATUS_LABELS[safeStatus] : '-';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        style,
        className
      )}
    >
      {label}
    </span>
  );
}
