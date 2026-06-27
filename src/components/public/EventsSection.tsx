'use client';

import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

const eventTypes = [
  {
    name: 'Klantendagen',
    desc: 'Professionele merkbeleving voor relaties, klanten en partners.',
  },
  {
    name: 'Lanceringen',
    desc: 'Een product, dienst of merkverhaal krachtig en stijlvol introduceren.',
  },
  {
    name: 'Netwerkevents',
    desc: 'Een setting creeren waarin mensen zich welkom voelen en verbinding ontstaat.',
  },
  {
    name: 'Seminars',
    desc: 'Zakelijke inhoud versterken met sfeer, uitstraling en herkenbare branding.',
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const listItem: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      delay: 0.1 * i,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function EventsSection() {
  return (
    <section
      id="events"
      className={cn(
        'tone-warm section-shell',
      )}
    >
      <div
        className={cn(
          'section-inner grid items-center',
          'grid-cols-1 gap-10',
          'min-[1024px]:grid-cols-[minmax(0,1.08fr)_minmax(360px,.82fr)] min-[1024px]:gap-12',
        )}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          <h2
            className={cn(
              'mb-4 font-serif font-semibold leading-[1.08] text-text-dark',
              'text-[clamp(2rem,5vw,4.6rem)]',
              'min-[640px]:mb-5',
            )}
          >
            Voor merken die hun moment serieus nemen.
          </h2>
          <p className="mb-6 max-w-[820px] text-[1.02rem] leading-relaxed text-text-muted min-[640px]:text-[1.12rem]">
            Voor bedrijven die hun event niet als losse bijeenkomst zien, maar
            als verlengstuk van hun merk en relatie met gasten.
          </p>

          <div className="mt-6 grid gap-0">
            {eventTypes.map((event, i) => (
              <motion.div
                key={event.name}
                custom={i}
                variants={listItem}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className={cn(
                  'grid items-baseline gap-4 border-b border-border-soft/60 py-4',
                  'grid-cols-1',
                  'min-[640px]:grid-cols-[180px_1fr] min-[640px]:gap-[22px]',
                )}
              >
                <strong className="flex items-center gap-2.5 text-deep-gold">
                  <span
                    aria-hidden="true"
                    className="inline-block h-[1.5px] w-4 shrink-0 bg-gradient-to-r from-deep-gold to-soft-gold"
                  />
                  {event.name}
                </strong>
                <span className="text-[.95rem] leading-relaxed text-text-muted min-[640px]:text-base">
                  {event.desc}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'relative overflow-hidden',
            'rounded-[30px] min-[640px]:rounded-[36px]',
            'border border-champagne/80',
            'bg-white/80 backdrop-blur-lg',
            'p-8 min-[640px]:p-11',
            'shadow-[0_12px_48px_rgba(170,122,40,.1)]',
          )}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-50"
            style={{
              background:
                'radial-gradient(ellipse at 30% 20%, rgba(243,225,184,.25) 0%, transparent 60%)',
            }}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-[6px] rounded-[calc(30px-6px)] border border-champagne/30 min-[640px]:inset-2 min-[640px]:rounded-[calc(36px-8px)]"
          />

          <div
            aria-hidden="true"
            className="relative mb-7 h-[2px] w-14 rounded-full bg-gradient-to-r from-deep-gold via-soft-gold to-deep-gold/40 min-[640px]:mb-8 min-[640px]:w-16"
          />
          <p className="relative font-[family-name:var(--font-accent)] text-[clamp(1.5rem,3vw,3rem)] italic leading-[1.15] text-text-dark">
            &ldquo;Elk detail, elke kleur, elk moment en vooral elk gevoel moet
            kloppen.&rdquo;
          </p>
        </motion.aside>
      </div>
    </section>
  );
}
