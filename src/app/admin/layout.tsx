'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function checkAuth() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user && pathname !== '/admin/login') {
        router.replace('/admin/login');
        return;
      }

      setAuthChecked(true);
    }

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && pathname !== '/admin/login') {
        router.replace('/admin/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [router, pathname]);

  if (pathname === '/admin/login') {
    return (
      <div className="min-h-screen bg-[var(--color-dark-bg)] font-sans">
        {children}
      </div>
    );
  }

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-dark-bg)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-dark-gold)]/30 border-t-[var(--color-dark-gold)]" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-dark-bg)] font-sans text-[var(--color-dark-text)]">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
