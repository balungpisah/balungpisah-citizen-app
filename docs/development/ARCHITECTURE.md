# Architecture

## Overview

Citizen reporting platform built with Next.js 15 (App Router), TypeScript, Tailwind CSS v4, and shadcn/ui.

## Development Phases

This project has two development phases with different structures:

| Phase           | Purpose                                | Location             |
| --------------- | -------------------------------------- | -------------------- |
| **PoC**         | UI/UX validation (no design available) | `app/poc/`           |
| **Development** | Production-grade implementation        | `app/` + `features/` |

---

## PoC Phase

**When:** No UI/UX design available, need to validate user flows first.

**Location:** `src/app/poc/`

```
src/app/poc/
├── [feature]/
│   ├── page.tsx            # UI inline, hardcoded data OK
│   ├── _components/        # Extract only when needed
│   ├── _types.ts           # Types for this route
│   └── _constants.ts       # Constants for this route
```

**Rules:**

- ✅ Speed over perfection
- ✅ Hardcoded mock data
- ✅ Copy-paste code OK
- ✅ Use `_components/`, `_types.ts` in app router (underscore = not a route)
- ❌ No API integration
- ❌ No abstraction/reusability focus

**Goal:** Validate UI/UX flow → Extract requirements → Design backend → Implement production code.

---

## Development Phase (Production)

**When:** Requirements are validated, building production-grade code.

### Directory Structure

```
src/
├── app/                          # Pages only
│   ├── layout.tsx
│   ├── page.tsx
│   └── [route]/
│       └── page.tsx              # Page with inline UI when possible
│
├── features/                     # Reusable code by domain
│   └── [feature]/
│       ├── components/           # Feature components
│       ├── types/                # Type definitions
│       ├── hooks/                # Custom hooks (if needed)
│       └── stores/               # Zustand stores (if needed)
│
├── components/ui/                # shadcn/ui components
├── hooks/api/                    # API hooks (useOne, useList, useMutation)
├── lib/
│   ├── api/                      # API client, providers
│   └── validation/               # Zod schemas, error helpers
└── providers/                    # React context providers
```

### Where Code Goes

| Type              | Location                         | Example                            |
| ----------------- | -------------------------------- | ---------------------------------- |
| Page              | `app/[route]/page.tsx`           | `app/reports/page.tsx`             |
| Layout            | `app/[route]/layout.tsx`         | `app/(dashboard)/layout.tsx`       |
| Feature component | `features/[feature]/components/` | `ReportCard.tsx`, `ReportForm.tsx` |
| Types             | `features/[feature]/types/`      | `report.ts`                        |
| Custom hooks      | `features/[feature]/hooks/`      | `useReportFilters.ts`              |
| Zustand store     | `features/[feature]/stores/`     | `report-store.ts`                  |
| Generic UI        | `components/ui/`                 | `Button`, `Card`, `Input`          |

### Example: Reports Feature

```
app/
├── reports/
│   ├── page.tsx                  # List page
│   ├── [id]/
│   │   └── page.tsx              # Detail page
│   └── create/
│       └── page.tsx              # Create page

features/
├── reports/
│   ├── components/
│   │   ├── ReportCard.tsx
│   │   ├── ReportTable.tsx
│   │   ├── ReportFilters.tsx
│   │   └── ReportForm.tsx        # Reused in create & edit
│   ├── types/
│   │   └── report.ts
│   └── hooks/
│       └── useReportActions.ts
```

### Page Example

```tsx
// app/reports/page.tsx
'use client';

import { useList } from '@/hooks/api/use-list';
import { ReportTable } from '@/features/reports/components/ReportTable';
import { ReportFilters } from '@/features/reports/components/ReportFilters';
import type { Report } from '@/features/reports/types/report';

export default function ReportsPage() {
  const { data, isLoading } = useList<Report>({ resource: 'citizen-reports' });

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Laporan Warga</h1>
      <ReportFilters />
      <ReportTable data={data} isLoading={isLoading} />
    </div>
  );
}
```

---

## Core Rules

### 1. Direct Imports Only

Barrel exports hurt Next.js performance. Always import directly:

```tsx
// ✅ Good
import { Report } from '@/features/reports/types/report';
import { ReportForm } from '@/features/reports/forms/ReportForm';
import { useOne } from '@/hooks/api/use-one';

// ❌ Bad - barrel imports
import { Report, ReportForm } from '@/features/reports';
```

### 2. Language Convention

**Indonesian** for user-facing text. **English** for code.

| Indonesian                   | English                          |
| ---------------------------- | -------------------------------- |
| UI labels, buttons, toasts   | File names, variables, functions |
| Error messages, placeholders | Types, comments, routes          |

Common: Memuat, Simpan, Batal, Hapus, Ubah, Cari, Berhasil, Gagal, Wajib diisi

### 3. Forms in Features

Forms are frequently reused (create/update pages share the same form). Keep them in `features/[feature]/components/` with schema inline:

```tsx
// features/reports/components/ReportForm.tsx
const schema = z.object({
  title: requiredString,
  description: z.string(),
});

export function ReportForm() { ... }
```

---

## Don't

| Don't                        | Do Instead                           |
| ---------------------------- | ------------------------------------ |
| `_components/` in production | `features/[feature]/components/`     |
| Types inline in pages        | `features/[feature]/types/`          |
| Barrel exports (`index.ts`)  | Direct imports                       |
| `fetch`/`axios` directly     | Use `useOne`/`useList`/`useMutation` |
| English UI text              | Indonesian for user-facing           |
