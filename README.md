# Balungpisah — Landing Page

This repository contains the **public landing page and initial issue intake website** for the **Balungpisah** platform.

Balungpisah is a civic initiative designed to surface real, everyday problems from citizens and make government accountability **visible, traceable, and citizen‑defined**.

This repository is **intentionally limited in scope**. It exists to explain the idea clearly and to accept **initial reports from visitors via a simple form**.

---

## 🧭 Purpose & Philosophy

Balungpisah is built on a clear separation of roles:

- **Citizens** define problems, add facts, and decide when an issue is resolved
- **Government institutions** report actions and progress — and nothing more

> **Government reports progress. Citizens decide resolution.**

There is no automatic closure, no scoring, and no gamification. Problems remain open until people affected by them consider them solved.

This landing page exists to:

- Communicate this philosophy in plain language
- Lower the barrier for citizens to submit an issue
- Collect early signals and real‑world problem statements
- Support collaboration, discussion, and contributor onboarding

---

## 🧩 What This Repository Is (and Is Not)

### This repository **is**:

- A public‑facing website
- An explanation of Balungpisah’s purpose and principles
- A simple intake mechanism for citizen reports
- A collaboration space for content, UX, and accessibility work

### This repository **is not**:

- The Balungpisah core backend (`balungpisah-core`)
- The citizen monitoring application (`balungpisah-citizen-app`)
- The government reporting interface (`balungpisah-government-app`)
- A production‑grade reporting or moderation system

If you are looking to work on business logic, data processing, dashboards, or infrastructure, this is **not** the correct repository.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

---

## 🚀 Getting Started

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

Configure the environment variables as needed for form submission and API integration.

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Auth route group (if enabled)
│   ├── (dashboard)/        # Placeholder / future-facing routes
│   └── page.tsx            # Landing page
├── components/
│   └── ui/                 # shadcn/ui components
├── hooks/
│   └── api/                # Data fetching hooks
├── lib/
│   ├── api/                # API client and providers
│   └── utils.ts            # Utility functions
```

---

## 🤝 Contributing

Contributions are welcome — especially from people who care about clarity, accessibility, and civic usability.

Good areas to contribute include:

- Improving how the platform’s purpose is explained
- UX writing and information design
- Accessibility and mobile friendliness
- Refining the report submission form
- Visual clarity and performance

This is an **early‑stage proof of concept**. Expect incomplete ideas, evolving language, and frequent iteration.

Before contributing, please read the [Contributing Guide](CONTRIBUTING.md).

---

## 📜 License

MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Disclaimer

Balungpisah is an independent civic initiative.

This website and its code are not affiliated with, endorsed by, or representative of any government institution.
