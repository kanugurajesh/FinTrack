'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useTransactionStore } from '@/store/useTransactionStore';
import { getMonthlyTrend } from '@/lib/computations';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3.5 py-2.5 shadow-xl">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">{label}</p>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-sm" style={{ background: entry.fill }} />
            <span className="text-xs text-muted-foreground">{entry.name}</span>
          </div>
          <span
            className="text-xs font-semibold tabular-nums"
            style={{ fontFamily: 'var(--font-jetbrains)', color: entry.fill }}
          >
            ${entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export function MonthlyComparison() {
  const transactions = useTransactionStore((s) => s.transactions);
  const data = getMonthlyTrend(transactions).slice(-4);

  const incomeColor = 'oklch(0.72 0.17 152)';
  const expenseColor = 'oklch(0.64 0.195 27)';

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <p className="font-[family-name:var(--font-syne)] font-semibold text-sm text-foreground">
            Monthly Comparison
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">Last 4 months</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-sm bg-income" />
            <span className="text-muted-foreground">Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-sm bg-expense" />
            <span className="text-muted-foreground">Expenses</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barCategoryGap="35%" barGap={3}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="oklch(0.22 0.024 248)"
            strokeOpacity={0.6}
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 10, fill: 'oklch(0.50 0.022 248)', fontFamily: 'var(--font-jetbrains)' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'oklch(0.50 0.022 248)', fontFamily: 'var(--font-jetbrains)' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'oklch(0.22 0.024 248 / 0.4)' }} />
          <Bar dataKey="income" name="Income" fill={incomeColor} radius={[3, 3, 0, 0]} opacity={0.85} />
          <Bar dataKey="expenses" name="Expenses" fill={expenseColor} radius={[3, 3, 0, 0]} opacity={0.85} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
