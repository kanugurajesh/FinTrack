'use client';

import { Download, FileText, FileJson } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/types';
import { exportToCSV, exportToJSON } from '@/lib/export';
import { useState, useRef, useEffect } from 'react';

interface ExportMenuProps {
  transactions: Transaction[];
}

export function ExportMenu({ transactions }: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <Button variant="outline" size="sm" className="h-9 gap-2 text-xs" onClick={() => setOpen((o) => !o)}>
        <Download className="h-3.5 w-3.5" />
        Export {transactions.length} results
      </Button>
      {open && (
        <div className="absolute right-0 mt-1 w-44 bg-popover border border-border rounded-lg shadow-lg py-1 z-10">
          <button
            className="flex items-center gap-2 px-3 py-2 text-sm w-full hover:bg-muted text-left"
            onClick={() => { exportToCSV(transactions); setOpen(false); }}
          >
            <FileText className="h-4 w-4 text-muted-foreground" />
            Export as CSV
          </button>
          <button
            className="flex items-center gap-2 px-3 py-2 text-sm w-full hover:bg-muted text-left"
            onClick={() => { exportToJSON(transactions); setOpen(false); }}
          >
            <FileJson className="h-4 w-4 text-muted-foreground" />
            Export as JSON
          </button>
        </div>
      )}
    </div>
  );
}
