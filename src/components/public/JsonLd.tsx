const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://elevated-eventmaker.nl';

const faqItems = [
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

function JsonLdScript({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function LocalBusinessJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'LocalBusiness', 'ProfessionalService'],
        '@id': `${siteUrl}/#organization`,
        name: 'Elevated Eventmaker',
        url: siteUrl,
        description:
          'Eventbranding op maat voor zakelijke live events, merkactivaties, klantendagen, lanceringen en business events.',
        slogan: 'Eventbranding for Business Events',
        areaServed: {
          '@type': 'Country',
          name: 'Nederland',
        },
        founder: {
          '@id': `${siteUrl}/#gabriela-mihalcea`,
        },
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          email: 'info@elevated-eventmaker.nl',
          telephone: '+31 6 12 34 56 78',
          availableLanguage: ['nl', 'en'],
        },
        sameAs: [
          'https://instagram.com/elevated.eventmaker',
          'https://tiktok.com/@elevated.eventmaker',
          'https://linkedin.com/company/elevated-eventmaker',
        ],
      },
      {
        '@type': 'Person',
        '@id': `${siteUrl}/#gabriela-mihalcea`,
        name: 'Gabriela Mihalcea',
        jobTitle: 'Founder en eventmaker',
        worksFor: {
          '@id': `${siteUrl}/#organization`,
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'Elevated Eventmaker',
        inLanguage: 'nl-NL',
        publisher: {
          '@id': `${siteUrl}/#organization`,
        },
      },
    ],
  };

  return <JsonLdScript data={jsonLd} />;
}

export function ServiceJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${siteUrl}/#eventbranding-service`,
    name: 'Elevated vertaalt jouw merk naar zakelijke live events',
    provider: {
      '@id': `${siteUrl}/#organization`,
    },
    description:
      'Vertaling van merkidentiteit naar een complete live eventbeleving met concept, styling, routing, sfeer en detailcoordinatie.',
    areaServed: {
      '@type': 'Country',
      name: 'Nederland',
    },
    serviceType: [
      'Eventbranding',
      'Eventstyling',
      'Merkbeleving',
      'Zakelijke eventcoordinatie',
    ],
  };

  return <JsonLdScript data={jsonLd} />;
}

export function FAQJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return <JsonLdScript data={jsonLd} />;
}
