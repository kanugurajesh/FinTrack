import { Transaction, MonthlySummary, CategorySummary, Category } from '@/types';
import { format, parseISO } from 'date-fns';

export function getTotals(transactions: Transaction[]) {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  return { income, expenses, balance: income - expenses };
}

export function getMonthlyTrend(transactions: Transaction[]): MonthlySummary[] {
  const map = new Map<string, MonthlySummary>();

  transactions.forEach((t) => {
    const key = format(parseISO(t.date), 'MMM yyyy');
    if (!map.has(key)) {
      map.set(key, { month: key, income: 0, expenses: 0, balance: 0 });
    }
    const entry = map.get(key)!;
    if (t.type === 'income') entry.income += t.amount;
    else entry.expenses += t.amount;
    entry.balance = entry.income - entry.expenses;
  });

  // Sort by actual date
  return Array.from(map.values()).sort((a, b) => {
    const dateA = new Date(a.month);
    const dateB = new Date(b.month);
    return dateA.getTime() - dateB.getTime();
  });
}

export function getCategoryBreakdown(transactions: Transaction[]): CategorySummary[] {
  const expenses = transactions.filter((t) => t.type === 'expense');
  const total = expenses.reduce((sum, t) => sum + t.amount, 0);
  const map = new Map<Category, { amount: number; count: number }>();

  expenses.forEach((t) => {
    const existing = map.get(t.category) ?? { amount: 0, count: 0 };
    map.set(t.category, {
      amount: existing.amount + t.amount,
      count: existing.count + 1,
    });
  });

  return Array.from(map.entries())
    .map(([category, { amount, count }]) => ({
      category,
      amount,
      count,
      percentage: total > 0 ? (amount / total) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function getMonthlyExpenses(transactions: Transaction[], monthKey: string): number {
  return transactions
    .filter((t) => t.type === 'expense' && format(parseISO(t.date), 'MMM yyyy') === monthKey)
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getMonthlyIncome(transactions: Transaction[], monthKey: string): number {
  return transactions
    .filter((t) => t.type === 'income' && format(parseISO(t.date), 'MMM yyyy') === monthKey)
    .reduce((sum, t) => sum + t.amount, 0);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}
