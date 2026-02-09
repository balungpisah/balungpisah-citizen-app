# Admin API

---

## API Endpoints

| Method | Endpoint                       | Description                                                | Parameters                 | Request Body | Response                                 |
| ------ | ------------------------------ | ---------------------------------------------------------- | -------------------------- | ------------ | ---------------------------------------- |
| GET    | `/api/admin/contributors`      | List all contributors (paginated with filters)             | `Ilist_contributorsParams` | -            | `IApiResponse_Vec_AdminContributorDto`   |
| GET    | `/api/admin/contributors/{id}` | Get a single contributor by ID with full details           | `Iget_contributorParams`   | -            | `IApiResponse_AdminContributorDetailDto` |
| GET    | `/api/admin/expectations`      | List all expectations (paginated with filters)             | `Ilist_expectationsParams` | -            | `IApiResponse_Vec_AdminExpectationDto`   |
| GET    | `/api/admin/expectations/{id}` | Get a single expectation by ID                             | `Iget_expectationParams`   | -            | `IApiResponse_AdminExpectationDto`       |
| GET    | `/api/admin/reports`           | List all reports with attachments (paginated with filters) | `Ilist_reportsParams`      | -            | `IApiResponse_Vec_AdminReportDto`        |
| GET    | `/api/admin/reports/{id}`      | Get a single report by ID with full details                | `Iget_reportParams`        | -            | `IApiResponse_AdminReportDetailDto`      |

---

## TypeScript Interfaces

```typescript
interface IAdminContributorDetailDto {
  agreed: boolean;
  aspiration?: string | null;
  bio?: string | null;
  city?: string | null;
  contact_email?: string | null;
  contact_name?: string | null;
  contact_position?: string | null;
  contact_whatsapp?: string | null;
  contribution_offer?: string | null;
  created_at: string; // (date-time)
  email?: string | null;
  id: string; // (uuid)
  name?: string | null;
  organization_name?: string | null;
  organization_type?: string | null;
  portfolio_url?: string | null;
  role?: string | null;
  skills?: string | null;
  submission_type: string;
  updated_at: string; // (date-time)
  whatsapp?: string | null;
}

interface IAdminContributorDto {
  city?: string | null;
  created_at: string; // (date-time)
  email?: string | null;
  id: string; // (uuid)
  name?: string | null;
  organization_name?: string | null;
  submission_type: string;
}

interface IAdminExpectationDto {
  created_at: string; // (date-time)
  email?: string | null;
  expectation: string;
  id: string; // (uuid)
  name?: string | null;
}

interface IAdminReportAttachmentDto {
  content_type: string;
  file_id: string; // (uuid)
  file_size: number; // (int64)
  original_filename: string;
  url: string;
}

interface IAdminReportCategoryDto {
  category_id: string; // (uuid)
  category_name: string;
  category_slug: string;
  severity: IReportSeverity;
}

interface IAdminReportDetailDto {
  adk_thread_id?: string | null; // (uuid)
  attachments: IAdminReportAttachmentDto[];
  categories: IAdminReportCategoryDto[];
  created_at: string; // (date-time)
  description?: string | null;
  id: string; // (uuid)
  impact?: string | null;
  location?: any | IAdminReportLocationDto;
  platform?: string | null;
  reference_number?: string | null;
  resolution_notes?: string | null;
  resolved_at?: string | null; // (date-time)
  resolved_by?: string | null;
  status: IReportStatus;
  tags: IReportTagType[];
  timeline?: string | null;
  title?: string | null;
  updated_at: string; // (date-time)
  user_id?: string | null;
  verified_at?: string | null; // (date-time)
  verified_by?: string | null;
}

interface IAdminReportDto {
  attachment_count: number; // Number of attachments (int64)
  category_count: number; // Number of categories assigned to this report (int64)
  created_at: string; // (date-time)
  id: string; // (uuid)
  location_summary?: string | null; // Location summary (city or regency name)
  platform?: string | null;
  primary_category?: string | null; // Primary category name (first assigned category)
  reference_number?: string | null;
  status: IReportStatus;
  title?: string | null;
  updated_at: string; // (date-time)
  user_id?: string | null;
}

interface IAdminReportLocationDto {
  city?: string | null;
  display_name?: string | null;
  lat?: number | null; // (double)
  lon?: number | null; // (double)
  province_name?: string | null;
  raw_input: string;
  regency_name?: string | null;
  state?: string | null;
}

interface IApiResponse_AdminContributorDetailDto {
  data?: IAdminContributorDetailDto; // Admin view of contributor detail (single)
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IApiResponse_AdminExpectationDto {
  data?: IAdminExpectationDto; // Admin view of expectation
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IApiResponse_AdminReportDetailDto {
  data?: IAdminReportDetailDto; // Admin view of report detail (single)
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IApiResponse_Vec_AdminContributorDto {
  data?: IAdminContributorDto[];
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IApiResponse_Vec_AdminExpectationDto {
  data?: IAdminExpectationDto[];
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IApiResponse_Vec_AdminReportDto {
  data?: IAdminReportDto[];
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IMeta {
  total: number; // (int64)
}

interface IReportSeverity {}

interface IReportSortBy {}

interface IReportStatus {}

interface IReportTagType {}

interface ISortDirection {}

interface Iget_contributorParams {
  id: string; // Contributor ID (in: path) (uuid)
}

interface Iget_expectationParams {
  id: string; // Expectation ID (in: path) (uuid)
}

interface Iget_reportParams {
  id: string; // Report ID (in: path) (uuid)
}

interface Ilist_contributorsParams {
  city?: string | null; // Filter by city (in: query)
  from_date?: string | null; // Filter from date (YYYY-MM-DD) (in: query) (date)
  page?: number; // Page number (1-indexed) (in: query) (min: 1, int64)
  page_size?: number; // Items per page (in: query) (min: 1, max: 100, int64)
  search?: string | null; // Search in name, email, or organization_name (in: query)
  sort?: ISortDirection; // Sort direction (default: desc) (in: query)
  submission_type?: string | null; // Filter by submission type (personal/organization) (in: query)
  to_date?: string | null; // Filter to date (YYYY-MM-DD) (in: query) (date)
}

interface Ilist_expectationsParams {
  from_date?: string | null; // Filter from date (YYYY-MM-DD) (in: query) (date)
  has_email?: boolean | null; // Filter by email presence (in: query)
  page?: number; // Page number (1-indexed) (in: query) (min: 1, int64)
  page_size?: number; // Items per page (in: query) (min: 1, max: 100, int64)
  search?: string | null; // Search in name or expectation text (in: query)
  sort?: ISortDirection; // Sort direction (default: desc) (in: query)
  to_date?: string | null; // Filter to date (YYYY-MM-DD) (in: query) (date)
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
