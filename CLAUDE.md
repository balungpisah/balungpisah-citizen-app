# CLAUDE.md

> Context file for AI assistants working on this codebase.

## Project Overview

Citizen reporting platform built with Next.js 15 (App Router), TypeScript, Tailwind CSS v4, and shadcn/ui.

## Development Phases

| Phase           | Purpose                      | Structure                                      |
| --------------- | ---------------------------- | ---------------------------------------------- |
| **PoC**         | UI/UX validation (no design) | `app/poc/` with `_components`, `_types` inline |
| **Development** | Production-grade             | `app/` (pages) + `features/` (reusable code)   |

## Project Structure (Production)

```
src/
├── app/                          # Pages only (inline UI when possible)
├── features/                     # Reusable code by domain
│   └── [feature]/
│       ├── components/           # Feature components
│       ├── types/                # Type definitions
│       ├── hooks/                # Custom hooks (if needed)
│       └── stores/               # Zustand stores (if needed)
├── components/ui/                # shadcn/ui only
├── hooks/api/                    # useOne, useList, useMutation
└── lib/
    ├── api/                      # API client, providers
    └── validation/               # Zod schemas, error helpers
```

## Core Rules

### Data Fetching

```tsx
import { useOne } from '@/hooks/api/use-one';
import { useList } from '@/hooks/api/use-list';
import { useMutation } from '@/hooks/api/use-mutation';
```

| Hook          | Purpose              | Loading State |
| ------------- | -------------------- | ------------- |
| `useOne`      | Single resource      | `isLoading`   |
| `useList`     | Collection           | `isLoading`   |
| `useMutation` | Create/Update/Delete | `isPending`   |

### Forms

Forms go in `features/[feature]/components/`. Use react-hook-form + Zod:

```tsx
import { ReportForm } from '@/features/reports/components/ReportForm';
import { setApiErrors } from '@/lib/validation/api-errors';

// On mutation error, map API errors to form fields
onError: (error) => setApiErrors(error, form.setError);
```

### Types & Components

```tsx
// Types from features
import type { Report } from '@/features/reports/types/report';

// Components from features
import { ReportTable } from '@/features/reports/components/ReportTable';

// Always use direct imports, never barrel imports
```

### Language Convention

| Indonesian                              | English                                 |
| --------------------------------------- | --------------------------------------- |
| UI text, labels, toasts, error messages | File names, variables, functions, types |

Common: Memuat, Simpan, Batal, Hapus, Ubah, Cari, Berhasil, Gagal, Wajib diisi

## Don't

| Don't                        | Do Instead                         |
| ---------------------------- | ---------------------------------- |
| `_components/` in production | `features/[feature]/components/`   |
| Types inline in pages        | `features/[feature]/types/`        |
| Barrel imports               | Direct imports from specific files |
| `fetch`/`axios` directly     | Use API hooks                      |
| English UI text              | Indonesian for user-facing         |

## Documentation

- [Architecture](docs/development/ARCHITECTURE.md) - Project structure, phases
- [API Integration](docs/development/API_INTEGRATION.md) - Data fetching, mutations
- [Form Patterns](docs/development/FORM_PATTERNS.md) - Validation, transformation
