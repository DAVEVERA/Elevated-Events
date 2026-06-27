import type { Metadata } from 'next';
import LegalPage from '@/components/public/LegalPage';

export const metadata: Metadata = {
  title: 'Privacyverklaring',
  description:
    'Privacyverklaring van Elevated Eventmaker over persoonsgegevens, contactaanvragen en planningsgegevens.',
  alternates: { canonical: '/privacyverklaring' },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacyverklaring"
      intro="Elevated Eventmaker gaat zorgvuldig om met persoonsgegevens die worden gedeeld via contact, planning en zakelijke aanvragen."
      sections={[
        {
          title: 'Welke gegevens worden verwerkt',
          body: [
            'Bij een aanvraag kunnen naam, bedrijfsnaam, e-mailadres, telefoonnummer, eventinformatie, website, LinkedIn-profiel en voorkeursmomenten worden verwerkt.',
            'Deze gegevens zijn nodig om een kennismaking voor te bereiden, contact op te nemen en een passende eventbranding-aanpak te bespreken.',
          ],
        },
        {
          title: 'Doeleinden en grondslag',
          body: [
            'Gegevens worden gebruikt voor contact, planning, voorbereiding van gesprekken, offertes, uitvoering van dienstverlening en noodzakelijke administratie.',
            'De verwerking vindt plaats op basis van aanvraag, gerechtvaardigd belang, overeenkomst of wettelijke verplichting.',
          ],
        },
        {
          title: 'Bewaartermijn en delen met derden',
          body: [
            'Gegevens worden niet langer bewaard dan nodig voor het doel waarvoor ze zijn verzameld, tenzij een wettelijke bewaartermijn geldt.',
            'Alleen wanneer nodig kunnen gegevens worden gedeeld met technische dienstverleners of uitvoerende partners die betrokken zijn bij de aanvraag of dienstverlening.',
          ],
        },
        {
          title: 'Rechten',
          body: [
            'Je kunt verzoeken om inzage, correctie, verwijdering, beperking of overdracht van persoonsgegevens.',
            'Stuur hiervoor een bericht naar info@elevated-eventmaker.nl.',
          ],
        },
      ]}
    />
  );
}
