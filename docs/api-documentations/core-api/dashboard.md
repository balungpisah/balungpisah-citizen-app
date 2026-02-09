# Dashboard API

---

## API Endpoints

| Method | Endpoint                         | Description                                               | Parameters                       | Request Body      | Response                                    |
| ------ | -------------------------------- | --------------------------------------------------------- | -------------------------------- | ----------------- | ------------------------------------------- |
| GET    | `/api/dashboard/by-category`     | Get category overview with optional report listing        | `Iget_by_categoryParams`         | -                 | `IApiResponse_DashboardCategoryOverviewDto` |
| GET    | `/api/dashboard/by-location`     | Get location overview (provinces -> regencies -> reports) | `Iget_by_locationParams`         | -                 | `IApiResponse_DashboardLocationOverviewDto` |
| GET    | `/api/dashboard/by-tag`          | Get tag overview with optional report listing             | `Iget_by_tagParams`              | -                 | `IApiResponse_DashboardTagOverviewDto`      |
| GET    | `/api/dashboard/map`             | Get map markers for reports with coordinates              | `Iget_mapParams`                 | -                 | `IApiResponse_DashboardMapDto`              |
| GET    | `/api/dashboard/map-data`        | -                                                         | `Iget_map_dataParams`            | -                 | `IApiResponse_DashboardMapDataDto`          |
| GET    | `/api/dashboard/recent`          | Get recent reports (last N days)                          | `Iget_recentParams`              | -                 | `IApiResponse_DashboardRecentDto`           |
| GET    | `/api/dashboard/reports`         | List all reports with pagination, sorting, and search     | `Ilist_reportsParams`            | -                 | `IApiResponse_Vec_DashboardReportDto`       |
| POST   | `/api/dashboard/reports/cluster` | Perform cluster analysis on reports                       | -                                | `IClusterRequest` | `IApiResponse_ClusterAnalysisDto`           |
| GET    | `/api/dashboard/reports/markers` | Get enhanced map markers with comprehensive filtering     | `Iget_enhanced_markersParams`    | -                 | `IApiResponse_EnhancedMapDto`               |
| GET    | `/api/dashboard/reports/stats`   | Get comprehensive dashboard statistics                    | `Iget_comprehensive_statsParams` | -                 | `IApiResponse_ComprehensiveStatsDto`        |
| GET    | `/api/dashboard/reports/{id}`    | Get single report detail                                  | `Iget_reportParams`              | -                 | `IApiResponse_DashboardReportDetailDto`     |
| GET    | `/api/dashboard/summary`         | Get lightweight dashboard summary                         | -                                | -                 | `IApiResponse_DashboardSummaryDto`          |

---

## TypeScript Interfaces

