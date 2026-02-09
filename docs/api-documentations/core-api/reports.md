# Reports API

---

## API Endpoints

| Method | Endpoint                   | Description                             | Parameters                    | Request Body             | Response                               |
| ------ | -------------------------- | --------------------------------------- | ----------------------------- | ------------------------ | -------------------------------------- |
| GET    | `/api/reports`             | List reports for the authenticated user | -                             | -                        | `IApiResponse_Vec_ReportResponseDto`   |
| GET    | `/api/reports/{id}`        | Get report by ID with location          | `Iget_reportParams`           | -                        | `IApiResponse_ReportDetailResponseDto` |
| PATCH  | `/api/reports/{id}/status` | Update report status (admin only)       | `Iupdate_report_statusParams` | `IUpdateReportStatusDto` | `IApiResponse_ReportResponseDto`       |

---

## TypeScript Interfaces

```typescript
interface IApiResponse_ReportDetailResponseDto {
  data?: IReportResponseDto & { location?: any | IReportLocationResponseDto }; // Response DTO for report with location
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IApiResponse_ReportResponseDto {
  data?: IReportResponseDto; // Response DTO for report
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IApiResponse_Vec_ReportResponseDto {
  data?: IReportResponseDto[];
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IGeocodingSource {}

interface IMeta {
  total: number; // (int64)
}

interface IReportCategoryDto {
  category_id: string; // (uuid)
  category_name?: string | null;
  category_slug?: string | null;
  severity: IReportSeverity;
}

interface IReportLocationResponseDto {
  city?: string | null;
  display_name?: string | null;
  district_name?: string | null;
  geocoding_score?: number | null; // (double)
  geocoding_source: IGeocodingSource;
  id: string; // (uuid)
  lat?: number | null; // (double)
  lon?: number | null; // (double)
  neighbourhood?: string | null;
  postcode?: string | null;
  province_name?: string | null;
  raw_input: string;
  regency_name?: string | null;
  road?: string | null;
  state?: string | null;
  suburb?: string | null;
  village_name?: string | null;
}

interface IReportResponseDto {
  categories?: IReportCategoryDto[]; // Categories assigned to this report with their severities
  created_at: string; // (date-time)
  description?: string | null;
  id: string; // (uuid)
  impact?: string | null;
  location_display_name?: string | null; // Location display name (for list view)
  reference_number?: string | null; // Human-readable reference number for tracking
  resolved_at?: string | null; // (date-time)
  status: IReportStatus;
  tags?: IReportTagDto[]; // Tags assigned to this report
  timeline?: string | null;
  title?: string | null;
  updated_at: string; // (date-time)
  verified_at?: string | null; // (date-time)
}

interface IReportSeverity {}

interface IReportStatus {}

interface IReportTagDto {
  tag_type: IReportTagType;
}

interface IReportTagType {}

interface IUpdateReportStatusDto {
  resolution_notes?: string | null;
  status: IReportStatus;
}

interface Iget_reportParams {
  id: string; // Report ID (in: path) (uuid)
}

interface Iupdate_report_statusParams {
  id: string; // Report ID (in: path) (uuid)
}
```
