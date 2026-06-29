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
    desc: 'Een setting creëren waarin mensen zich welkom voelen en verbinding ontstaat.',
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

const cardReveal: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.08 * i,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function EventsSection() {
  return (
    <section
      id="events"
      className="tone-warm section-shell"
    >
      <div className="section-inner">
        <motion.div
          className="mb-10 max-w-[900px] min-[640px]:mb-12"
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
          <p className="max-w-[820px] text-[1.02rem] leading-relaxed text-text-muted min-[640px]:text-[1.12rem]">
            Voor bedrijven die hun event niet als losse bijeenkomst zien, maar
            als verlengstuk van hun merk en relatie met gasten.
          </p>
        </motion.div>

        <div
          className={cn(
            'grid gap-4',
            'grid-cols-1',
            'min-[640px]:grid-cols-2',
            'min-[1024px]:grid-cols-4 min-[1024px]:gap-5',
          )}
        >
          {eventTypes.map((event, i) => (
            <motion.article
              key={event.name}
              custom={i}
              variants={cardReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              className={cn(
                'elevated-card group',
                'p-6 min-[640px]:p-7',
              )}
            >
              <div
                aria-hidden="true"
                className="mb-4 h-[2px] w-10 rounded-full bg-gradient-to-r from-dark-gold to-dark-soft-gold/40"
              />
              <h3 className="mb-2 text-[1.08rem] font-semibold text-text-dark min-[640px]:text-[1.15rem]">
                {event.name}
              </h3>
              <p className="text-[.94rem] leading-relaxed text-text-muted min-[640px]:text-[.98rem]">
                {event.desc}
              </p>
            </motion.article>
          ))}
        </div>

        <motion.aside
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'elevated-card mt-5',
            'p-8 min-[640px]:p-11',
            'max-w-[680px] mx-auto text-center',
          )}
        >
          <p className="relative font-[family-name:var(--font-accent)] text-[clamp(1.35rem,2.5vw,2.4rem)] italic leading-[1.2] text-text-dark">
            &ldquo;Elk detail, elke kleur, elk moment en vooral elk gevoel moet
            kloppen.&rdquo;
          </p>
        </motion.aside>
      </div>
    </section>
  );
}
