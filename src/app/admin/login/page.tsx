'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils/cn';
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setLoading(true);

      try {
        const supabase = createClient();
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) {
          setError(authError.message);
          setLoading(false);
          return;
        }

        router.replace('/admin/dashboard');
      } catch {
        setError('An unexpected error occurred. Please try again.');
        setLoading(false);
      }
    },
    [email, password, router]
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-dark-gold)]/[0.04] blur-[120px]" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="mb-10 text-center">
          <h1 className="font-serif text-3xl font-semibold tracking-[0.2em] text-[var(--color-dark-soft-gold)]">
            ELEVATED
          </h1>
          <p className="mt-2 text-sm text-[var(--color-dark-muted)]">
            Admin Portal
          </p>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-[var(--color-dark-gold)]/30 via-[var(--color-dark-line)] to-transparent p-[1px]">
          <div className="rounded-[15px] bg-[var(--color-dark-surface)] p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-start gap-2.5 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[var(--color-dark-muted)]"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-dark-muted)]" />
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={cn(
                      'h-11 w-full rounded-lg border border-[var(--color-dark-line)] bg-[var(--color-dark-bg)] pl-10 pr-4 text-sm text-[var(--color-dark-text)] placeholder:text-[var(--color-dark-muted)]/50',
                      'outline-none transition-colors focus:border-[var(--color-dark-gold)]/50 focus:ring-1 focus:ring-[var(--color-dark-gold)]/20'
                    )}
                    placeholder="gabriela@elevated-eventmaker.nl"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[var(--color-dark-muted)]"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-dark-muted)]" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={cn(
                      'h-11 w-full rounded-lg border border-[var(--color-dark-line)] bg-[var(--color-dark-bg)] pl-10 pr-10 text-sm text-[var(--color-dark-text)] placeholder:text-[var(--color-dark-muted)]/50',
                      'outline-none transition-colors focus:border-[var(--color-dark-gold)]/50 focus:ring-1 focus:ring-[var(--color-dark-gold)]/20'
                    )}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-dark-muted)] hover:text-[var(--color-dark-text)]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={cn(
                  'flex h-11 w-full items-center justify-center rounded-lg bg-[var(--color-dark-gold)] text-sm font-semibold text-[var(--color-dark-bg)] transition-all',
                  'hover:bg-[var(--color-dark-soft-gold)]',
                  'disabled:opacity-50 disabled:pointer-events-none'
                )}
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--color-dark-bg)]/30 border-t-[var(--color-dark-bg)]" />
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
