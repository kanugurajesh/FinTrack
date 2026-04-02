'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Receipt, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTransactionStore } from '@/store/useTransactionStore';
import { getTotals, formatCurrency } from '@/lib/computations';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/transactions', label: 'Transactions', icon: Receipt },
  { href: '/dashboard/insights', label: 'Insights', icon: Lightbulb },
];

export function Sidebar() {
  const pathname = usePathname();
  const transactions = useTransactionStore((s) => s.transactions);
  const { balance } = getTotals(transactions);

  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen border-r border-border bg-sidebar relative">
      {/* Subtle amber glow at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      {/* Logo */}
      <div className="px-6 pt-7 pb-8">
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center">
            <div className="absolute inset-0 rounded-lg bg-primary/15 border border-primary/30" />
            <span className="relative font-[family-name:var(--font-syne)] font-800 text-primary text-sm tracking-tight">FT</span>
          </div>
          <div>
            <p className="font-[family-name:var(--font-syne)] font-semibold text-foreground text-sm tracking-wide">
              FinTrack
            </p>
            <p className="text-[10px] text-muted-foreground tracking-widest uppercase">
              Dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Balance chip */}
      <div className="mx-4 mb-6 rounded-lg border border-border bg-muted/30 px-4 py-3">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Net Balance</p>
        <p className={cn(
          'font-[family-name:var(--font-jetbrains)] text-xl font-semibold tabular-nums',
          balance >= 0 ? 'text-income' : 'text-expense'
        )}>
          {formatCurrency(balance)}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-0.5 px-3">
        <p className="px-3 text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
          Menu
        </p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'group relative flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-150',
                active
                  ? 'text-primary bg-primary/8'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/4'
              )}
            >
              {/* Active indicator bar */}
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-primary" />
              )}
              <Icon className={cn(
                'h-4 w-4 shrink-0 transition-colors',
                active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
              )} />
              <span className={cn(
                'font-medium',
                active ? 'text-primary' : ''
              )}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="mt-auto px-6 pb-6">
        <div className="border-t border-border pt-4">
          <p className="text-[10px] text-muted-foreground/40 tracking-wider">
            v1.0.0 · Oct 2025 – Mar 2026
          </p>
        </div>
      </div>
    </aside>
  );
}
