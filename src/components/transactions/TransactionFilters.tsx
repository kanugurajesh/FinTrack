'use client';

import { X } from 'lucide-react';
import { useFilterStore } from '@/store/useFilterStore';
import { Category, TransactionType } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const CATEGORIES: (Category | 'All')[] = [
  'All', 'Food & Dining', 'Transport', 'Shopping', 'Entertainment',
  'Health', 'Housing', 'Salary', 'Freelance', 'Investments', 'Other',
];

const triggerClass = 'h-9 text-xs border-border bg-muted/30 font-[family-name:var(--font-dm-sans)] hover:border-primary/40 focus:border-primary/40 transition-colors';

export function TransactionFilters() {
  const { category, type, dateFrom, dateTo, setCategory, setType, setDateFrom, setDateTo, resetFilters, search } =
    useFilterStore();

  const hasActiveFilters = category !== 'All' || type !== 'All' || dateFrom !== '' || dateTo !== '' || search !== '';

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Select value={category} onValueChange={(v) => setCategory(v as Category | 'All')}>
        <SelectTrigger className={cn(triggerClass, 'w-[150px]')}>
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          {CATEGORIES.map((c) => (
            <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={type} onValueChange={(v) => setType(v as TransactionType | 'All')}>
        <SelectTrigger className={cn(triggerClass, 'w-[110px]')}>
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All" className="text-xs">All Types</SelectItem>
          <SelectItem value="income" className="text-xs">↑ Income</SelectItem>
          <SelectItem value="expense" className="text-xs">↓ Expense</SelectItem>
        </SelectContent>
      </Select>

      <input
        type="date"
        value={dateFrom}
        onChange={(e) => setDateFrom(e.target.value)}
        className="h-9 px-3 w-[136px] rounded-lg border border-border bg-muted/30 text-xs text-foreground font-[family-name:var(--font-jetbrains)] outline-none focus:border-primary/40 transition-colors [color-scheme:dark]"
      />
      <input
        type="date"
        value={dateTo}
        onChange={(e) => setDateTo(e.target.value)}
        className="h-9 px-3 w-[136px] rounded-lg border border-border bg-muted/30 text-xs text-foreground font-[family-name:var(--font-jetbrains)] outline-none focus:border-primary/40 transition-colors [color-scheme:dark]"
      />

      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="h-9 px-3 flex items-center gap-1.5 rounded-lg border border-border/50 text-xs text-muted-foreground hover:text-expense hover:border-expense/30 transition-colors"
        >
          <X className="h-3 w-3" />
          Clear
        </button>
      )}
    </div>
  );
}
