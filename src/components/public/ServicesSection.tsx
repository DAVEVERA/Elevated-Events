'use client';

import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

const services = [
  {
    tag: 'Service',
    title: 'Eventbranding',
    text: 'Vertaling van jouw merkidentiteit naar een complete live eventbeleving.',
  },
  {
    tag: 'Concept',
    title: 'Sfeer & styling',
    text: 'Kleur, materiaal, licht, signing, aankleding en uitstraling bewust afgestemd op jouw doel.',
  },
  {
    tag: 'Regie',
    title: 'Detailcoordinatie',
    text: 'Van binnenkomst tot laatste detail: elk onderdeel krijgt aandacht en samenhang.',
  },
  {
    tag: 'Live',
    title: 'Eventdag ondersteuning',
    text: 'Op aanvraag live coordinatie op de dag zelf, zodat de uitvoering rustig en professioneel verloopt.',
  },
];

const cardReveal: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      delay: 0.12 * i,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const headerReveal: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function ServicesSection() {
  return (
    <section
      id="diensten"
      className={cn(
        'tone-light section-shell',
      )}
    >
      <div className="section-inner">
        <motion.div
          className="mb-10 max-w-[880px] min-[640px]:mb-12"
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
            Meer dan een mooi aangeklede ruimte.
          </h2>
          <p className="max-w-[760px] text-[1.02rem] leading-relaxed text-text-muted min-[640px]:text-[1.12rem]">
            Een goed zakelijk event voelt logisch, herkenbaar en professioneel.
            Het vertelt het verhaal van je merk zonder dat alles letterlijk
            uitgesproken hoeft te worden.
          </p>
        </motion.div>

        <div
          className={cn(
            'grid gap-4',
            'grid-cols-1',
            'min-[640px]:grid-cols-2 min-[640px]:gap-5',
            'min-[1024px]:grid-cols-4 min-[1024px]:gap-5',
          )}
        >
          {services.map((service, i) => (
            <motion.article
              key={service.title}
              custom={i}
              variants={cardReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className={cn(
                'elevated-card group',
                'p-7 min-[640px]:p-[30px]',
                'min-[640px]:min-h-[220px]',
              )}
            >
              <div
                aria-hidden="true"
                className={cn(
                  'absolute left-7 right-7 top-0 h-[2px]',
                  'bg-gradient-to-r from-transparent via-deep-gold/60 to-transparent',
                  'transition-opacity duration-500',
                  'opacity-60 group-hover:opacity-100',
                )}
              />

              <div className="mb-5 text-[.78rem] font-extrabold uppercase tracking-[.28em] text-deep-gold min-[640px]:text-[.82rem]">
                {service.tag}
              </div>
              <h3 className="mb-3 text-[1.15rem] font-semibold text-text-dark min-[640px]:text-[1.25rem]">
                {service.title}
              </h3>
              <p className="text-[.94rem] leading-relaxed text-text-muted min-[640px]:text-[.98rem]">
                {service.text}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
