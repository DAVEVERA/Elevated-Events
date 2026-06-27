import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import { LocalBusinessJsonLd, ServiceJsonLd } from '@/components/public/JsonLd';
import ParticleBackground from '@/components/public/ParticleBackground';
import CookieBanner from '@/components/public/CookieBanner';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-x-hidden text-text-dark">
      <LocalBusinessJsonLd />
      <ServiceJsonLd />
      <ParticleBackground />
      <Header />
      <main className="relative z-10">{children}</main>
      <div className="particle-site-content relative z-10">
        <Footer />
      </div>
      <CookieBanner />
    </div>
  );
}
