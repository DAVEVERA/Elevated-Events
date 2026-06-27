import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope, Marcellus } from 'next/font/google';
import './globals.css';

const marcellus = Marcellus({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-serif',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-accent',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Elevated Eventmaker | Eventbranding voor zakelijke events',
    template: '%s | Elevated Eventmaker',
  },
  description:
    'Elevated Eventmaker creeert eventbranding op maat voor zakelijke live events, merkactivaties, klantendagen, lanceringen en business events.',
  keywords: [
    'eventbranding',
    'zakelijke events',
    'business events',
    'eventstyling',
    'merkbeleving',
    'live events',
    'eventmaker',
    'Elevated Eventmaker',
    'Gabriela Mihalcea',
    'eventbranding zakelijke events',
    'eventstyling bedrijfsevents',
    'merkbeleving events',
    'eventmaker Nederland',
  ],
  authors: [{ name: 'Elevated Eventmaker' }],
  creator: 'Gabriela Mihalcea',
  publisher: 'Elevated Eventmaker',
  applicationName: 'Elevated Eventmaker',
  category: 'eventbranding',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://elevated-eventmaker.nl'
  ),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Elevated Eventmaker | Eventbranding voor zakelijke events',
    description:
      'Zakelijke live events die mensen raken, voelen en blijven hangen.',
    url: 'https://elevated-eventmaker.nl',
    siteName: 'Elevated Eventmaker',
    type: 'website',
    locale: 'nl_NL',
    images: [
      {
        url: '/logo-elevated-gold.svg',
        width: 1200,
        height: 630,
        alt: 'Elevated Eventmaker',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Elevated Eventmaker | Eventbranding voor zakelijke events',
    description:
      'Eventbranding op maat voor zakelijke live events, merkactivaties en business events.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  other: {
    'ai-summary':
      'Elevated Eventmaker is het eventbranding bureau van Gabriela Mihalcea voor zakelijke live events in Nederland.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`${marcellus.variable} ${cormorant.variable} ${manrope.variable}`}>
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
