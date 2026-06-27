'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import {
  LayoutDashboard,
  Users,
  Calendar,
  CheckSquare,
  Settings,
  Menu,
  X,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/leads', label: 'Leads', icon: Users },
  { href: '/admin/meetings', label: 'Meetings', icon: Calendar },
  { href: '/admin/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggle = useCallback(() => setMobileOpen((v) => !v), []);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  const navContent = (
    <>
      <div className="flex h-16 items-center px-6">
        <Link
          href="/admin/dashboard"
          className="font-serif text-xl font-semibold tracking-[0.2em] text-[var(--color-dark-soft-gold)]"
        >
          ELEVATED
        </Link>
      </div>

      <nav className="mt-4 flex-1 space-y-1 px-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-[var(--color-dark-gold)]/10 text-[var(--color-dark-soft-gold)]'
                  : 'text-[var(--color-dark-muted)] hover:bg-white/[0.04] hover:text-[var(--color-dark-text)]'
              )}
            >
              <span
                className={cn(
                  'absolute left-0 h-6 w-[3px] rounded-r-full transition-all duration-150',
                  active
                    ? 'bg-[var(--color-dark-gold)]'
                    : 'bg-transparent'
                )}
              />
              <Icon
                className={cn(
                  'h-[18px] w-[18px] shrink-0 transition-colors',
                  active ? 'text-[var(--color-dark-gold)]' : 'text-[var(--color-dark-muted)] group-hover:text-[var(--color-dark-text)]'
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[var(--color-dark-line)] px-6 py-4">
        <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--color-dark-muted)]/50">
          Elevated Eventmaker
        </p>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={toggle}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-dark-surface)] text-[var(--color-dark-muted)] ring-1 ring-[var(--color-dark-line)] lg:hidden"
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={toggle}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-[var(--color-dark-line)] bg-[var(--color-dark-surface)] transition-transform duration-200 lg:static lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {navContent}
      </aside>
    </>
  );
}
