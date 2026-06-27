import type { Metadata } from 'next';
import LegalPage from '@/components/public/LegalPage';

export const metadata: Metadata = {
  title: 'Algemene voorwaarden',
  description:
    'Algemene voorwaarden voor aanvragen en dienstverlening van Elevated Eventmaker.',
  alternates: { canonical: '/algemene-voorwaarden' },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Algemene voorwaarden"
      intro="Deze basisvoorwaarden beschrijven hoe Elevated Eventmaker werkt bij aanvragen, voorstellen en uitvoering van eventbranding."
      sections={[
        {
          title: 'Toepasselijkheid',
          body: [
            'Deze voorwaarden zijn van toepassing op aanvragen, offertes, overeenkomsten en werkzaamheden van Elevated Eventmaker, tenzij schriftelijk anders afgesproken.',
          ],
        },
        {
          title: 'Voorstellen en uitvoering',
          body: [
            'Voorstellen zijn gebaseerd op de informatie die de opdrachtgever verstrekt. Wijzigingen in scope, planning, locatie of aantal gasten kunnen invloed hebben op aanpak en kosten.',
            'Elevated Eventmaker spant zich in om werkzaamheden zorgvuldig, professioneel en binnen afgesproken kaders uit te voeren.',
          ],
        },
        {
          title: 'Partners en leveranciers',
          body: [
            'Voor uitvoering kan worden samengewerkt met externe partners. Afhankelijk van afspraken kan de opdrachtgever rechtstreeks contracteren met deze partners of via Elevated Eventmaker.',
          ],
        },
        {
          title: 'Aansprakelijkheid',
          body: [
            'Aansprakelijkheid is beperkt tot directe schade en maximaal het bedrag dat voor de betreffende opdracht is betaald, tenzij dwingend recht anders bepaalt.',
            'Indirecte schade, gevolgschade of schade door onvolledige informatie van de opdrachtgever is uitgesloten voor zover wettelijk toegestaan.',
          ],
        },
      ]}
    />
  );
}
