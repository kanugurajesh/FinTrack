'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: entry.color }} />
            <span className="text-xs text-muted-foreground">{entry.name}</span>
          </div>
          <span
            className="text-xs font-semibold tabular-nums"
            style={{ fontFamily: 'var(--font-jetbrains)', color: entry.color }}
          >
            ${entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export function BalanceTrendChart() {
  const transactions = useTransactionStore((s) => s.transactions);
  const data = getMonthlyTrend(transactions);

  const incomeColor = 'oklch(0.72 0.17 152)';
  const expenseColor = 'oklch(0.64 0.195 27)';

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <p className="font-[family-name:var(--font-syne)] font-semibold text-sm text-foreground">
            Balance Trend
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">Income vs Expenses · 6 months</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-income" />
            <span className="text-muted-foreground">Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-expense" />
            <span className="text-muted-foreground">Expenses</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={incomeColor} stopOpacity={0.18} />
              <stop offset="100%" stopColor={incomeColor} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={expenseColor} stopOpacity={0.18} />
              <stop offset="100%" stopColor={expenseColor} stopOpacity={0} />
            </linearGradient>
            {/* Glow filters */}
            <filter id="incomeGlow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="expenseGlow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
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
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'oklch(0.22 0.024 248)', strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="income"
            stroke={incomeColor}
            strokeWidth={2}
            fill="url(#incomeGrad)"
            name="Income"
            filter="url(#incomeGlow)"
            dot={false}
            activeDot={{ r: 4, fill: incomeColor, stroke: 'oklch(0.09 0.018 248)', strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke={expenseColor}
            strokeWidth={2}
            fill="url(#expenseGrad)"
            name="Expenses"
            filter="url(#expenseGlow)"
            dot={false}
            activeDot={{ r: 4, fill: expenseColor, stroke: 'oklch(0.09 0.018 248)', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
