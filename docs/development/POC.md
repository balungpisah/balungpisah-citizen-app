# Proof of Concept (PoC) Development Guide

## Overview

PoC (Proof of Concept) is a development approach to **validate ideas, UI/UX flows, and requirements** before implementing production code. The goal is to build fast, iterate quickly, and validate before polishing.

## Why PoC?

### Problem: Solo Fullstack Development

Without a dedicated UI/UX team, you face these challenges:

1. **No Mockups** - Must design UI yourself
2. **Risk of Rework** - Wrong design → refactor database, API, and frontend
3. **No Validation** - No one to review ideas before coding

### Solution: PoC as Visual Validation

PoC functions as a **clickable mockup** to:

- ✅ **Validate user flow** before coding backend
- ✅ **Discover data requirements** from UI interactions
- ✅ **Design database schema** based on validated UI needs
- ✅ **Plan API endpoints** from clear user journeys
- ✅ **Prevent expensive refactoring**

## Development Workflow

```
1. BUILD POC UI (Fast)
   - Write UI directly in page files
   - Hardcode data OK
   - Copy-paste OK
   - Focus: "Is this what I want?"
         ↓
2. VALIDATE WORKFLOW
   - Click through all user journeys
   - Identify missing features
   - Get feedback if possible
         ↓
3. EXTRACT REQUIREMENTS
   - Fields needed for each entity
   - Relationships between entities
   - API endpoints required
         ↓
4. DESIGN BACKEND
   - Create ERD
   - Design API specification
   - Plan database migrations
         ↓
5. IMPLEMENT PRODUCTION
   - Connect real API
   - Add error handling
   - Polish UI
```

## PoC Rules

### ✅ ALLOWED (Do These)

1. **Write UI Directly in Pages**

   ```tsx
   // app/reports/page.tsx - Everything in one file
   export default function ReportsPage() {
     const reports = [
       { id: 1, title: 'Report 1', status: 'Draft' },
       { id: 2, title: 'Report 2', status: 'Published' },
     ];

     return (
       <div className="p-6">
         {reports.map((report) => (
           <div key={report.id}>{report.title}</div>
         ))}
       </div>
     );
   }
   ```

2. **Hardcode Mock Data**
   - No API calls needed during initial validation
   - Switch to real API after validating the flow

3. **Copy-Paste Code**
   - Duplicate code between pages = OK
   - Extract components only when truly painful

4. **Rapid Changes**
   - Delete & rewrite entire pages = OK
   - Change structure drastically = OK

5. **Keep Types Inline**
   ```tsx
   // Types right in the page file
   interface Report {
     id: string;
     title: string;
     status: string;
   }
   ```

### ❌ NOT ALLOWED (Avoid These)

1. **Over-Engineering**
   - ❌ Don't create feature folders prematurely
   - ❌ Don't create barrel exports
   - ❌ Don't abstract until you feel pain

2. **Premature Optimization**
   - ❌ Don't optimize performance
   - ❌ Don't write tests during PoC
   - ❌ Don't worry about DRY

3. **Backend Integration Too Early**
   - ❌ Don't connect to real API until flow is validated
   - ❌ Don't setup database for PoC

## Directory Structure

```
app/
├── layout.tsx
├── page.tsx                    # Landing page
├── (dashboard)/
│   ├── layout.tsx
│   ├── page.tsx                # Dashboard home
│   └── reports/
│       ├── page.tsx            # Reports list (UI inline)
│       ├── [id]/
│       │   └── page.tsx        # Report detail (UI inline)
│       ├── _components/        # Only if needed (underscore = not a route)
│       │   └── ReportCard.tsx
│       └── _types.ts           # Only if shared across files
```

### Why Underscore Prefix?

Next.js App Router treats all folders as routes. Underscore tells Next.js it's NOT a route:

```
✅ /reports/_components/  → Not a route, just helpers
✅ /reports/page.tsx      → Route: /reports

❌ /reports/components/   → Would become route: /reports/components
```

## Example Workflow

### Step 1: Build PoC UI

