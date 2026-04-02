import { Insight } from '@/types';
import {
  TrendingUp, TrendingDown, ShoppingCart, Home, PiggyBank, Tv, Briefcase, Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, React.ElementType> = {
  TrendingUp, TrendingDown, ShoppingCart, Home, PiggyBank, Tv, Briefcase,
};

const SEVERITY = {
  positive: {
    border: 'border-l-income',
    icon: 'text-income',
    label: 'text-income',
    bg: 'bg-income/5',
  },
  neutral: {
    border: 'border-l-primary',
    icon: 'text-primary',
    label: 'text-primary',
    bg: 'bg-primary/5',
  },
  warning: {
    border: 'border-l-[oklch(0.78_0.16_50)]',
    icon: 'text-[oklch(0.78_0.16_50)]',
    label: 'text-[oklch(0.78_0.16_50)]',
    bg: 'bg-[oklch(0.78_0.16_50)]/5',
  },
};

const SEVERITY_LABEL = {
  positive: 'positive',
  neutral: 'info',
  warning: 'attention',
};

export function InsightCard({ insight }: { insight: Insight }) {
  const Icon = ICON_MAP[insight.icon] ?? Info;
  const s = SEVERITY[insight.severity];

  return (
    <div className={cn(
      'rounded-lg border border-border border-l-2 p-4 flex gap-3',
      s.border,
      s.bg
    )}>
      <Icon className={cn('h-4 w-4 shrink-0 mt-0.5', s.icon)} />
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-[family-name:var(--font-syne)] font-semibold text-foreground leading-tight">
            {insight.title}
          </p>
          <span className={cn(
            'text-[9px] uppercase tracking-widest font-[family-name:var(--font-jetbrains)] px-1.5 py-0.5 rounded border',
            s.label,
            'border-current opacity-60'
          )}>
            {SEVERITY_LABEL[insight.severity]}
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
      </div>
    </div>
  );
}
