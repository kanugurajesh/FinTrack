import { TopCategoryCard } from '@/components/insights/TopCategoryCard';
import { MonthlyComparison } from '@/components/insights/MonthlyComparison';
import { ObservationsList } from '@/components/insights/ObservationsList';

export default function InsightsPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
          AI-generated
        </p>
        <h2 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-foreground">
          Financial Insights
        </h2>
      </div>

      <TopCategoryCard />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <MonthlyComparison />
        </div>
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Observations</p>
          </div>
          <ObservationsList />
        </div>
      </div>
    </div>
  );
}
