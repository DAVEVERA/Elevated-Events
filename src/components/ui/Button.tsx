'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  as?: 'button' | 'a';
  href?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, as, href, ...props }, ref) => {
    const isPrimary = variant === 'primary';

    if (isPrimary) {
      const sizeClasses = {
        sm: '!min-h-9 !px-4 !text-sm',
        md: '',
        lg: '!min-h-[60px] !px-8 !text-lg',
      };

      if (as === 'a' && href) {
        return (
          <a href={href} className={cn('btn-elevated', sizeClasses[size], 'disabled:opacity-50', className)}>
            <span className="relative z-[1] flex items-center gap-2">
              {loading ? <Spinner /> : children}
            </span>
          </a>
        );
      }

      return (
        <button
          ref={ref}
          className={cn('btn-elevated', sizeClasses[size], className)}
          disabled={disabled || loading}
          {...props}
        >
          <span className="relative z-[1] flex items-center gap-2">
            {loading ? <Spinner /> : children}
          </span>
        </button>
      );
    }

    const baseStyles =
      'inline-flex items-center justify-center font-extrabold rounded-[10px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-deep-gold/50 disabled:opacity-50 disabled:pointer-events-none';

    const variants = {
      secondary:
        'bg-white/[0.04] text-dark-cream border border-dark-line hover:bg-white/[0.08] hover:border-dark-gold/40',
      ghost:
        'text-dark-muted hover:text-dark-cream hover:bg-white/[0.04]',
      danger:
        'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30',
    };

    const sizes = {
      sm: 'min-h-9 px-4 text-sm',
      md: 'min-h-[52px] px-6 text-base',
      lg: 'min-h-[60px] px-8 text-lg',
    };

    if (as === 'a' && href) {
      return (
        <a href={href} className={cn(baseStyles, variants[variant as keyof typeof variants], sizes[size], className)}>
          {loading ? <Spinner /> : children}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant as keyof typeof variants], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? <Spinner /> : children}
      </button>
    );
  }
);

Button.displayName = 'Button';

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

export default Button;
