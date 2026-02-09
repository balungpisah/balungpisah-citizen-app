/**
 * Dashboard Types
 * API DTOs for dashboard endpoints - matching core-api/dashboard.md
 */

// ==================== Enums ====================

export type IReportStatus =
  | 'draft'
  | 'pending'
  | 'verified'
  | 'in_progress'
  | 'resolved'
  | 'rejected';

export type IReportTagType = 'normal' | 'important' | 'urgent' | 'critical';

export type IReportSeverity = 'low' | 'medium' | 'high' | 'critical';

// ==================== Nested Types ====================

export interface IReportCategoryInfo {
  category_id: string;
  name: string;
  slug: string;
  severity: IReportSeverity;
  color?: string | null;
  icon?: string | null;
}

export interface IReportLocationInfo {
  raw_input: string;
  display_name?: string | null;
  lat?: number | null;
  lon?: number | null;
  road?: string | null;
  city?: string | null;
  state?: string | null;
  province_id?: string | null;
  province_name?: string | null;
  regency_id?: string | null;
  regency_name?: string | null;
}

// ==================== Dashboard Summary ====================

export interface IDashboardSummaryDto {
  total_reports: number;
  pending_count: number;
  resolved_count: number;
  reports_this_week: number;
  reports_this_month: number;
}

// ==================== Dashboard Report Item ====================

export interface IDashboardReportDto {
  id: string;
  title: string;
  description: string;
  status: IReportStatus;
  tag_type?: IReportTagType | null;
  categories: IReportCategoryInfo[];
  location?: IReportLocationInfo | null;
  impact?: string | null;
  timeline?: string | null;
  created_at: string;
}

// ==================== Category Overview ====================

export interface ICategoryReportSummary {
  id: string;
  name: string;
  slug: string;
  report_count: number;
  color?: string | null;
  description?: string | null;
  icon?: string | null;
}

export interface IPaginationMeta {
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
}

export interface IDashboardCategoryOverviewDto {
  categories: ICategoryReportSummary[];
  pagination?: IPaginationMeta | null;
  reports?: IDashboardReportDto[] | null;
}

// ==================== Recent Reports ====================

export interface IDashboardRecentDto {
  reports: IDashboardReportDto[];
  days: number;
  total_count: number;
}

// ==================== Report Detail ====================

export interface IDashboardReportDetailDto {
  id: string;
  ticket_id: string;
  title: string;
  description: string;
  status: IReportStatus;
  tag_type?: IReportTagType | null;
  categories: IReportCategoryInfo[];
  location?: IReportLocationInfo | null;
  impact?: string | null;
  timeline?: string | null;
  resolution_notes?: string | null;
  created_at: string;
  updated_at: string;
  verified_at?: string | null;
  resolved_at?: string | null;
}

// ==================== Status Display Helpers ====================

export const STATUS_LABELS: Record<IReportStatus, string> = {
  draft: 'Draf',
  pending: 'Menunggu',
  verified: 'Terverifikasi',
  in_progress: 'Proses',
  resolved: 'Selesai',
  rejected: 'Ditolak',
};

export const STATUS_COLORS: Record<IReportStatus, string> = {
  draft: 'bg-status-draft',
  pending: 'bg-status-pending',
  verified: 'bg-status-verified',
  in_progress: 'bg-status-in-progress',
  resolved: 'bg-status-resolved',
  rejected: 'bg-status-rejected',
};

// ==================== Tag Overview ====================

export interface ITagReportSummary {
  tag_type: IReportTagType;
  label: string;
  report_count: number;
}

export interface IDashboardTagOverviewDto {
  tags: ITagReportSummary[];
  pagination?: IPaginationMeta | null;
  reports?: IDashboardReportDto[] | null;
}

// ==================== Tag Display Helpers ====================

export const TAG_LABELS: Record<IReportTagType, string> = {
  normal: 'Normal',
  important: 'Penting',
  urgent: 'Mendesak',
  critical: 'Kritis',
};

export const TAG_COLORS: Record<IReportTagType, string> = {
  normal: 'bg-muted text-muted-foreground',
  important: 'bg-info text-info-foreground',
  urgent: 'bg-warning text-warning-foreground',
  critical: 'bg-destructive text-destructive-foreground',
};

// ==================== Map & Stats (v2 Dashboard) ====================

export interface IMapMarker {
  id: string;
  reference_number: string;
  title: string;
  lat: number;
  lon: number;
  max_severity: 'critical' | 'high' | 'medium' | 'low';
  primary_category_name?: string;
  primary_category_color?: string;
  tag_type?: string;
  status: string;
  created_at: string;
}

export interface IEnhancedMapData {
  markers: IMapMarker[];
  total_count: number;
}

export interface IComprehensiveStats {
  total: number;
  by_severity: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  by_status: {
    verified: number;
    pending: number;
    rejected: number;
  };
  by_tag: {
    report: number;
    complaint: number;
    proposal: number;
    inquiry: number;
    appreciation: number;
  };
  by_category: Array<{
    category_id: string;
    category_name: string;
    count: number;
  }>;
  by_period: Array<{
    week: string;
    count: number;
  }>;
  by_region: Array<{
    region_id: string;
    region_name: string;
    region_type: string;
    count: number;
  }>;
}

export interface IProvince {
  id: string;
  name: string;
  code: string;
}

export interface IRegency {
  id: string;
  name: string;
  code: string;
  province_id: string;
}

export interface IDashboardRecentPaginatedDto {
  days: number;
  pagination: IPaginationMeta;
  reports: IDashboardReportDto[];
  total_count: number;
}
