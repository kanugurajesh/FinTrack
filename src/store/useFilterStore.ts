'use client';

import { create } from 'zustand';
import { FilterState, Category, TransactionType, SortKey, SortDirection } from '@/types';

interface FilterStore extends FilterState {
  setSearch: (search: string) => void;
  setCategory: (category: Category | 'All') => void;
  setType: (type: TransactionType | 'All') => void;
  setDateFrom: (date: string) => void;
  setDateTo: (date: string) => void;
  setSort: (key: SortKey, direction?: SortDirection) => void;
  resetFilters: () => void;
}

const defaultState: FilterState = {
  search: '',
  category: 'All',
  type: 'All',
  dateFrom: '',
  dateTo: '',
  sortKey: 'date',
  sortDirection: 'desc',
};

export const useFilterStore = create<FilterStore>()((set, get) => ({
  ...defaultState,

  setSearch: (search) => set({ search }),
  setCategory: (category) => set({ category }),
  setType: (type) => set({ type }),
  setDateFrom: (dateFrom) => set({ dateFrom }),
  setDateTo: (dateTo) => set({ dateTo }),

  setSort: (key, direction) => {
    const current = get();
    if (direction) {
      set({ sortKey: key, sortDirection: direction });
    } else {
      // Toggle direction if same key
      const newDir: SortDirection =
        current.sortKey === key && current.sortDirection === 'asc' ? 'desc' : 'asc';
      set({ sortKey: key, sortDirection: newDir });
    }
  },

  resetFilters: () => set(defaultState),
}));
