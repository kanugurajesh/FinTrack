'use client';

import { useMemo } from 'react';
import { useTransactionStore } from '@/store/useTransactionStore';
import { useFilterStore } from '@/store/useFilterStore';
import { Transaction } from '@/types';

export function useFilteredTransactions(): Transaction[] {
  const transactions = useTransactionStore((s) => s.transactions);
  const { search, category, type, dateFrom, dateTo, sortKey, sortDirection } = useFilterStore();

  return useMemo(() => {
    let result = [...transactions];

    // Search filter
    if (search.trim()) {
      const lower = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(lower) ||
          t.category.toLowerCase().includes(lower) ||
          (t.note ?? '').toLowerCase().includes(lower)
      );
    }

    // Category filter
    if (category !== 'All') {
      result = result.filter((t) => t.category === category);
    }

    // Type filter
    if (type !== 'All') {
      result = result.filter((t) => t.type === type);
    }

    // Date range filter
    if (dateFrom) {
      result = result.filter((t) => t.date >= dateFrom);
    }
    if (dateTo) {
      result = result.filter((t) => t.date <= dateTo);
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'date') {
        cmp = a.date.localeCompare(b.date);
      } else if (sortKey === 'amount') {
        cmp = a.amount - b.amount;
      } else if (sortKey === 'category') {
        cmp = a.category.localeCompare(b.category);
      } else if (sortKey === 'description') {
        cmp = a.description.localeCompare(b.description);
      }
      return sortDirection === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [transactions, search, category, type, dateFrom, dateTo, sortKey, sortDirection]);
}
