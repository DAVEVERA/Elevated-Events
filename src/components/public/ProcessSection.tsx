'use client';

import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

const steps = [
  {
    title: 'Merk & doel scherpstellen',
    text: 'We brengen boodschap, doelgroep, sfeer en gewenste impact in kaart.',
  },
  {
    title: 'Concept ontwikkelen',
    text: 'Daarna ontstaat een visuele richting met kleuren, materialen, styling en belevingsmomenten.',
  },
  {
    title: 'Partners & uitvoering afstemmen',
    text: 'Met een zorgvuldig netwerk van vaste partners wordt de uitvoering concreet gemaakt.',
  },
  {
    title: 'Eventdag laten kloppen',
    text: 'Op aanvraag is er live coordinatie, zodat het event professioneel en rustig verloopt.',
  },
];

const stepReveal: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.14 * i,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const headerReveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function ProcessSection() {
  return (
    <section
      id="aanpak"
      className={cn(
        'tone-dim section-shell',
      )}
    >
      <div className="section-inner">
        <motion.div
          className="mb-10 max-w-[900px] min-[640px]:mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={headerReveal}
        >
          <h2
            className={cn(
              'mb-4 font-serif font-semibold leading-[1.08] text-text-dark',
              'text-[clamp(2rem,5vw,4.6rem)]',
              'min-[640px]:mb-5',
            )}
          >
            Van merkgevoel naar eventbeleving.
          </h2>
          <p className="max-w-[760px] text-[1.02rem] leading-relaxed text-text-muted min-[640px]:text-[1.12rem]">
            De kracht zit in voorbereiding. Niet zomaar decoreren, maar eerst
            begrijpen wat jouw merk wil uitstralen en wat gasten moeten voelen,
            onthouden en meenemen.
          </p>
        </motion.div>

        <div className="relative">
          <div className="grid gap-4 min-[640px]:gap-3 min-[1024px]:grid-cols-2">
            {steps.map((step, i) => (
              <motion.article
                key={step.title}
                custom={i}
                variants={stepReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                className={cn(
                  'relative grid items-start gap-5',
                  'rounded-[22px] min-[640px]:rounded-[26px]',
                  'border border-border-soft/60',
                  'bg-white/65 backdrop-blur-md',
                  'p-6 min-[640px]:p-7',
                  'shadow-[0_4px_24px_rgba(170,122,40,.06)]',
                  'grid-cols-1',
                  'min-[640px]:grid-cols-[80px_1fr] min-[640px]:gap-7',
                  'min-[1024px]:grid-cols-[90px_1fr]',
                )}
              >
                <div className="flex items-start min-[640px]:justify-center min-[640px]:pt-1">
                  <div
                    className={cn(
                      'relative z-[1] flex items-center justify-center',
                      'h-12 w-12 min-[640px]:h-14 min-[640px]:w-14',
                      'rounded-full',
                      'bg-gradient-to-br from-deep-gold to-soft-gold',
                      'shadow-[0_4px_16px_rgba(170,122,40,.25)]',
                    )}
                  >
                    <span className="font-serif text-lg font-bold text-white min-[640px]:text-xl">
                      {i + 1}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="mb-1.5 text-[1.08rem] font-semibold text-text-dark min-[640px]:text-lg">
                    {step.title}
                  </h3>
                  <p className="text-[.94rem] leading-relaxed text-text-muted min-[640px]:text-base">
                    {step.text}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
