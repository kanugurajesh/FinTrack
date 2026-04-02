'use client';

import { useTransactionStore } from '@/store/useTransactionStore';
import { getCategoryBreakdown, formatCurrency } from '@/lib/computations';

export function TopCategoryCard() {
  const transactions = useTransactionStore((s) => s.transactions);
  const breakdown = getCategoryBreakdown(transactions);
  const top = breakdown[0];
  const second = breakdown[1];

  if (!top) return null;

  return (
    <div className="relative rounded-xl border border-primary/20 bg-card overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="relative p-6">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
          Highest Spending Category
        </p>

        <div className="flex items-end justify-between gap-4">
          <div>
            <h3 className="font-[family-name:var(--font-syne)] text-4xl font-bold text-primary leading-none">
              {top.category}
            </h3>
            <p className="font-[family-name:var(--font-jetbrains)] text-2xl font-semibold text-foreground mt-2">
              {formatCurrency(top.amount)}
            </p>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-xs text-muted-foreground">
                <span className="font-[family-name:var(--font-jetbrains)] text-foreground">
                  {top.percentage.toFixed(1)}%
                </span>{' '}
                of all expenses
              </span>
              <span className="text-xs text-muted-foreground">
                <span className="font-[family-name:var(--font-jetbrains)] text-foreground">
                  {top.count}
                </span>{' '}
                transactions
              </span>
            </div>
          </div>

          {/* Secondary category */}
          {second && (
            <div className="text-right shrink-0">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Runner-up</p>
              <p className="font-[family-name:var(--font-syne)] text-lg font-semibold text-foreground">
                {second.category}
              </p>
              <p className="font-[family-name:var(--font-jetbrains)] text-sm text-muted-foreground">
                {formatCurrency(second.amount)}
              </p>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-5">
          <div className="h-1 rounded-full bg-border overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-700"
              style={{ width: `${Math.min(top.percentage, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
