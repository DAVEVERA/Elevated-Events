import type { Metadata } from 'next';
import LegalPage from '@/components/public/LegalPage';

export const metadata: Metadata = {
  title: 'Verwerkersovereenkomst',
  description:
    'Basisinformatie over verwerking van persoonsgegevens door Elevated Eventmaker in opdrachtcontext.',
  alternates: { canonical: '/verwerkersovereenkomst' },
};

export default function ProcessorAgreementPage() {
  return (
    <LegalPage
      title="Verwerkersovereenkomst"
      intro="Wanneer Elevated Eventmaker persoonsgegevens namens een opdrachtgever verwerkt, kunnen aanvullende verwerkersafspraken nodig zijn."
      sections={[
        {
          title: 'Rol en scope',
          body: [
            'Afhankelijk van de opdracht kan Elevated Eventmaker zelfstandig verwerkingsverantwoordelijke zijn of persoonsgegevens verwerken namens een opdrachtgever.',
            'De concrete rol, categorieen persoonsgegevens en doeleinden worden per opdracht afgestemd.',
          ],
        },
        {
          title: 'Beveiliging',
          body: [
            'Persoonsgegevens worden alleen toegankelijk gemaakt voor personen of leveranciers die ze nodig hebben voor de uitvoering van de opdracht.',
            'Technische en organisatorische maatregelen worden afgestemd op de aard van de gegevens en de opdracht.',
          ],
        },
        {
          title: 'Subverwerkers',
          body: [
            'Wanneer technische systemen of uitvoerende partners persoonsgegevens verwerken, kunnen zij als subverwerker optreden.',
            'Relevante partijen worden op verzoek inzichtelijk gemaakt binnen de context van de opdracht.',
          ],
        },
        {
          title: 'Datalekken en verzoeken',
          body: [
            'Bij een vermoedelijk datalek of privacyverzoek wordt zo snel mogelijk afgestemd met de betrokken opdrachtgever of betrokkene.',
          ],
        },
      ]}
    />
  );
}
