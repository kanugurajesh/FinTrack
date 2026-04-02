'use client';

import { useTransactionStore } from '@/store/useTransactionStore';
import { generateInsights } from '@/lib/insights';
import { InsightCard } from './InsightCard';

export function ObservationsList() {
  const transactions = useTransactionStore((s) => s.transactions);
  const insights = generateInsights(transactions);

  if (insights.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No insights available yet. Add more transactions to see observations.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {insights.map((insight) => (
        <InsightCard key={insight.id} insight={insight} />
      ))}
    </div>
  );
}
