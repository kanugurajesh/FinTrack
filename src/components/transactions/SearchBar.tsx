'use client';

import { Search, X } from 'lucide-react';
import { useFilterStore } from '@/store/useFilterStore';
import { useDebounce } from '@/hooks/useDebounce';
import { useState, useEffect } from 'react';

export function SearchBar() {
  const setSearch = useFilterStore((s) => s.setSearch);
  const [value, setValue] = useState('');
  const debounced = useDebounce(value, 300);

  useEffect(() => {
    setSearch(debounced);
  }, [debounced, setSearch]);

  return (
    <div className="relative flex-1 min-w-[200px]">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
      <input
        type="text"
        placeholder="Search transactions..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full h-9 pl-9 pr-8 rounded-lg border border-border bg-muted/30 text-sm text-foreground placeholder:text-muted-foreground/50 font-[family-name:var(--font-dm-sans)] outline-none focus:border-primary/50 focus:bg-card transition-colors"
      />
      {value && (
        <button
          onClick={() => setValue('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
