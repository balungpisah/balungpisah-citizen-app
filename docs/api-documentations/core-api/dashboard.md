# Dashboard API

---

## API Endpoints

| Method | Endpoint                      | Description                                               | Parameters               | Request Body | Response                                    |
| ------ | ----------------------------- | --------------------------------------------------------- | ------------------------ | ------------ | ------------------------------------------- |
| GET    | `/api/dashboard/by-category`  | Get category overview with optional report listing        | `Iget_by_categoryParams` | -            | `IApiResponse_DashboardCategoryOverviewDto` |
| GET    | `/api/dashboard/by-location`  | Get location overview (provinces -> regencies -> reports) | `Iget_by_locationParams` | -            | `IApiResponse_DashboardLocationOverviewDto` |
| GET    | `/api/dashboard/by-tag`       | Get tag overview with optional report listing             | `Iget_by_tagParams`      | -            | `IApiResponse_DashboardTagOverviewDto`      |
| GET    | `/api/dashboard/map`          | Get map markers for reports with coordinates              | `Iget_mapParams`         | -            | `IApiResponse_DashboardMapDto`              |
| GET    | `/api/dashboard/map-data`     | -                                                         | `Iget_map_dataParams`    | -            | `IApiResponse_DashboardMapDataDto`          |
| GET    | `/api/dashboard/recent`       | Get recent reports (last N days)                          | `Iget_recentParams`      | -            | `IApiResponse_DashboardRecentDto`           |
| GET    | `/api/dashboard/reports`      | List all reports with pagination                          | `Ilist_reportsParams`    | -            | `IApiResponse_Vec_DashboardReportDto`       |
| GET    | `/api/dashboard/reports/{id}` | Get single report detail                                  | `Iget_reportParams`      | -            | `IApiResponse_DashboardReportDetailDto`     |
| GET    | `/api/dashboard/summary`      | Get lightweight dashboard summary                         | -                        | -            | `IApiResponse_DashboardSummaryDto`          |

---

## TypeScript Interfaces

```typescript
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

interface IApiResponse_Vec_DashboardReportDto {
  data?: IDashboardReportDto[];
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
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
  reports: IDashboardReportDto[];
  total_count: number; // (int64)
}

interface IDashboardReportDetailDto {
  categories: IReportCategoryInfo[];
  created_at: string; // (date-time)
  description: string;
  id: string; // (uuid)
  impact?: string | null;
  location?: any | IReportLocationInfo;
  resolution_notes?: string | null;
  resolved_at?: string | null; // (date-time)
  status: IReportStatus;
  tag_type?: any | IReportTagType;
  ticket_id: string; // (uuid)
  timeline?: string | null;
  title: string;
  updated_at: string; // (date-time)
  verified_at?: string | null; // (date-time)
}

interface IDashboardReportDto {
  categories: IReportCategoryInfo[];
  created_at: string; // (date-time)
  description: string;
  id: string; // (uuid)
  impact?: string | null;
  location?: any | IReportLocationInfo;
  status: IReportStatus;
  tag_type?: any | IReportTagType;
  timeline?: string | null;
  title: string;
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
  title: string;
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

interface IReportCategoryInfo {
  category_id: string; // (uuid)
  color?: string | null;
  icon?: string | null;
  name: string;
  severity: IReportSeverity;
  slug: string;
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

interface IReportStatus {}

interface IReportTagType {}

interface ITagReportSummary {
  label: string;
  report_count: number; // (int64)
  tag_type: IReportTagType;
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
  limit?: number; // Maximum reports to return (in: query) (int64)
}

interface Iget_reportParams {
  id: string; // Report ID (in: path) (uuid)
}

interface Ilist_reportsParams {
  page?: number; // Page number (1-indexed) (in: query) (min: 1, int64)
  page_size?: number; // Number of items per page (in: query) (min: 1, max: 100, int64)
}
```
