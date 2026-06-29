'use client';

import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function CTASection() {
  return (
    <section
      id="contact"
      className={cn(
        'tone-dark section-shell text-center',
      )}
    >
      <div className="section-inner">
      <motion.div
        className="mx-auto max-w-[850px]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={fadeUp}
      >
        <div
          aria-hidden="true"
          className="mx-auto mb-8 flex items-center justify-center gap-3 min-[640px]:mb-10"
        >
          <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-deep-gold/50 min-[640px]:w-12" />
          <span className="inline-block h-1.5 w-1.5 rotate-45 bg-deep-gold/70" />
          <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-deep-gold/50 min-[640px]:w-12" />
        </div>

        <h2
          className={cn(
            'mb-4 font-serif font-semibold leading-[1.08] text-text-dark',
            'text-[clamp(2rem,5vw,4.6rem)]',
            'min-[640px]:mb-5',
          )}
        >
          Laat jouw event elevated voelen.
        </h2>
        <p className="mb-8 text-[1.02rem] leading-relaxed text-text-muted min-[640px]:mb-[34px] min-[640px]:text-[1.12rem]">
          Wil je een zakelijk live event dat klopt van binnenkomst tot laatste
          detail? We denken graag mee over concept, merkbeleving en uitvoering.
        </p>

        <Link href="/planner" className="btn-elevated">
          <span>Plan een kennismaking</span>
        </Link>

        <div className="mt-10 flex flex-col items-center gap-3 min-[640px]:mt-12 min-[640px]:flex-row min-[640px]:justify-center min-[640px]:gap-6">
          <a
            href="mailto:info@elevated-eventmaker.nl"
            className="min-h-[44px] text-[.92rem] text-text-muted transition-colors duration-300 hover:text-deep-gold min-[640px]:text-[.95rem]"
          >
            info@elevated-eventmaker.nl
          </a>
          <span
            aria-hidden="true"
            className="hidden h-4 w-[1px] bg-border-soft min-[640px]:block"
          />
          <a
            href="tel:+31612345678"
            className="min-h-[44px] text-[.92rem] text-text-muted transition-colors duration-300 hover:text-deep-gold min-[640px]:text-[.95rem]"
          >
            +31 6 12 34 56 78
          </a>
        </div>
      </motion.div>
      </div>
    </section>
  );
}
