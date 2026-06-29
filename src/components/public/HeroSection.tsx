'use client';

import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

const scaleFade: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: (delay: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

const SPARKLES = [
  { left: '12%', top: '18%', size: 3, delay: 0 },
  { left: '28%', top: '8%', size: 2, delay: 1.2 },
  { left: '72%', top: '14%', size: 2.5, delay: 0.6 },
  { left: '85%', top: '22%', size: 2, delay: 2.1 },
  { left: '42%', top: '5%', size: 3, delay: 1.8 },
  { left: '58%', top: '28%', size: 2, delay: 0.3 },
  { left: '8%', top: '42%', size: 2.5, delay: 2.6 },
  { left: '92%', top: '38%', size: 2, delay: 1.5 },
  { left: '35%', top: '52%', size: 3, delay: 0.9 },
  { left: '68%', top: '48%', size: 2, delay: 3.0 },
  { left: '18%', top: '62%', size: 2.5, delay: 2.2 },
  { left: '78%', top: '58%', size: 2, delay: 0.4 },
] as const;

function GoldSparkles() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
      {SPARKLES.map((sparkle, index) => (
        <span
          key={index}
          className="hero-sparkle absolute rounded-full"
          style={{
            left: sparkle.left,
            top: sparkle.top,
            width: sparkle.size,
            height: sparkle.size,
            animationDelay: `${sparkle.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function HeroSection() {
  return (
    <section
      aria-labelledby="hero-title"
      className={cn(
        'tone-light relative flex min-h-screen flex-col items-center justify-center overflow-hidden',
        'px-5 pb-20 pt-28 min-[640px]:px-8 min-[640px]:pb-24 min-[640px]:pt-32',
      )}
    >
      <div
        aria-hidden="true"
        className="hero-glow pointer-events-none absolute left-1/2 top-[30%] z-[1]"
      />
      <div
        aria-hidden="true"
        className="hero-light-ray pointer-events-none absolute -top-[10%] left-[5%] h-[130%] w-[40%] -rotate-[22deg] opacity-20 blur-[18px]"
      />
      <div
        aria-hidden="true"
        className="hero-light-ray pointer-events-none absolute -top-[10%] right-[5%] h-[130%] w-[40%] rotate-[22deg] opacity-20 blur-[18px]"
      />
      <GoldSparkles />

      <motion.div
        className="relative z-[2] mx-auto flex w-full max-w-[1180px] flex-col items-center text-center"
        initial="hidden"
        animate="visible"
      >
        <motion.div
          custom={0.06}
          variants={scaleFade}
          className={cn(
            'mb-0 flex h-12 w-full items-start justify-center overflow-hidden',
            'min-[621px]:h-[76px]',
            'min-[981px]:h-[136px]',
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-elevated-gold.svg"
            alt="Elevated Eventmaker logo"
            className={cn(
              'h-[276px] w-auto -translate-y-[97px]',
              'min-[621px]:h-[440px] min-[621px]:-translate-y-[156px]',
              'min-[981px]:h-[820px] min-[981px]:-translate-y-[294px]',
            )}
          />
        </motion.div>

        <motion.p
          custom={0.16}
          variants={fadeUp}
          className={cn(
            'mb-2 font-[family-name:var(--font-accent)] text-[clamp(1rem,2vw,1.34rem)] italic text-text-muted',
            'tracking-[.1em] max-[620px]:tracking-[.04em]',
          )}
        >
          Events by Gabriela Mihalcea
        </motion.p>

        <motion.h1
          id="hero-title"
          custom={0.24}
          variants={fadeUp}
          className="mb-3 max-w-[920px] font-serif text-[clamp(1.15rem,2.6vw,2rem)] leading-[1.08] text-text-dark"
        >
          Elevated vertaalt jouw merk naar zakelijke live events die vanaf de eerste indruk kloppen: stijlvol, strategisch, volledig ontzorgd en ontworpen om karakter, impact en herkenning te versterken.
        </motion.h1>

        <motion.div
          custom={0.44}
          variants={fadeUp}
          className="flex w-full max-w-[520px] flex-wrap justify-center gap-3 max-[620px]:flex-col"
        >
          <Link href="/planner" className="btn-elevated max-[620px]:w-full">
            <span>Plan een kennismaking</span>
          </Link>
          <a href="#aanpak" className="btn-elevated max-[620px]:w-full">
            <span>Bekijk de aanpak</span>
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        custom={0.62}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="absolute bottom-6 left-1/2 z-[2] -translate-x-1/2"
      >
        <a
          href="#aanpak"
          aria-label="Scroll naar beneden"
          className="flex flex-col items-center gap-1 text-text-muted transition-colors duration-300 hover:text-text-dark"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="hero-scroll-chevron opacity-70"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="hero-scroll-chevron -mt-3 opacity-35"
            style={{ animationDelay: '0.15s' }}
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </a>
      </motion.div>
    </section>
  );
}
