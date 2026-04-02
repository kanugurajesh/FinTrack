export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl border border-border/50 border-dashed">
      <div className="h-12 w-12 rounded-xl border border-border bg-muted/30 flex items-center justify-center mb-4">
        <span className="font-[family-name:var(--font-jetbrains)] text-lg text-muted-foreground/40">∅</span>
      </div>
      <p className="font-[family-name:var(--font-syne)] text-sm font-semibold text-foreground">
        No transactions found
      </p>
      <p className="text-xs text-muted-foreground mt-1.5 max-w-xs">
        Try adjusting your filters or search query to see results
      </p>
    </div>
  );
}
