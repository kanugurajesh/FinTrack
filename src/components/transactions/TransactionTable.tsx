'use client';

import { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useFilterStore } from '@/store/useFilterStore';
import { useTransactionStore } from '@/store/useTransactionStore';
import { usePermissions } from '@/hooks/usePermissions';
import { useFilteredTransactions } from '@/hooks/useFilteredTransactions';
import { Skeleton } from '@/components/ui/skeleton';
import { Transaction, SortKey } from '@/types';
import { formatCurrency } from '@/lib/computations';
import { TransactionModal } from './TransactionModal';
import { EmptyState } from './EmptyState';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

const CATEGORY_DOT: Record<string, string> = {
  'Food & Dining': 'bg-orange-400',
  Transport:       'bg-blue-400',
  Shopping:        'bg-pink-400',
  Entertainment:   'bg-violet-400',
  Health:          'bg-emerald-400',
  Housing:         'bg-yellow-400',
  Salary:          'bg-green-400',
  Freelance:       'bg-cyan-400',
  Investments:     'bg-indigo-400',
  Other:           'bg-slate-400',
};

function SortIcon({ col, sortKey, dir }: { col: SortKey; sortKey: SortKey; dir: 'asc' | 'desc' }) {
  if (col !== sortKey) return <ChevronsUpDown className="h-3 w-3 opacity-25 ml-1" />;
  return dir === 'asc'
    ? <ChevronUp className="h-3 w-3 ml-1 text-primary" />
    : <ChevronDown className="h-3 w-3 ml-1 text-primary" />;
}

function SortableHead({ col, label, right = false, sortKey, dir, onSort }: {
  col: SortKey; label: string; right?: boolean;
  sortKey: SortKey; dir: 'asc' | 'desc';
  onSort: (k: SortKey) => void;
}) {
  return (
    <TableHead
      className={cn(
        'cursor-pointer select-none text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors font-[family-name:var(--font-dm-sans)]',
        right && 'text-right'
      )}
      onClick={() => onSort(col)}
    >
      <div className={cn('flex items-center gap-0', right && 'justify-end')}>
        {label}
        <SortIcon col={col} sortKey={sortKey} dir={dir} />
      </div>
    </TableHead>
  );
}

export function TransactionTable() {
  const transactions = useFilteredTransactions();
  const { deleteTransaction, isLoading } = useTransactionStore();
  const { canEdit, canDelete } = usePermissions();
  const { sortKey, sortDirection, setSort } = useFilterStore();
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);

  function handleDelete() {
    if (!deleteTarget) return;
    deleteTransaction(deleteTarget.id);
    toast.success('Transaction deleted');
    setDeleteTarget(null);
  }

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border bg-muted/20 hover:bg-muted/20">
              {['Date', 'Description', 'Category', 'Type', 'Amount'].map((h) => (
                <TableHead key={h} className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 8 }).map((_, i) => (
              <TableRow key={i} className="border-b border-border/50">
                <TableCell className="py-3"><Skeleton className="h-3 w-16" /></TableCell>
                <TableCell className="py-3"><Skeleton className="h-3 w-40" /></TableCell>
                <TableCell className="py-3"><Skeleton className="h-3 w-24" /></TableCell>
                <TableCell className="py-3"><Skeleton className="h-5 w-16 rounded" /></TableCell>
                <TableCell className="py-3 text-right"><Skeleton className="h-3 w-20 ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (transactions.length === 0) return <EmptyState />;

  return (
    <>
      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border bg-muted/20 hover:bg-muted/20">
              <SortableHead col="date" label="Date" sortKey={sortKey} dir={sortDirection} onSort={setSort} />
              <SortableHead col="description" label="Description" sortKey={sortKey} dir={sortDirection} onSort={setSort} />
              <SortableHead col="category" label="Category" sortKey={sortKey} dir={sortDirection} onSort={setSort} />
              <TableHead className="text-[10px] uppercase tracking-widest text-muted-foreground font-[family-name:var(--font-dm-sans)]">
                Type
              </TableHead>
              <SortableHead col="amount" label="Amount" right sortKey={sortKey} dir={sortDirection} onSort={setSort} />
              {(canEdit || canDelete) && <TableHead className="w-16" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((t, i) => (
              <TableRow
                key={t.id}
                className={cn(
                  'group border-b border-border/50 hover:bg-muted/20 transition-colors',
                  i % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'
                )}
              >
                {/* Date */}
                <TableCell className="text-xs font-[family-name:var(--font-jetbrains)] text-muted-foreground whitespace-nowrap py-3">
                  {format(parseISO(t.date), 'MMM dd, yy')}
                </TableCell>

                {/* Description */}
                <TableCell className="py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground leading-tight">
                      {t.description}
                    </p>
                    {t.note && (
                      <p className="text-xs text-muted-foreground mt-0.5 font-[family-name:var(--font-jetbrains)]">
                        {t.note}
                      </p>
                    )}
                  </div>
                </TableCell>

                {/* Category */}
                <TableCell className="py-3">
                  <div className="flex items-center gap-2">
                    <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', CATEGORY_DOT[t.category] ?? 'bg-muted')} />
                    <span className="text-xs text-muted-foreground">{t.category}</span>
                  </div>
                </TableCell>

                {/* Type badge */}
                <TableCell className="py-3">
                  <span className={cn(
                    'inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-[family-name:var(--font-jetbrains)] px-2 py-0.5 rounded border',
                    t.type === 'income'
                      ? 'border-income/30 text-income bg-income/8'
                      : 'border-expense/30 text-expense bg-expense/8'
                  )}>
                    {t.type === 'income' ? '↑' : '↓'} {t.type}
                  </span>
                </TableCell>

                {/* Amount */}
                <TableCell className={cn(
                  'text-right py-3 font-[family-name:var(--font-jetbrains)] font-semibold tabular-nums',
                  t.type === 'income' ? 'text-income' : 'text-expense'
                )}>
                  {t.type === 'income' ? '+' : '−'}{formatCurrency(t.amount)}
                </TableCell>

                {/* Actions */}
                {(canEdit || canDelete) && (
                  <TableCell className="py-3 text-right">
                    <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {canEdit && <TransactionModal mode="edit" transaction={t} />}
                      {canDelete && (
                        <button
                          onClick={() => setDeleteTarget(t)}
                          className="p-1.5 rounded-md hover:bg-expense/10 text-muted-foreground hover:text-expense transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!deleteTarget} onOpenChange={(o: boolean) => !o && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-[family-name:var(--font-syne)]">Delete transaction?</DialogTitle>
            <DialogDescription>
              <span className="font-[family-name:var(--font-jetbrains)] text-foreground">
                &quot;{deleteTarget?.description}&quot;
              </span>
              {' '}will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end pt-1">
            <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
