'use client';

import { SearchBar } from '@/components/transactions/SearchBar';
import { TransactionFilters } from '@/components/transactions/TransactionFilters';
import { TransactionTable } from '@/components/transactions/TransactionTable';
import { TransactionModal } from '@/components/transactions/TransactionModal';
import { ExportMenu } from '@/components/transactions/ExportMenu';
import { usePermissions } from '@/hooks/usePermissions';
import { useFilteredTransactions } from '@/hooks/useFilteredTransactions';

export default function TransactionsPage() {
  const { canAdd } = usePermissions();
  const filteredTransactions = useFilteredTransactions();

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
            All records
          </p>
          <h2 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-foreground">
            Transactions
          </h2>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <span className="text-xs font-[family-name:var(--font-jetbrains)] text-muted-foreground">
            {filteredTransactions.length} records
          </span>
          <ExportMenu transactions={filteredTransactions} />
          {canAdd && <TransactionModal mode="add" />}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <SearchBar />
        <TransactionFilters />
      </div>

      <TransactionTable />
    </div>
  );
}
