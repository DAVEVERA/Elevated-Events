'use client';

import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

export const faqs = [
  {
    question: 'Wat doet Elevated precies?',
    answer:
      'Wij vertalen merkidentiteit naar een complete zakelijke live eventbeleving: concept, styling, routing, sfeer en afstemming met uitvoerende partners.',
  },
  {
    question: 'Voor welke zakelijke events is dit geschikt?',
    answer:
      'Voor klantendagen, lanceringen, merkactivaties, seminars, netwerkevents en relatie-events waarbij uitstraling en gastbeleving moeten kloppen.',
  },
  {
    question: 'Kan Gabriela ook de eventdag zelf ondersteunen?',
    answer:
      'Ja. Afhankelijk van de vraag kan Gabriela ondersteunen met detailcoordinatie op de dag zelf, zodat het concept rustig en professioneel wordt uitgevoerd.',
  },
  {
    question: 'Hoe start een samenwerking?',
    answer:
      'Meestal met een digitale kennismaking via de planner. Daarna worden doel, merkgevoel en gewenste impact concreet gemaakt.',
  },
  {
    question: 'Werken jullie door heel Nederland?',
    answer:
      'Ja. We werken voor zakelijke opdrachtgevers in heel Nederland en stemmen de uitvoering af met een zorgvuldig netwerk van partners.',
  },
] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function FAQSection() {
  return (
    <section id="faq" className="tone-dark section-shell">
      <div className="section-inner">
        <motion.div
          className="mb-10 max-w-[900px]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          <h2 className="mb-4 font-serif text-[clamp(2rem,5vw,4.6rem)] font-semibold leading-[1.08] text-text-dark">
            Vragen die vaak als eerste op tafel komen.
          </h2>
          <p className="max-w-[820px] text-[1.02rem] leading-relaxed text-text-muted min-[640px]:text-[1.12rem]">
            Een zakelijke eventbeleving begint met scherpte. Deze antwoorden
            helpen om snel te bepalen of Elevated past bij jouw merk en moment.
          </p>
        </motion.div>

        <div className="grid gap-4 min-[900px]:grid-cols-2">
          {faqs.map((faq, index) => (
            <motion.article
              key={faq.question}
              custom={index}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'elevated-card p-6',
                'min-[640px]:p-7',
              )}
            >
              <h3 className="mb-3 text-[1.05rem] font-semibold text-text-dark min-[640px]:text-[1.16rem]">
                {faq.question}
              </h3>
              <p className="text-[.96rem] leading-relaxed text-text-muted">
                {faq.answer}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