```tsx
// app/reports/page.tsx
'use client';

export default function ReportsPage() {
  // Hardcoded - OK for PoC
  const reports = [
    { id: '1', title: 'Jalan Rusak di Jl. Sudirman', status: 'published', votes: 120 },
    { id: '2', title: 'Lampu Jalan Mati', status: 'draft', votes: 45 },
  ];

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Laporan Warga</h1>
      <div className="grid gap-4">
        {reports.map((report) => (
          <div key={report.id} className="rounded border p-4">
            <h2 className="font-semibold">{report.title}</h2>
            <div className="mt-2 flex gap-4">
              <span>{report.status}</span>
              <span>{report.votes} votes</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Step 2: Validate

- ✅ User can see list of reports
- ✅ User can see vote count
- ⚠️ Missing: Filter by status
- ⚠️ Missing: Search functionality

**Iterate:** Add missing features, validate again

### Step 3: Extract Requirements

From validated PoC:

```
Entity: CitizenReport
- id (UUID)
- title (String, required)
- description (Text)
- status (Enum: draft, published)
- vote_count (Integer)
- created_at (Timestamp)

API Endpoints:
- GET /citizen-reports - List with filters
- GET /citizen-reports/:id - Detail
- POST /citizen-reports - Create
```

### Step 4: Connect Real API

```tsx
// app/reports/page.tsx - Now with real API
'use client';

import { useList } from '@/hooks/api/use-list';

interface Report {
  id: string;
  title: string;
  status: string;
  vote_count: number;
}

export default function ReportsPage() {
  const { data, isLoading } = useList<Report>({
    resource: 'citizen-reports',
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Laporan Warga</h1>
      <div className="grid gap-4">
        {data.map((report) => (
          <div key={report.id} className="rounded border p-4">
            <h2 className="font-semibold">{report.title}</h2>
            <div className="mt-2 flex gap-4">
              <span>{report.status}</span>
              <span>{report.vote_count} votes</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Best Practices

### 1. Use Tailwind CSS Variables

```tsx
// ✅ GOOD - Uses theme variables
<div className="bg-primary text-primary-foreground">

// ❌ BAD - Hardcoded colors
<div className="bg-[#0C5EB5] text-white">
```

### 2. Write in Page Files First

Don't create component files until you're sure about the structure.

### 3. Extract Only When Painful

Rule of thumb: Extract a component only when:

- Used in 3+ places
- Complex logic obscures the page
- You're confident the structure is stable

### 4. Document Learnings

After validating PoC:

- Fields needed
- API endpoints
- User flow insights
- Technical decisions

## Common Pitfalls

### ❌ Pitfall 1: Over-Engineering PoC

```tsx
// ❌ BAD - Too much abstraction
const useCourseData = () => {
  const [courses, setCourses] = useState([]);
  // complex logic...
  return { courses, loading, error };
};

// ✅ GOOD - Simple & direct
const courses = [
  { id: 1, title: 'Course 1' },
  { id: 2, title: 'Course 2' },
];
```

### ❌ Pitfall 2: Creating Files Too Early

```
// ❌ BAD - Creating structure before validating
features/
├── reports/
│   ├── components/
│   ├── hooks/
│   ├── types/
│   └── utils/

// ✅ GOOD - Keep it in page until needed
app/reports/
└── page.tsx  # Everything here first
```

### ❌ Pitfall 3: Connecting API Before Validating UI

Connect to real API only AFTER:

- User flow is validated
- Data requirements are clear
- UI structure is stable

## Success Criteria

PoC is successful when:

✅ **Clarity** - Requirements are 100% clear
✅ **Validation** - User flow has been validated
✅ **Extractable** - Can define ERD & API spec confidently
✅ **Fast** - Built in hours/days, not weeks

## Conclusion

PoC saves time by:

1. **Preventing refactoring** - Schema & API are correct from start
2. **Accelerating backend** - Know exactly what to build
3. **Reducing uncertainty** - Requirements clear before coding
4. **Improving quality** - Production code focuses on implementation

**Remember:** PoC is not about perfect code, but about **perfect understanding**.

---

**Next Steps:**

1. Build PoC UI directly in page files
2. Validate with click-through
3. Extract requirements
4. Design backend
5. Implement with confidence
