'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { Search, Bell, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function AdminTopbar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSignOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
  }, [router]);

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-[var(--color-dark-line)] bg-[var(--color-dark-surface)] px-6">
      <div className="w-10 lg:hidden" />

      <div className="relative max-w-md flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-dark-muted)]" />
        <input
          type="text"
          placeholder="Search leads, meetings, tasks..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={cn(
            'h-9 w-full rounded-lg border border-[var(--color-dark-line)] bg-[var(--color-dark-bg)] pl-9 pr-4 text-sm text-[var(--color-dark-text)] placeholder:text-[var(--color-dark-muted)]/60',
            'outline-none transition-colors focus:border-[var(--color-dark-gold)]/50 focus:ring-1 focus:ring-[var(--color-dark-gold)]/20'
          )}
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-dark-muted)] transition-colors hover:bg-white/[0.04] hover:text-[var(--color-dark-text)]"
          aria-label="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[var(--color-dark-gold)]" />
        </button>

        <button
          onClick={handleSignOut}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-dark-muted)] transition-colors hover:bg-white/[0.04] hover:text-[var(--color-dark-text)]"
          aria-label="Sign out"
        >
          <LogOut className="h-[18px] w-[18px]" />
        </button>
      </div>
    </header>
  );
}
