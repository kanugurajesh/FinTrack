'use client';

import { Wallet, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { SummaryCard } from './SummaryCard';
import { useTransactionStore } from '@/store/useTransactionStore';
import { getTotals, getMonthlyExpenses, getMonthlyIncome } from '@/lib/computations';
import { Skeleton } from '@/components/ui/skeleton';

export function SummaryCards() {
  const transactions = useTransactionStore((s) => s.transactions);
  const isLoading = useTransactionStore((s) => s.isLoading);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-start justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-9 w-36" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>
    );
  }
  const { income, expenses, balance } = getTotals(transactions);

  const currentMonthExpenses = getMonthlyExpenses(transactions, 'Mar 2026');
  const prevMonthExpenses = getMonthlyExpenses(transactions, 'Feb 2026');
  const expenseTrend =
    prevMonthExpenses > 0
      ? ((currentMonthExpenses - prevMonthExpenses) / prevMonthExpenses) * 100
      : 0;

  const currentMonthIncome = getMonthlyIncome(transactions, 'Mar 2026');
  const prevMonthIncome = getMonthlyIncome(transactions, 'Feb 2026');
  const incomeTrend =
    prevMonthIncome > 0
      ? ((currentMonthIncome - prevMonthIncome) / prevMonthIncome) * 100
      : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <SummaryCard
        title="Net Balance"
        amount={balance}
        icon={Wallet}
        variant="balance"
        index={0}
      />
      <SummaryCard
        title="Total Income"
        amount={income}
        icon={ArrowUpCircle}
        trend={incomeTrend}
        variant="income"
        index={1}
      />
      <SummaryCard
        title="Total Expenses"
        amount={expenses}
        icon={ArrowDownCircle}
        trend={expenseTrend}
        variant="expense"
        index={2}
      />
    </div>
  );
}
