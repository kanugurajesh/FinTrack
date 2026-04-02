'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useTransactionStore } from '@/store/useTransactionStore';
import { useFilterStore } from '@/store/useFilterStore';
import { getCategoryBreakdown, formatCurrency } from '@/lib/computations';
import { Category } from '@/types';

// Refined palette: amber-led, harmonious
const PALETTE = [
  'oklch(0.76 0.148 68)',   // amber (primary)
  'oklch(0.72 0.17 152)',   // green
  'oklch(0.65 0.16 290)',   // violet
  'oklch(0.70 0.14 220)',   // cyan-blue
  'oklch(0.64 0.195 27)',   // red
  'oklch(0.73 0.13 170)',   // teal
  'oklch(0.68 0.16 50)',    // orange
  'oklch(0.66 0.13 310)',   // pink
  'oklch(0.71 0.12 260)',   // indigo
  'oklch(0.60 0.10 240)',   // steel blue
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="rounded-lg border border-border bg-card px-3.5 py-2.5 shadow-xl">
      <p className="text-xs font-[family-name:var(--font-syne)] font-medium text-foreground mb-1">
        {d.name}
      </p>
      <p className="text-xs text-muted-foreground">
        <span className="font-[family-name:var(--font-jetbrains)] text-foreground font-semibold">
          {formatCurrency(d.value)}
        </span>
        {' '}· {d.payload.percentage.toFixed(1)}%
      </p>
    </div>
  );
}

export function SpendingBreakdown() {
  const transactions = useTransactionStore((s) => s.transactions);
  const setCategory = useFilterStore((s) => s.setCategory);
  const breakdown = getCategoryBreakdown(transactions);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handlePieClick(data: any) {
    if (data && typeof data.category === 'string') {
      setCategory(data.category as Category);
      window.location.href = '/dashboard/transactions';
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-5">
        <p className="font-[family-name:var(--font-syne)] font-semibold text-sm text-foreground">
          Spending Breakdown
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Click a segment to filter transactions
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Donut */}
        <div className="shrink-0">
          <ResponsiveContainer width={160} height={160}>
            <PieChart>
              <Pie
                data={breakdown}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={72}
                paddingAngle={2}
                strokeWidth={0}
                onClick={handlePieClick}
                style={{ cursor: 'pointer' }}
              >
                {breakdown.map((entry, index) => (
                  <Cell
                    key={entry.category}
                    fill={PALETTE[index % PALETTE.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend: scrollable list */}
        <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[160px] pr-1 flex-1 min-w-0">
          {breakdown.slice(0, 8).map((entry, index) => (
            <button
              key={entry.category}
              onClick={() => {
                setCategory(entry.category as Category);
                window.location.href = '/dashboard/transactions';
              }}
              className="flex items-center gap-2 text-left group w-full"
            >
              <span
                className="h-2 w-2 rounded-sm shrink-0"
                style={{ background: PALETTE[index % PALETTE.length] }}
              />
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors truncate flex-1 min-w-0">
                {entry.category}
              </span>
              <span className="text-xs font-[family-name:var(--font-jetbrains)] tabular-nums text-muted-foreground shrink-0">
                {entry.percentage.toFixed(0)}%
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
