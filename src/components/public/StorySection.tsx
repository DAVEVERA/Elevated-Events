'use client';

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

export default function StorySection() {
  return (
    <section
      id="verhaal"
      className={cn('tone-dark section-shell')}
    >
      <div
        className={cn(
          'section-inner grid',
          'grid-cols-1 gap-10',
          'min-[640px]:gap-12',
          'min-[1024px]:grid-cols-[minmax(0,1.03fr)_minmax(380px,.86fr)] min-[1024px]:items-start min-[1024px]:gap-12',
        )}
      >
        <motion.div
          className="max-w-[880px]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          <h2
            className={cn(
              'mb-5 font-serif font-semibold leading-[1.08] text-text-dark',
              'text-[clamp(2rem,5vw,4.6rem)]',
              'min-[640px]:mb-6',
            )}
          >
            Ondernemen vanuit gevoel, aandacht en eigen regie.
          </h2>

          <div
            aria-hidden="true"
            className="mb-7 h-[2px] w-12 rounded-full bg-gradient-to-r from-deep-gold to-soft-gold/40 min-[640px]:mb-8 min-[640px]:w-16"
          />

          <div className="space-y-5 text-[1rem] leading-[1.75] text-text-muted min-[640px]:text-[1.08rem] min-[640px]:leading-relaxed">
            <p>
              Elevated is ontstaan vanuit een persoonlijke wake-upcall. Na een
              periode waarin gezondheid en herstel centraal stonden, werd
              &eacute;&eacute;n ding duidelijk: het mag ook gaan over kiezen
              wat klopt.
            </p>
            <p>
              Die manier van kijken vormt nu de basis. Niet harder of groter
              om het groter. Maar bewuster. Met aandacht voor sfeer, verbinding
              en betekenis.
            </p>
            <p>
              Precies die aandacht neem ik mee in ieder event. Want een event
              is pas sterk wanneer mensen niet alleen zien wat je merk doet,
              maar ook voelen waar het voor staat.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-4 min-[640px]:gap-5 min-[1024px]:pt-2"
        >
          <aside
            className={cn(
              'elevated-card',
              'p-6 min-[640px]:p-8',
            )}
          >
            <div
              aria-hidden="true"
              className="relative mb-5 h-[2px] w-14 rounded-full bg-gradient-to-r from-deep-gold via-soft-gold to-deep-gold/20"
            />
            <p className="relative mb-4 font-[family-name:var(--font-accent)] text-[1.12rem] italic leading-[1.55] text-text-dark min-[640px]:text-[1.22rem]">
              Elevated staat voor optillen, verfijnen en bewust versterken. Niet
              overdreven. Niet standaard. Maar precies passend bij jouw merk.
            </p>
            <p className="relative max-w-[34rem] text-[.95rem] leading-[1.75] text-text-muted min-[640px]:text-base">
              Van eerste indruk tot laatste moment: elk detail draagt bij aan het
              geheel.
            </p>
          </aside>
        </motion.div>
      </div>
    </section>
  );
}
