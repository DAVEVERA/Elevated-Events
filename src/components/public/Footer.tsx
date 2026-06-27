import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

const footerNav = [
  { label: 'Diensten', href: '#diensten' },
  { label: 'Aanpak', href: '#aanpak' },
  { label: 'Events', href: '#events' },
  { label: 'Verhaal', href: '#verhaal' },
  { label: 'FAQ', href: '#faq' },
];

const legalNav = [
  { label: 'Privacyverklaring', href: '/privacyverklaring' },
  { label: 'Cookieverklaring', href: '/cookieverklaring' },
  { label: 'Algemene voorwaarden', href: '/algemene-voorwaarden' },
  { label: 'Verwerkersovereenkomst', href: '/verwerkersovereenkomst' },
];

export default function Footer() {
  return (
    <footer className="tone-dark pb-7 pt-12 min-[640px]:pt-14">
      <div
        className={cn(
          'section-inner px-5',
          'grid gap-10 pb-11',
          'grid-cols-1',
          'min-[640px]:grid-cols-2 min-[640px]:gap-12',
          'min-[1024px]:grid-cols-[1.05fr_.65fr_.9fr_.9fr_.55fr] min-[1024px]:px-8',
        )}
      >
        <div>
          <div className="mb-3 font-serif text-[1.75rem] uppercase tracking-[.18em] text-deep-gold min-[640px]:text-[2rem]">
            Elevated
          </div>
          <p className="max-w-[320px] text-[.9rem] leading-relaxed text-text-muted min-[640px]:text-[.95rem]">
            Eventbranding op maat voor zakelijke live events, merkactivaties,
            klantendagen en business events.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-[.82rem] font-semibold uppercase tracking-[.12em] text-deep-gold min-[640px]:mb-3.5 min-[640px]:text-base min-[640px]:normal-case min-[640px]:tracking-normal">
            Juridisch
          </h3>
          <div className="grid gap-2 min-[640px]:gap-[9px]">
            {legalNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="min-h-[44px] text-[.9rem] leading-[44px] text-text-muted transition-colors duration-300 hover:text-deep-gold min-[640px]:min-h-0 min-[640px]:text-[.95rem] min-[640px]:leading-normal"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-[.82rem] font-semibold uppercase tracking-[.12em] text-deep-gold min-[640px]:mb-3.5 min-[640px]:text-base min-[640px]:normal-case min-[640px]:tracking-normal">
            Navigatie
          </h3>
          <div className="grid gap-2 min-[640px]:gap-[9px]">
            {footerNav.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="min-h-[44px] text-[.9rem] leading-[44px] text-text-muted transition-colors duration-300 hover:text-deep-gold min-[640px]:min-h-0 min-[640px]:text-[.95rem] min-[640px]:leading-normal"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-[.82rem] font-semibold uppercase tracking-[.12em] text-deep-gold min-[640px]:mb-3.5 min-[640px]:text-base min-[640px]:normal-case min-[640px]:tracking-normal">
            Contact
          </h3>
          <div className="grid gap-2 min-[640px]:gap-[9px]">
            <a
              href="mailto:info@elevated-eventmaker.nl"
              className="min-h-[44px] text-[.9rem] leading-[44px] text-text-muted transition-colors duration-300 hover:text-deep-gold min-[640px]:min-h-0 min-[640px]:text-[.95rem] min-[640px]:leading-normal"
            >
              info@elevated-eventmaker.nl
            </a>
            <a
              href="tel:+31612345678"
              className="min-h-[44px] text-[.9rem] leading-[44px] text-text-muted transition-colors duration-300 hover:text-deep-gold min-[640px]:min-h-0 min-[640px]:text-[.95rem] min-[640px]:leading-normal"
            >
              +31 6 12 34 56 78
            </a>
            <Link
              href="/"
              className="min-h-[44px] text-[.9rem] leading-[44px] text-text-muted transition-colors duration-300 hover:text-deep-gold min-[640px]:min-h-0 min-[640px]:text-[.95rem] min-[640px]:leading-normal"
            >
              elevated-eventmaker.nl
            </Link>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-[.82rem] font-semibold uppercase tracking-[.12em] text-deep-gold min-[640px]:mb-3.5 min-[640px]:text-base min-[640px]:normal-case min-[640px]:tracking-normal">
            Volg ons
          </h3>
          <div className="flex gap-3">
            <a
              href="https://instagram.com/elevated.eventmaker"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Volg Elevated op Instagram"
              className="social-gold"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a
              href="https://linkedin.com/company/elevated-eventmaker"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Volg Elevated op LinkedIn"
              className="social-gold"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div
        className={cn(
          'section-inner border-t border-border-soft/50 px-5 pt-6',
          'text-center text-[.78rem] uppercase tracking-[.12em] text-text-muted/70',
          'min-[640px]:text-[.82rem] min-[640px]:tracking-[.16em]',
          'min-[1024px]:px-0',
        )}
      >
        <div>
          &copy; {new Date().getFullYear()} Elevated Eventmaker &middot;
          Eventbranding for Business Events
        </div>
      </div>
    </footer>
  );
}
