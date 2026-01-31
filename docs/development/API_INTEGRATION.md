# API Integration

## Overview

All API calls use custom hooks built on React Query. Never use `fetch` or `axios` directly.

```tsx
import { useOne } from '@/hooks/api/use-one';
import { useList } from '@/hooks/api/use-list';
import { useMutation } from '@/hooks/api/use-mutation';
```

## Hook Selection

| Purpose               | Hook          | Loading State |
| --------------------- | ------------- | ------------- |
| Fetch single resource | `useOne`      | `isLoading`   |
| Fetch collection      | `useList`     | `isLoading`   |
| Create/Update/Delete  | `useMutation` | `isPending`   |

---

## useOne

Fetch a single resource.

```tsx
const { data, isLoading, error, refetch } = useOne<User>({
  resource: 'users/123',
});

// Nested resource
const { data } = useOne<Thread>({
  resource: `citizen-reports/${reportId}/thread`,
});

// Conditional fetch
const { data } = useOne<User>({
  resource: `users/${userId}`,
  enabled: !!userId,
});
```

**Options:**

- `resource` - API path (e.g., `'users/123'`)
- `enabled` - Enable/disable query (default: `true`)
- `dataProvider` - Provider name (default: `'citizen'`)

---

## useList

Fetch a collection with pagination, filters, and sorting.

```tsx
const { data, total, isLoading } = useList<Report>({
  resource: 'citizen-reports',
  pagination: { page: 1, pageSize: 10 },
  filters: { status: 'published' },
  sort: { field: 'created_at', order: 'desc' },
});
```

**Options:**

- `resource` - API path
- `pagination` - `{ page, pageSize }`
- `filters` - Key-value filter params
- `sort` - `{ field, order: 'asc' | 'desc' }`
- `enabled`, `dataProvider`

**Returns:**

- `data` - Array of items (defaults to `[]`)
- `total` - Total count for pagination
- `meta` - Pagination metadata

---

## useMutation

Create, update, or delete resources.

```tsx
// Create (POST)
const { mutate, isPending } = useMutation<Response, Payload>({
  resource: 'citizen-reports',
  onSuccess: (data) => {
    toast.success('Berhasil dibuat');
    router.push(`/reports/${data.id}`);
  },
  onError: (error) => {
    toast.error(error.message);
  },
});

mutate({ title: 'New Report', description: '...' });

// Update (PUT)
const { mutate } = useMutation({
  resource: 'citizen-reports',
  id: reportId,
  method: 'PUT',
});

// Delete
const { mutate } = useMutation({
  resource: 'citizen-reports',
  id: reportId,
  method: 'DELETE',
});

mutate(undefined); // No body for DELETE
```

**Options:**

- `resource` - API path
- `id` - Resource ID (for PUT/PATCH/DELETE)
- `method` - `'POST'` | `'PUT'` | `'PATCH'` | `'DELETE'` (default: `'POST'`)
- `onSuccess`, `onError`, `onSettled` - Callbacks
- `invalidateKeys` - Query keys to invalidate after mutation

---

## Loading States

```tsx
// Query loading
const { data, isLoading } = useList<User>({ resource: 'users' });

if (isLoading) return <div>Memuat...</div>;

// Mutation loading
const { mutate, isPending } = useMutation({ resource: 'users' });

<Button disabled={isPending}>{isPending ? 'Menyimpan...' : 'Simpan'}</Button>;
```

### Skeleton Loading

```tsx
import { Skeleton } from '@/components/ui/skeleton';

if (isLoading) {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}
```

---

## Error Handling

### Query Errors

```tsx
const { data, isError, error } = useList<User>({ resource: 'users' });

if (isError) {
  return <div className="text-destructive">{error?.message}</div>;
}
```

### Mutation Errors

```tsx
const { mutate } = useMutation({
  resource: 'users',
  onError: (error) => {
    toast.error(error.message);
  },
});
```

### Form Validation Errors

Use `setApiErrors` to map server validation errors to form fields:

```tsx
import { setApiErrors } from '@/lib/validation/api-errors';

const { mutate } = useMutation({
  resource: 'users',
  onError: (error) => {
    setApiErrors(error, form.setError);
    toast.error('Validasi gagal');
  },
});
```

> See [Form Patterns](./FORM_PATTERNS.md) for comprehensive form handling.

---

## Data Providers

Hooks support multiple backends via data providers:

```tsx
// Default provider (citizen)
const { data } = useOne<User>({ resource: 'users/123' });

// Different provider
const { data } = useOne<Config>({
  resource: 'config',
  dataProvider: 'admin',
});
```

---

## API Documentation

Backend types are in `docs/api-documentations/`. When using:

1. **Ignore wrapper types** (`IApiResponse_*`)
2. **Use the type inside `data` key** - this is what hooks return

```tsx
// Backend defines: IApiResponse_CitizenReport { data: ICitizenReport }
// Frontend uses:
const { data } = useOne<ICitizenReport>({ resource: 'citizen-reports/123' });
```
