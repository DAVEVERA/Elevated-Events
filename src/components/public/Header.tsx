'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { SVGProps } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  Mail,
  Phone,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const navLinks = [
  { label: 'Diensten', href: '#diensten' },
  { label: 'Aanpak', href: '#aanpak' },
  { label: 'Events', href: '#events' },
  { label: 'Verhaal', href: '#verhaal' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </svg>
  );
}

function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.48a8.27 8.27 0 0 0 4.85 1.56V7.64a4.84 4.84 0 0 1-1.09-.95z" />
    </svg>
  );
}

function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com/elevated.eventmaker', icon: InstagramIcon },
  { label: 'TikTok', href: 'https://tiktok.com/@elevated.eventmaker', icon: TikTokIcon },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/elevated-eventmaker', icon: LinkedInIcon },
  { label: 'E-mail', href: 'mailto:info@elevated-eventmaker.nl', icon: Mail },
  { label: 'Bel ons', href: 'tel:+31612345678', icon: Phone },
];

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  const closeMobileMenu = useCallback(() => {
    setMobileOpen(false);
    requestAnimationFrame(() => menuButtonRef.current?.focus());
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 32);
      setPastHero(window.scrollY > window.innerHeight * 0.85);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMobileMenu();
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) {
        return;
      }

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter((element) => !element.hasAttribute('disabled'));

      if (focusable.length === 0) {
        return;
      }

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [closeMobileMenu, mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const focusFrame = requestAnimationFrame(() => closeButtonRef.current?.focus());
    return () => cancelAnimationFrame(focusFrame);
  }, [mobileOpen]);

  const portalTarget = typeof document === 'undefined' ? null : document.body;

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 isolate transition-all duration-500',
          scrolled
            ? 'bg-black/30 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_4px_30px_rgba(0,0,0,.3)] border-b border-white/[0.06]'
            : 'bg-white/28 backdrop-blur-xl border-b border-black/[0.04]',
        )}
      >
        <div className="mx-auto flex h-[82px] max-w-[1240px] items-center justify-between px-4 min-[420px]:px-5 lg:px-0">
          <Link
            href="/"
            className={cn(
              'group flex h-[58px] w-[218px] items-start overflow-hidden transition-all duration-500 hover:scale-[1.015] min-[520px]:w-[270px] min-[900px]:w-[320px]',
              pastHero
                ? 'opacity-100 translate-y-0'
                : 'pointer-events-none opacity-0 -translate-y-2',
            )}
            aria-label="Elevated Eventmaker home"
            tabIndex={pastHero ? undefined : -1}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-elevated-gold.svg"
              alt="Elevated"
              className="h-[336px] w-auto -translate-y-[121px] min-[520px]:h-[400px] min-[520px]:-translate-y-[144px] min-[900px]:h-[470px] min-[900px]:-translate-y-[169px]"
            />
          </Link>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMobileOpen(true)}
            className={cn(
              'gold-menu-button inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full backdrop-blur-xl transition-all duration-300 focus:outline-none focus-visible:ring-2',
              scrolled
                ? 'border border-dark-gold/45 bg-[#100b06]/72 shadow-[0_0_24px_rgba(255,210,119,.14)] hover:border-dark-soft-gold/70 hover:bg-[#171008]/82 focus-visible:ring-dark-soft-gold/70'
                : 'border border-deep-gold/35 bg-white/68 shadow-[0_0_22px_rgba(170,122,40,.12)] hover:border-deep-gold/60 hover:bg-white/84 focus-visible:ring-deep-gold/45',
            )}
            aria-label="Open menu"
            aria-controls="mobile-flyout-menu"
            aria-expanded={mobileOpen}
          >
            <span className="gold-hamburger" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </header>

      {portalTarget && createPortal(
        <AnimatePresence>
          {mobileOpen && (
          <div key="mobile-flyout-layer" className="fixed inset-0 z-[90]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-[#050403]/70 backdrop-blur-[3px]"
              onClick={closeMobileMenu}
              aria-hidden="true"
            />

            <motion.aside
              ref={panelRef}
              id="mobile-flyout-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Mobiele navigatie"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 flex h-full w-[min(390px,88vw)] flex-col overflow-hidden border-l border-[#ffd277]/20 bg-[#100b06] text-white shadow-[-24px_0_70px_rgba(0,0,0,0.45)]"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,210,119,0.18),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0)_42%)]" />

              <div className="relative flex h-[76px] items-center justify-between border-b border-white/[0.08] px-6 min-[420px]:px-8">
                <Link
                  href="/"
                  onClick={closeMobileMenu}
                  className="font-serif text-[1.35rem] uppercase tracking-[.18em] text-[#ffd277]"
                >
                  Elevated
                </Link>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={closeMobileMenu}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white transition-colors duration-200 hover:border-[#ffd277]/45 hover:bg-[#ffd277]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd277]/70"
                  aria-label="Sluit menu"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <div className="relative flex flex-1 flex-col overflow-y-auto px-6 py-8 min-[420px]:px-8">
                <nav aria-label="Mobiele hoofdnavigatie" className="grid gap-2">
                  {navLinks.map((link, i) => (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      onClick={closeMobileMenu}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.045, duration: 0.28 }}
                      className="group flex min-h-14 items-center justify-between border-b border-white/[0.07] py-3 font-serif text-[1.45rem] text-white/88 transition-colors duration-200 hover:text-[#ffd277] focus:outline-none focus-visible:text-[#ffd277]"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight
                        className="h-4 w-4 text-[#ffd277]/45 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#ffd277]"
                        aria-hidden="true"
                      />
                    </motion.a>
                  ))}
                </nav>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28, duration: 0.28 }}
                  className="mt-8"
                >
                  <Link
                    href="/planner"
                    onClick={closeMobileMenu}
                    className="btn-elevated w-full !min-h-[54px]"
                  >
                    <span>Plan een kennismaking</span>
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.36, duration: 0.28 }}
                  className="mt-auto pt-10"
                >
                  <div className="grid gap-3 border-t border-white/[0.08] pt-6">
                    <a
                      href="mailto:info@elevated-eventmaker.nl"
                      className="flex min-h-11 items-center gap-3 text-sm font-semibold text-white/72 transition-colors hover:text-[#ffd277]"
                    >
                      <Mail className="h-4 w-4 text-[#ffd277]" aria-hidden="true" />
                      info@elevated-eventmaker.nl
                    </a>
                    <a
                      href="tel:+31612345678"
                      className="flex min-h-11 items-center gap-3 text-sm font-semibold text-white/72 transition-colors hover:text-[#ffd277]"
                    >
                      <Phone className="h-4 w-4 text-[#ffd277]" aria-hidden="true" />
                      +31 6 12 34 56 78
                    </a>
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    {socialLinks.map((social) => {
                      const Icon = social.icon;

                      return (
                        <a
                          key={social.label}
                          href={social.href}
                          target={social.href.startsWith('http') ? '_blank' : undefined}
                          rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="social-gold"
                          aria-label={social.label}
                        >
                          <Icon aria-hidden="true" className="h-5 w-5" />
                        </a>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            </motion.aside>
          </div>
          )}
        </AnimatePresence>,
        portalTarget
      )}
    </>
  );
}
