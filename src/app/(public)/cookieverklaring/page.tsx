import type { Metadata } from 'next';
import LegalPage from '@/components/public/LegalPage';

export const metadata: Metadata = {
  title: 'Cookieverklaring',
  description:
    'Cookieverklaring van Elevated Eventmaker over noodzakelijke, analytische en marketingcookies.',
  alternates: { canonical: '/cookieverklaring' },
};

export default function CookiePage() {
  return (
    <LegalPage
      title="Cookieverklaring"
      intro="Deze website gebruikt cookies en vergelijkbare technieken om de site goed te laten werken en, na toestemming, inzichten te krijgen in gebruik."
      sections={[
        {
          title: 'Noodzakelijke cookies',
          body: [
            'Noodzakelijke cookies zijn nodig voor basisfuncties zoals navigatie, beveiliging en het onthouden van cookievoorkeuren.',
            'Deze cookies worden altijd geplaatst omdat de website anders niet goed functioneert.',
          ],
        },
        {
          title: 'Analytische cookies',
          body: [
            'Analytische cookies kunnen worden gebruikt om te begrijpen welke pagina’s worden bezocht en waar bezoekers afhaken.',
            'Waar mogelijk worden gegevens privacyvriendelijk en geaggregeerd verwerkt.',
          ],
        },
        {
          title: 'Marketing en social media',
          body: [
            'Marketingcookies of socialmedia-pixels worden alleen gebruikt wanneer ze daadwerkelijk zijn gekoppeld en toestemming is gegeven.',
            'Socialmedia-links op deze site openen externe platforms met hun eigen voorwaarden en privacybeleid.',
          ],
        },
        {
          title: 'Voorkeur wijzigen',
          body: [
            'Je kunt cookies verwijderen via je browserinstellingen. Wanneer een cookiebanner actief is, kun je daar je voorkeur vastleggen.',
          ],
        },
      ]}
    />
  );
}
