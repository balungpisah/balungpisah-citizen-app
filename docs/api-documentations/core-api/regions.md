# Regions API

---

## API Endpoints

| Method | Endpoint                                  | Description                           | Parameters                          | Request Body | Response                               |
| ------ | ----------------------------------------- | ------------------------------------- | ----------------------------------- | ------------ | -------------------------------------- |
| GET    | `/api/regions/districts`                  | Search districts across all regencies | `Isearch_districtsParams`           | -            | `IApiResponse_Vec_DistrictResponseDto` |
| GET    | `/api/regions/districts/{code}`           | Get a district by code                | `Iget_districtParams`               | -            | `IApiResponse_DistrictResponseDto`     |
| GET    | `/api/regions/districts/{code}/villages`  | List villages in a district           | `Ilist_villages_by_districtParams`  | -            | `IApiResponse_Vec_VillageResponseDto`  |
| GET    | `/api/regions/provinces`                  | List all provinces                    | `Ilist_provincesParams`             | -            | `IApiResponse_Vec_ProvinceResponseDto` |
| GET    | `/api/regions/provinces/{code}`           | Get a province by code                | `Iget_provinceParams`               | -            | `IApiResponse_ProvinceResponseDto`     |
| GET    | `/api/regions/provinces/{code}/regencies` | List regencies in a province          | `Ilist_regencies_by_provinceParams` | -            | `IApiResponse_Vec_RegencyResponseDto`  |
| GET    | `/api/regions/regencies`                  | Search regencies across all provinces | `Isearch_regenciesParams`           | -            | `IApiResponse_Vec_RegencyResponseDto`  |
| GET    | `/api/regions/regencies/{code}`           | Get a regency by code                 | `Iget_regencyParams`                | -            | `IApiResponse_RegencyResponseDto`      |
| GET    | `/api/regions/regencies/{code}/districts` | List districts in a regency           | `Ilist_districts_by_regencyParams`  | -            | `IApiResponse_Vec_DistrictResponseDto` |
| GET    | `/api/regions/villages`                   | Search villages across all districts  | `Isearch_villagesParams`            | -            | `IApiResponse_Vec_VillageResponseDto`  |
| GET    | `/api/regions/villages/{code}`            | Get a village by code                 | `Iget_villageParams`                | -            | `IApiResponse_VillageResponseDto`      |

---

## TypeScript Interfaces

```typescript
interface IApiResponse_DistrictResponseDto {
  data?: IDistrictResponseDto; // Response DTO for district data
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IApiResponse_ProvinceResponseDto {
  data?: IProvinceResponseDto; // Response DTO for province data
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IApiResponse_RegencyResponseDto {
  data?: IRegencyResponseDto; // Response DTO for regency data
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IApiResponse_Vec_DistrictResponseDto {
  data?: IDistrictResponseDto[];
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IApiResponse_Vec_ProvinceResponseDto {
  data?: IProvinceResponseDto[];
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IApiResponse_Vec_RegencyResponseDto {
  data?: IRegencyResponseDto[];
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IApiResponse_Vec_VillageResponseDto {
  data?: IVillageResponseDto[];
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IApiResponse_VillageResponseDto {
  data?: IVillageResponseDto; // Response DTO for village data
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IDistrictResponseDto {
  code: string;
  id: string; // (uuid)
  lat?: number | null; // (double)
  lng?: number | null; // (double)
  name: string;
  regencyId: string; // (uuid)
}

interface IMeta {
  total: number; // (int64)
}

interface IProvinceResponseDto {
  code: string;
  id: string; // (uuid)
  lat?: number | null; // (double)
  lng?: number | null; // (double)
  name: string;
}

interface IRegencyResponseDto {
  code: string;
  id: string; // (uuid)
  lat?: number | null; // (double)
  lng?: number | null; // (double)
  name: string;
  provinceId: string; // (uuid)
}

interface IVillageResponseDto {
  code: string;
  districtId: string; // (uuid)
  id: string; // (uuid)
  lat?: number | null; // (double)
  lng?: number | null; // (double)
  name: string;
}

interface Iget_districtParams {
  code: string; // District code (format: XX.XX.XX) (in: path)
}

interface Iget_provinceParams {
  code: string; // Province code (2 digits) (in: path)
}

interface Iget_regencyParams {
  code: string; // Regency code (format: XX.XX) (in: path)
}

interface Iget_villageParams {
  code: string; // Village code (format: XX.XX.XX.XXXX) (in: path)
}

interface Ilist_districts_by_regencyParams {
  code: string; // Regency code (format: XX.XX) (in: path)
  search?: string | null; // Search by name (case-insensitive, partial match) (in: query)
}

interface Ilist_provincesParams {
  search?: string | null; // Search by name (case-insensitive, partial match) (in: query)
}

interface Ilist_regencies_by_provinceParams {
  code: string; // Province code (2 digits) (in: path)
  search?: string | null; // Search by name (case-insensitive, partial match) (in: query)
}

interface Ilist_villages_by_districtParams {
  code: string; // District code (format: XX.XX.XX) (in: path)
  search?: string | null; // Search by name (case-insensitive, partial match) (in: query)
}

interface Isearch_districtsParams {
  search?: string | null; // Search by name (case-insensitive, partial match) (in: query)
}

interface Isearch_regenciesParams {
  search?: string | null; // Search by name (case-insensitive, partial match) (in: query)
}

interface Isearch_villagesParams {
  search?: string | null; // Search by name (case-insensitive, partial match) (in: query)
}
```