```typescript
interface IApiResponse_ClusterAnalysisDto {
  data?: IClusterAnalysisDto; // Cluster analysis response
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IApiResponse_ComprehensiveStatsDto {
  data?: IComprehensiveStatsDto; // Comprehensive dashboard statistics
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IApiResponse_DashboardCategoryOverviewDto {
  data?: IDashboardCategoryOverviewDto; // Category overview
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IApiResponse_DashboardLocationOverviewDto {
  data?: IDashboardLocationOverviewDto; // Location overview with provinces and optional regencies
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IApiResponse_DashboardMapDataDto {
  data?: IDashboardMapDataDto;
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IApiResponse_DashboardMapDto {
  data?: IDashboardMapDto; // Map data response
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IApiResponse_DashboardRecentDto {
  data?: IDashboardRecentDto; // Recent reports response
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IApiResponse_DashboardReportDetailDto {
  data?: IDashboardReportDetailDto; // Report detail with full information
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IApiResponse_DashboardSummaryDto {
  data?: IDashboardSummaryDto; // Lightweight summary for dashboard header
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IApiResponse_DashboardTagOverviewDto {
  data?: IDashboardTagOverviewDto; // Tag overview
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IApiResponse_EnhancedMapDto {
  data?: IEnhancedMapDto; // Enhanced map response
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IApiResponse_Vec_DashboardReportDto {
  data?: IDashboardReportDto[];
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface ICategoryCount {
  category_id: string; // (uuid)
  category_name: string;
  count: number; // (int64)
}

interface ICategoryReportSummary {
  color?: string | null;
  description?: string | null;
  icon?: string | null;
  id: string; // (uuid)
  name: string;
  report_count: number; // (int64)
  slug: string;
}

interface IClusterAnalysisDto {
  clusters: IReportCluster[];
  total_clusters: number; // (int64)
  total_reports: number; // (int64)
}

interface IClusterMode {}

interface IClusterRequest {
  bounds?: string | null; // Viewport bounds (sw_lat,sw_lon,ne_lat,ne_lon)
  category_ids?: string | null; // Filter by category IDs (comma-separated UUIDs)
  date_from?: string | null; // Filter by date from (ISO 8601)
  date_to?: string | null; // Filter by date to (ISO 8601)
  district_id?: string | null; // Filter by district ID (uuid)
  limit?: number; // Maximum markers to return (int64)
  mode: IClusterMode; // Clustering mode
  province_id?: string | null; // Filter by province ID (uuid)
  radius_km?: number; // Radius in kilometers for proximity clustering (default: 1.0) (double)
  regency_id?: string | null; // Filter by regency ID (uuid)
  severity?: string | null; // Filter by severity (comma-separated: low,medium,high,critical)
  status?: string | null; // Filter by status (comma-separated: verified,pending,rejected)
  tag_types?: string | null; // Filter by tag types (comma-separated: report,complaint,proposal,inquiry,appreciation)
  village_id?: string | null; // Filter by village ID (uuid)
}

interface IComprehensiveStatsDto {
  by_category: ICategoryCount[];
  by_period: IWeeklyCount[];
  by_region: IRegionCount[];
  by_severity: ISeverityBreakdown;
  by_status: IStatusBreakdown;
  by_tag: ITagBreakdown;
  total: number; // (int64)
}

interface IDashboardCategoryOverviewDto {
  categories: ICategoryReportSummary[];
  pagination?: any | IPaginationMeta;
  reports?: IDashboardReportDto[] | null; // Reports (only if slug filter applied)
}

interface IDashboardLocationOverviewDto {
  pagination?: any | IPaginationMeta;
  provinces: IProvinceReportSummary[];
  regencies?: IRegencyReportSummary[] | null; // Regencies (only if province_id filter applied)
  reports?: IDashboardReportDto[] | null; // Reports (only if regency_id filter applied)
}

interface IDashboardMapDataDto {
  points: IMapPointDto[];
}

interface IDashboardMapDto {
  bounds?: number[] | null; // Bounding box [min_lat, min_lon, max_lat, max_lon]
  markers: IMapReportMarker[];
  total_count: number; // (int64)
}

interface IDashboardRecentDto {
  days: number; // (int32)
  pagination: IPaginationMeta;
  reports: IDashboardReportDto[];
  total_count: number; // (int64)
}

interface IDashboardReportDetailDto {
  categories: IReportCategoryInfo[];
  created_at: string; // (date-time)
  description?: string | null; // Report description (may be None for unprocessed reports)
  id: string; // (uuid)
  impact?: string | null;
  location?: any | IReportLocationInfo;
  reference_number?: string | null; // Report reference number
  resolution_notes?: string | null;
  resolved_at?: string | null; // (date-time)
  status: IReportStatus;
  tag_type?: any | IReportTagType;
  timeline?: string | null;
  title?: string | null; // Report title (may be None for unprocessed reports)
  updated_at: string; // (date-time)
  verified_at?: string | null; // (date-time)
}

interface IDashboardReportDto {
  categories: IReportCategoryInfo[];
  created_at: string; // (date-time)
  description?: string | null; // Report description (may be None for unprocessed reports)
  id: string; // (uuid)
  impact?: string | null;
  location?: any | IReportLocationInfo;
  status: IReportStatus;
  tag_type?: any | IReportTagType;
  timeline?: string | null;
  title?: string | null; // Report title (may be None for unprocessed reports)
}

interface IDashboardSummaryDto {
  pending_count: number; // (int64)
  reports_this_month: number; // (int64)
  reports_this_week: number; // (int64)
  resolved_count: number; // (int64)
  total_reports: number; // (int64)
}

interface IDashboardTagOverviewDto {
  pagination?: any | IPaginationMeta;
  reports?: IDashboardReportDto[] | null; // Reports (only if tag_type filter applied)
  tags: ITagReportSummary[];
}

interface IDateRange {
  from: string; // (date-time)
  to: string; // (date-time)
}

interface IEnhancedMapDto {
  markers: IEnhancedMapMarker[];
  total_count: number; // (int64)
}

interface IEnhancedMapMarker {
  created_at: string; // (date-time)
  id: string; // (uuid)
  lat: number; // (double)
  lon: number; // (double)
  max_severity: IReportSeverity;
  primary_category_color?: string | null;
  primary_category_name?: string | null;
  reference_number?: string | null;
  status: IReportStatus;
  tag_type?: any | IReportTagType;
  title?: string | null;
}

interface IMapPointDto {
  category_color?: string | null;
  id: string; // (uuid)
  lat: number; // (double)
  lon: number; // (double)
  status: IReportStatus;
}

interface IMapReportMarker {
  category_color?: string | null;
  category_slug?: string | null;
  created_at: string; // (date-time)
  id: string; // (uuid)
  lat: number; // (double)
  lon: number; // (double)
  status: IReportStatus;
  title?: string | null; // Report title (may be None for unprocessed reports)
}

interface IMeta {
  total: number; // (int64)
}

interface IPaginationMeta {
  page: number; // (int64)
  page_size: number; // (int64)
  total_items: number; // (int64)
  total_pages: number; // (int64)
}

interface IProvinceReportSummary {
  code: string;
  id: string; // (uuid)
  lat?: number | null; // (double)
  lng?: number | null; // (double)
  name: string;
  report_count: number; // (int64)
}

interface IRegencyReportSummary {
  code: string;
  id: string; // (uuid)
  lat?: number | null; // (double)
  lng?: number | null; // (double)
  name: string;
  province_id: string; // (uuid)
  report_count: number; // (int64)
}

interface IRegionCount {
  count: number; // (int64)
  region_id: string; // (uuid)
  region_name: string;
  region_type: string;
}

interface IReportCategoryInfo {
  category_id: string; // (uuid)
  color?: string | null;
  icon?: string | null;
  name: string;
  severity: IReportSeverity;
  slug: string;
}

interface IReportCluster {
  center_lat: number; // Cluster center latitude (double)
  center_lon: number; // Cluster center longitude (double)
  citizen_count: number; // Number of unique citizens (int64)
  cluster_id: string; // Generated cluster ID
  date_range: IDateRange; // Date range of reports in cluster
  dominant_category: string; // Most common category
  label: string; // Auto-generated label: "[category] — [area]"
  max_severity: IReportSeverity; // Highest severity in cluster
  report_count: number; // Number of reports in cluster (int64)
  report_ids: string[]; // Report IDs in this cluster
}

interface IReportLocationInfo {
  city?: string | null;
  display_name?: string | null;
  lat?: number | null; // (double)
  lon?: number | null; // (double)
  province_id?: string | null; // (uuid)
  province_name?: string | null;
  raw_input: string;
  regency_id?: string | null; // (uuid)
  regency_name?: string | null;
  road?: string | null;
  state?: string | null;
}

interface IReportSeverity {}

interface IReportSortBy {}

interface IReportStatus {}

interface IReportTagType {}

interface ISeverityBreakdown {
  critical: number; // (int64)
  high: number; // (int64)
  low: number; // (int64)
  medium: number; // (int64)
}

interface ISortDirection {}

interface IStatusBreakdown {
  draft: number; // (int64)
  verified: number; // (int64)
}

interface ITagBreakdown {
  appreciation: number; // (int64)
  complaint: number; // (int64)
  inquiry: number; // (int64)
  proposal: number; // (int64)
  report: number; // (int64)
}

interface ITagReportSummary {
  label: string;
  report_count: number; // (int64)
  tag_type: IReportTagType;
}

interface IWeeklyCount {
  count: number; // (int64)
  week: string;
}

interface Iget_by_categoryParams {
  page?: number; // Page number (1-indexed) (in: query) (min: 1, int64)
  page_size?: number; // Number of items per page (in: query) (min: 1, max: 100, int64)
  slug?: string | null; // Category slug to filter by (in: query)
}

interface Iget_by_locationParams {
  page?: number; // Page number (1-indexed) (in: query) (min: 1, int64)
  page_size?: number; // Number of items per page (in: query) (min: 1, max: 100, int64)
  province_id?: string | null; // Filter by province ID (in: query) (uuid)
  regency_id?: string | null; // Filter by regency ID (in: query) (uuid)
}

interface Iget_by_tagParams {
  page?: number; // Page number (1-indexed) (in: query) (min: 1, int64)
  page_size?: number; // Number of items per page (in: query) (min: 1, max: 100, int64)
  tag_type?: any | IReportTagType; // Tag type to filter by (in: query)
}

interface Iget_comprehensive_statsParams {
  bounds?: string | null; // Viewport bounds (sw_lat,sw_lon,ne_lat,ne_lon) (in: query)
  category_ids?: string | null; // Filter by category IDs (comma-separated UUIDs) (in: query)
  date_from?: string | null; // Filter by date from (ISO 8601) (in: query)
  date_to?: string | null; // Filter by date to (ISO 8601) (in: query)
  district_id?: string | null; // Filter by district ID (in: query) (uuid)
  limit?: number; // Maximum markers to return (in: query) (int64)
  province_id?: string | null; // Filter by province ID (in: query) (uuid)
  regency_id?: string | null; // Filter by regency ID (in: query) (uuid)
  severity?: string | null; // Filter by severity (comma-separated: low,medium,high,critical) (in: query)
  status?: string | null; // Filter by status (comma-separated: verified,pending,rejected) (in: query)
  tag_types?: string | null; // Filter by tag types (comma-separated: report,complaint,proposal,inquiry,appreciation) (in: query)
  village_id?: string | null; // Filter by village ID (in: query) (uuid)
}

interface Iget_enhanced_markersParams {
  bounds?: string | null; // Viewport bounds (sw_lat,sw_lon,ne_lat,ne_lon) (in: query)
  category_ids?: string | null; // Filter by category IDs (comma-separated UUIDs) (in: query)
  date_from?: string | null; // Filter by date from (ISO 8601) (in: query)
  date_to?: string | null; // Filter by date to (ISO 8601) (in: query)
  district_id?: string | null; // Filter by district ID (in: query) (uuid)
  limit?: number; // Maximum markers to return (in: query) (int64)
  province_id?: string | null; // Filter by province ID (in: query) (uuid)
  regency_id?: string | null; // Filter by regency ID (in: query) (uuid)
  severity?: string | null; // Filter by severity (comma-separated: low,medium,high,critical) (in: query)
  status?: string | null; // Filter by status (comma-separated: verified,pending,rejected) (in: query)
  tag_types?: string | null; // Filter by tag types (comma-separated: report,complaint,proposal,inquiry,appreciation) (in: query)
  village_id?: string | null; // Filter by village ID (in: query) (uuid)
}

interface Iget_mapParams {
  category?: string | null; // Filter by category slug (in: query)
  limit?: number; // Maximum markers to return (in: query) (int64)
  province_id?: string | null; // Filter by province ID (in: query) (uuid)
  regency_id?: string | null; // Filter by regency ID (in: query) (uuid)
  status?: any | IReportStatus; // Filter by status (in: query)
}

interface Iget_map_dataParams {
  page?: number; // Page number (1-indexed) (in: query) (min: 1, int64)
  page_size?: number; // Number of items per page (in: query) (min: 1, max: 100, int64)
  province_id?: string | null; // Filter by province ID (in: query) (uuid)
  regency_id?: string | null; // Filter by regency ID (in: query) (uuid)
}

interface Iget_recentParams {
  days?: number; // Number of days to look back (default: 7) (in: query) (int32)
  limit?: number | null; // Alias for page_size (backward compatibility) (in: query) (int64)
  page?: number; // Page number (1-indexed) (in: query) (min: 1, int64)
  page_size?: number; // Number of items per page (in: query) (min: 1, max: 100, int64)
  search?: string | null; // Search by report title (in: query)
}

interface Iget_reportParams {
  id: string; // Report ID (in: path) (uuid)
}

interface Ilist_reportsParams {
  from_date?: string | null; // Filter from date (YYYY-MM-DD) (in: query) (date)
  has_attachments?: boolean | null; // Filter reports with attachments only (in: query)
  page?: number; // Page number (1-indexed) (in: query) (min: 1, int64)
  page_size?: number; // Items per page (in: query) (min: 1, max: 100, int64)
  platform?: string | null; // Filter by platform (in: query)
  search?: string | null; // Search in reference_number or title (in: query)
  sort?: ISortDirection; // Sort direction (default: desc) (in: query)
  sort_by?: IReportSortBy; // Sort by field (default: created_at) (in: query)
  status?: any | IReportStatus; // Filter by status (in: query)
  to_date?: string | null; // Filter to date (YYYY-MM-DD) (in: query) (date)
  user_id?: string | null; // Filter by user_id (in: query)
}
```
