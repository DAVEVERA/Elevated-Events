import Link from 'next/link';

type LegalSection = {
  title: string;
  body: string[];
};

type LegalPageProps = {
  title: string;
  intro: string;
  sections: LegalSection[];
};

export default function LegalPage({ title, intro, sections }: LegalPageProps) {
  return (
    <section className="tone-light section-shell min-h-screen pt-32">
      <div className="section-inner max-w-[980px]">
        <Link
          href="/"
          className="mb-8 inline-flex text-sm font-semibold text-deep-gold underline decoration-deep-gold/30 underline-offset-4"
        >
          Terug naar Elevated
        </Link>
        <h1 className="mb-5 font-serif text-[clamp(2.2rem,5vw,4.9rem)] leading-[1.06] text-text-dark">
          {title}
        </h1>
        <p className="mb-10 max-w-[760px] text-[1.04rem] leading-relaxed text-text-muted">
          {intro}
        </p>

        <div className="grid gap-5">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-[24px] border border-border-soft bg-white/70 p-6 backdrop-blur-md min-[640px]:p-8"
            >
              <h2 className="mb-3 text-xl font-semibold text-text-dark">
                {section.title}
              </h2>
              <div className="space-y-3 text-[.98rem] leading-relaxed text-text-muted">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
