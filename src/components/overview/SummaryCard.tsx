'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/computations';

interface SummaryCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  trend?: number;
  variant: 'balance' | 'income' | 'expense';
  index: number;
}

const variantConfig = {
  balance: {
    accent: 'oklch(0.76 0.148 68)',   // amber
    accentClass: 'text-primary',
    borderClass: 'border-primary/20',
    labelDot: 'bg-primary',
    glowClass: 'hover:glow-amber',
    trendPositive: true, // higher is always good
  },
  income: {
    accent: 'oklch(0.72 0.17 152)',   // green
    accentClass: 'text-income',
    borderClass: 'border-income/20',
    labelDot: 'bg-income',
    glowClass: 'hover:glow-income',
    trendPositive: true,
  },
  expense: {
    accent: 'oklch(0.64 0.195 27)',   // red
    accentClass: 'text-expense',
    borderClass: 'border-expense/20',
    labelDot: 'bg-expense',
    glowClass: 'hover:glow-expense',
    trendPositive: false,
  },
};

export function SummaryCard({ title, amount, icon: Icon, trend, variant, index }: SummaryCardProps) {
  const config = variantConfig[variant];
  const isPositiveTrend = trend !== undefined && (config.trendPositive ? trend >= 0 : trend <= 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        'group relative rounded-xl border bg-card p-5 transition-all duration-200 cursor-default',
        config.borderClass,
        config.glowClass
      )}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-6 right-6 h-px rounded-full opacity-60"
        style={{ background: `linear-gradient(90deg, transparent, ${config.accent}, transparent)` }}
      />

      {/* Header row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={cn('h-1.5 w-1.5 rounded-full', config.labelDot)} />
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-[family-name:var(--font-dm-sans)]">
            {title}
          </span>
        </div>
        <div className={cn(
          'h-8 w-8 rounded-lg border flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity',
          config.borderClass
        )}>
          <Icon className={cn('h-3.5 w-3.5', config.accentClass)} />
        </div>
      </div>

      {/* Amount — large monospace */}
      <p className={cn(
        'font-[family-name:var(--font-jetbrains)] text-3xl font-semibold tabular-nums leading-none',
        config.accentClass
      )}>
        {formatCurrency(amount)}
      </p>

      {/* Trend */}
      {trend !== undefined ? (
        <p className={cn(
          'mt-3 text-xs font-[family-name:var(--font-jetbrains)] tabular-nums',
          isPositiveTrend ? 'text-income' : 'text-expense'
        )}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%{' '}
          <span className="text-muted-foreground font-[family-name:var(--font-dm-sans)]">
            vs last month
          </span>
        </p>
      ) : (
        <p className="mt-3 text-xs text-muted-foreground">All time total</p>
      )}
    </motion.div>
  );
}
