export type TransactionType = 'income' | 'expense';

export type Category =
  | 'Food & Dining'
  | 'Transport'
  | 'Shopping'
  | 'Entertainment'
  | 'Health'
  | 'Housing'
  | 'Salary'
  | 'Freelance'
  | 'Investments'
  | 'Other';

export type SortKey = 'date' | 'amount' | 'category' | 'description';
export type SortDirection = 'asc' | 'desc';
export type Role = 'viewer' | 'admin';

export interface Transaction {
  id: string;
  date: string; // ISO: "2026-03-15"
  description: string;
  amount: number; // always positive
  category: Category;
  type: TransactionType;
  note?: string;
}

export interface FilterState {
  search: string;
  category: Category | 'All';
  type: TransactionType | 'All';
  dateFrom: string;
  dateTo: string;
  sortKey: SortKey;
  sortDirection: SortDirection;
}

export interface Insight {
  id: string;
  icon: string;
  title: string;
  description: string;
  severity: 'positive' | 'neutral' | 'warning';
}

export interface MonthlySummary {
  month: string; // "Oct 2025"
  income: number;
  expenses: number;
  balance: number;
}

export interface CategorySummary {
  category: Category;
  amount: number;
  percentage: number;
  count: number;
}
