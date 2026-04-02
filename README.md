# FinTrack — Finance Dashboard UI

A clean, interactive finance dashboard built for tracking income, expenses, and spending patterns. Built as part of the Zorvyn Frontend Developer Intern assignment.

---

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it auto-redirects to `/dashboard`.

---

## Features

### Dashboard Overview
- **Summary cards** — Total Balance, Income, and Expenses with month-over-month trend indicators
- **Balance Trend Chart** — Area chart showing income vs expenses across 6 months (Oct 2025–Mar 2026)
- **Spending Breakdown** — Donut chart with category percentages; click a segment to filter the transactions table

### Transactions
- **Full transaction table** — sortable by date, amount, category, or description
- **Debounced search** — 300ms debounce, matches description, category, and notes
- **Multi-filter** — combine category, type (income/expense), and date range filters
- **Export** — export currently-filtered results as CSV or JSON (shows exact count)
- **Empty state** — graceful handling when filters match nothing

### Role-Based UI
Switch between roles using the dropdown in the top bar:

| Feature | Viewer | Admin |
|---|---|---|
| View transactions | ✅ | ✅ |
| Add transactions | ❌ | ✅ |
| Edit transactions | ❌ | ✅ |
| Delete transactions | ❌ | ✅ |
| Export data | ✅ | ✅ |

Admin actions show on row hover. Deletes require a confirmation dialog. Role persists across page refreshes via localStorage.

### Insights
- **Top spending category** — highlighted card showing category, total amount, and transaction count
- **Monthly comparison** — grouped bar chart comparing income vs expenses for the last 4 months
- **Smart observations** — auto-generated insights including:
  - Month-over-month expense changes with percentage
  - Current savings rate vs recommended 20% threshold
  - Housing cost ratio vs the 30% guideline
  - Entertainment spending spikes detection
  - Freelance income stability tracking

### Other
- **Dark mode** — toggle in the top bar
- **Responsive layout** — collapsing sidebar with hamburger menu on mobile; tables scroll horizontally
- **Data persistence** — transactions and role persist to localStorage via Zustand's persist middleware
- **Toast notifications** — optimistic feedback on add/edit/delete actions

---

## Tech Stack

| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js 15 + App Router | Layout nesting, file-based routing, TypeScript-first |
| Language | TypeScript (strict mode) | Type safety across all data models and component props |
| Styling | Tailwind CSS v4 | Dark mode, responsive utilities, consistent design tokens |
| State | Zustand + persist | Lightweight, no boilerplate, localStorage sync in ~3 lines |
| Charts | Recharts | Best React integration, composable, typed |
| UI Primitives | shadcn/ui (base-ui) | Accessible, unstyled-by-default components |
| Forms | React Hook Form + Zod | Typed validation; Zod schema is the single source of truth |
| Icons | Lucide React | Consistent, tree-shakeable |
| Dates | date-fns | Lightweight, functional |
| Animations | Framer Motion | Card entrance animations |
| Export | papaparse | CSV generation |
| Notifications | Sonner | Toast feedback for mutations |

---

## Architecture Decisions

**Single source of truth for filters** — All filter/sort/search logic lives in `useFilteredTransactions.ts` (a derived hook). Components never compute filtered results themselves — they read from this hook. This keeps the table component purely presentational.

**Separate stores by concern** — Three Zustand stores: `useTransactionStore` (persisted), `useFilterStore` (not persisted — filters reset on page load intentionally), and `useRoleStore` (persisted). This prevents filter state bleeding between sessions.

**`usePermissions` hook** — All role-based access checks go through one hook (`canEdit`, `canDelete`, `canAdd`, `canExport`). Components never read the role directly. Changing role logic is a single-file change.

**Mock data designed for meaningful insights** — 89 transactions across 6 months with deliberate patterns: March 2026 expenses are ~15% higher than February (fires a warning), December entertainment spikes for holidays, and a large one-off purchase in January ($1,299 laptop). This ensures the Insights page shows non-trivial, realistic observations.

---

## Project Structure

```
src/
├── app/dashboard/         # Pages: overview, transactions, insights
├── components/
│   ├── layout/            # Sidebar, Topbar, RoleSwitcher
│   ├── overview/          # Summary cards + charts
│   ├── transactions/      # Table, filters, search, modal, export
│   ├── insights/          # Insight cards, comparison chart, observations
│   └── ui/                # shadcn/ui generated components
├── hooks/                 # useFilteredTransactions, usePermissions, useDebounce
├── lib/                   # computations, insights, export, mockData, utils
├── store/                 # Zustand stores (transaction, filter, role)
└── types/                 # Shared TypeScript interfaces
```
