# Form Patterns

## Overview

Forms use React Hook Form + Zod for state management and validation.

**Location:** Forms are frequently reused (create/update), so keep them in `features/[feature]/components/` with schema inline in the form file.

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
```

---

## Basic Pattern

```tsx
// 1. Define schema
const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

type FormValues = z.infer<typeof schema>;

// 2. Initialize form
const form = useForm<FormValues>({
  resolver: zodResolver(schema),
  defaultValues: { name: '', email: '' },
});

// 3. Setup mutation
const { mutate, isPending } = useMutation({
  resource: 'users',
  onSuccess: () => form.reset(),
  onError: (error) => setApiErrors(error, form.setError),
});

// 4. Render
<Form {...form}>
  <form onSubmit={form.handleSubmit((data) => mutate(data))}>
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nama</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button disabled={isPending}>{isPending ? 'Menyimpan...' : 'Simpan'}</Button>
  </form>
</Form>;
```

---

## Validation Schemas

### Inline Schemas (Recommended)

Define schemas inline in each page/form file to avoid merge conflicts:

```tsx
// Co-located with your form - no shared file to conflict with
const phoneRegex = /^08\d{8,12}$/;

const schema = z.object({
  name: z.string().min(1),
  email: z.string().min(1).email(),
  phone: z.string().min(1).regex(phoneRegex, 'Format: 08123456789'),
  agreed: z.literal(true),
});
```

### Indonesian Error Messages

Configured globally via `@/lib/validation/zod-id`. Examples:

| Schema               | Message                    |
| -------------------- | -------------------------- |
| `z.string().min(1)`  | "Wajib diisi"              |
| `z.string().email()` | "Format email tidak valid" |
| `z.string().min(5)`  | "Minimal 5 karakter"       |

### Custom Messages

```tsx
z.string().min(16, 'NIK harus 16 digit');
```

---

## Data Transformation

Form inputs are strings. APIs may expect different types.

### Empty String → null

APIs expect `null` for optional fields, but forms send empty strings. Transform before submitting:

```tsx
function emptyToNull<T extends Record<string, unknown>>(data: T): T {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, value === '' ? null : value])
  ) as T;
}

// Usage
form.handleSubmit((data) => mutate(emptyToNull(data)));
```

### Form → API (Serialization)

```tsx
// Form schema
const formSchema = z.object({
  title: z.string().min(1),
  quantity: z.string().min(1), // string in form
});

// API expects
interface Payload {
  title: string;
  quantity: number; // number in API
}

// Transform on submit
function toPayload(form: FormValues): Payload {
  return {
    title: form.title,
    quantity: Number(form.quantity),
  };
}

form.handleSubmit((data) => mutate(toPayload(data)));
```

### API → Form (Deserialization)

For edit forms, transform API data to form values:

```tsx
function toFormValues(item: Item): FormValues {
  return {
    title: item.title,
    quantity: String(item.quantity), // number → string
  };
}

useEffect(() => {
  if (item) form.reset(toFormValues(item));
}, [item]);
```

---

## API Error Handling

Map server validation errors to form fields:

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

**Field name mapping** (when API names differ):

```tsx
setApiErrors(error, form.setError, {
  email_address: 'email',
});
```

---

## Common Components

### Select

```tsx
<FormField
  control={form.control}
  name="category_id"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Kategori</FormLabel>
      <Select onValueChange={field.onChange} value={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Pilih kategori" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="1">Kategori A</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Checkbox

```tsx
<FormField
  control={form.control}
  name="agreed"
  render={({ field }) => (
    <FormItem>
      <div className="flex items-start gap-3">
        <FormControl>
          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
        </FormControl>
        <FormLabel className="font-normal">Saya menyetujui ketentuan</FormLabel>
      </div>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Textarea

```tsx
<FormField
  control={form.control}
  name="description"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Deskripsi</FormLabel>
      <FormControl>
        <Textarea rows={4} {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

---

## Best Practices

| Do                                      | Don't                                |
| --------------------------------------- | ------------------------------------ |
| Use `z.string().min(1)` for required    | Use bare `z.string()` (empty passes) |
| Define schemas inline in page/form file | Create shared schema files           |
| Transform data on submit                | Mix form types with API types        |
| Use `setApiErrors` for server errors    | Forget API error handling            |
| Provide `defaultValues` for all fields  | Leave fields undefined               |
