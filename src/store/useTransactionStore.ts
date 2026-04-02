'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction } from '@/types';
import { mockTransactions } from '@/lib/mockData';
import {
  apiGetTransactions,
  apiCreateTransaction,
  apiUpdateTransaction,
  apiDeleteTransaction,
} from '@/lib/mockApi';

interface TransactionStore {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, updates: Partial<Omit<Transaction, 'id'>>) => void;
  deleteTransaction: (id: string) => void;
  resetToMockData: () => void;
}

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set) => ({
      transactions: mockTransactions,
      isLoading: false,
      error: null,

      initialize: async () => {
        set({ isLoading: true, error: null });
        try {
          const transactions = await apiGetTransactions();
          set({ transactions, isLoading: false });
        } catch {
          set({ error: 'Failed to load transactions', isLoading: false });
        }
      },

      addTransaction: (t) => {
        const newTx = { ...t, id: crypto.randomUUID() };
        // Optimistic update
        set((state) => ({ transactions: [newTx, ...state.transactions] }));
        // Sync with API in background
        apiCreateTransaction(t).catch(console.error);
      },

      updateTransaction: (id, updates) => {
        // Optimistic update
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        }));
        // Sync with API in background
        apiUpdateTransaction(id, updates).catch(console.error);
      },

      deleteTransaction: (id) => {
        // Optimistic update
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }));
        // Sync with API in background
        apiDeleteTransaction(id).catch(console.error);
      },

      resetToMockData: () => set({ transactions: mockTransactions }),
    }),
    {
      name: 'finance-transactions',
      partialize: (state) => ({ transactions: state.transactions }),
    }
  )
);
