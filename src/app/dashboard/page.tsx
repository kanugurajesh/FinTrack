import { SummaryCards } from '@/components/overview/SummaryCards';
import { BalanceTrendChart } from '@/components/overview/BalanceTrendChart';
import { SpendingBreakdown } from '@/components/overview/SpendingBreakdown';

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
            Oct 2025 – Mar 2026
          </p>
          <h2 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-foreground">
            Financial Overview
          </h2>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground font-[family-name:var(--font-jetbrains)]">
          <span className="h-1.5 w-1.5 rounded-full bg-income animate-pulse" />
          Live data
        </div>
      </div>

      <SummaryCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <BalanceTrendChart />
        <SpendingBreakdown />
      </div>
    </div>
  );
}
