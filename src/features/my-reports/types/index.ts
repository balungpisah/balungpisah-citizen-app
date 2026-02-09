/**
 * My Reports Types
 * Based on GET /api/reports - List reports for authenticated user
 */

// Re-export common types from dashboard
export type { IReportStatus, IReportTagType, IReportSeverity } from '@/features/dashboard/types';

export { STATUS_LABELS, STATUS_COLORS, TAG_LABELS, TAG_COLORS } from '@/features/dashboard/types';

/**
 * Report category info
 */
export interface IReportCategoryDto {
  category_id: string;
  category_name?: string | null;
  category_slug?: string | null;
  severity: 'low' | 'medium' | 'high' | 'critical';
  color?: string | null;
}

/**
 * Report tag info
 */
export interface IReportTagDto {
  tag_type: 'normal' | 'important' | 'urgent' | 'critical';
}

/**
 * User's report item from GET /api/reports
 */
export interface IMyReportDto {
  id: string;
  ticket_id: string;
  title?: string | null;
  description?: string | null;
  status: 'draft' | 'pending' | 'verified' | 'in_progress' | 'resolved' | 'rejected' | 'closed';
  categories?: IReportCategoryDto[];
  tags?: IReportTagDto[];
  cluster_id?: string | null;
  impact?: string | null;
  timeline?: string | null;
  location_display_name?: string | null;
  reference_number?: string | null;
  created_at: string;
  updated_at: string;
  verified_at?: string | null;
  resolved_at?: string | null;
}
