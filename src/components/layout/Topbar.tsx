'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LayoutDashboard, Receipt, Lightbulb } from 'lucide-react';
import { RoleSwitcher } from './RoleSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { useRoleStore } from '@/store/useRoleStore';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/transactions', label: 'Transactions', icon: Receipt },
  { href: '/dashboard/insights', label: 'Insights', icon: Lightbulb },
];

const pageTitles: Record<string, string> = {
  '/dashboard': 'Overview',
  '/dashboard/transactions': 'Transactions',
  '/dashboard/insights': 'Insights',
};

export function Topbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const role = useRoleStore((s) => s.role);

  return (
    <>
      <header className="h-14 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
        {/* Mobile: logo + hamburger */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
          <span className="font-[family-name:var(--font-syne)] font-semibold text-sm text-foreground">
            FinTrack
          </span>
        </div>

        {/* Desktop: breadcrumb-style title */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-muted-foreground/40 text-xs font-[family-name:var(--font-jetbrains)]">
            fintrack
          </span>
          <span className="text-muted-foreground/30 text-xs">/</span>
          <span className="text-sm font-medium font-[family-name:var(--font-syne)] text-foreground">
            {pageTitles[pathname] ?? 'Dashboard'}
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <RoleSwitcher />

          {/* Avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-border">
            <div className={cn(
              'h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-[family-name:var(--font-jetbrains)] font-semibold',
              role === 'admin'
                ? 'bg-primary/15 border border-primary/30 text-primary'
                : 'bg-muted border border-border text-muted-foreground'
            )}>
              {role === 'admin' ? 'AD' : 'VW'}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-20 top-14">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <nav className="relative bg-sidebar border-r border-border w-64 min-h-full p-4 flex flex-col gap-1">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors relative',
                    active
                      ? 'text-primary bg-primary/8'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/4'
                  )}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-primary" />
                  )}
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
