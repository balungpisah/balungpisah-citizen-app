# Balungpisah — Citizen App

Web application for citizens to submit reports, track follow-ups, and monitor public issue resolution.

## Overview

This is the **citizen-facing web application** for the Balungpisah civic platform. It provides citizens with tools to:

- **Report Problems** — Submit civic issues with photos, location, and description
- **Track Reports** — Monitor the status of submitted reports from submission to resolution
- **View Progress** — See updates from officials working on claimed problems
- **Browse Community Issues** — Explore what problems are being addressed in the community

### Platform Philosophy

Balungpisah is built on a clear separation of roles:

- **Citizens** define problems, provide evidence, and verify resolution
- **Government/Officials** claim problems, report progress, and complete work

> **Government reports progress. Citizens decide resolution.**

## Related Repositories

| Repository                   | Description                                                     |
| ---------------------------- | --------------------------------------------------------------- |
| `balungpisah-core`           | Backend API and core services                                   |
| `balungpisah-landing`        | Public landing page                                             |
| `balungpisah-citizen-app`    | Citizen web application (this repo)                             |
| `balungpisah-government-app` | Government/official dashboard for claiming and resolving issues |

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Authentication**: [Logto](https://logto.io/)

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm, yarn, pnpm, or bun

### Installation

```bash
git clone https://github.com/balungpisah/balungpisah-citizen-app.git
cd balungpisah-citizen-app
npm install
```

### Environment Setup

```bash
cp .env.example .env.local
```

Configure the environment variables for API and authentication.

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
├── features/                     # Feature modules (components, types, hooks)
│   └── [feature]/
│       ├── components/
│       ├── types/
│       └── hooks/
├── components/ui/                # shadcn/ui components
├── hooks/api/                    # Data fetching hooks (useOne, useList, useMutation)
└── lib/
    ├── api/                      # API client and providers
    └── validation/               # Zod schemas and error helpers
```

## Documentation

- [Architecture](docs/development/ARCHITECTURE.md) — Project structure and development phases
- [API Integration](docs/development/API_INTEGRATION.md) — Data fetching patterns
- [Form Patterns](docs/development/FORM_PATTERNS.md) — Form validation and submission
- [API Documentation](docs/api-documentations/README.md) — Backend API reference

## Contributing

Contributions are welcome. Good areas to contribute:

- UI/UX improvements
- Accessibility enhancements
- Mobile responsiveness
- Report submission flow
- Localization (Indonesian)

Before contributing, please read the [Contributing Guide](CONTRIBUTING.md).

## License

MIT License. See the [LICENSE](LICENSE) file for details.

---

Balungpisah is an independent civic initiative. This application is not affiliated with any government institution.
