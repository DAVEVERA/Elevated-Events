import HeroSection from '@/components/public/HeroSection';
import ServicesSection from '@/components/public/ServicesSection';
import EventsSection from '@/components/public/EventsSection';
import ProcessSection from '@/components/public/ProcessSection';
import StorySection from '@/components/public/StorySection';
import FAQSection from '@/components/public/FAQSection';
import CTASection from '@/components/public/CTASection';
import { FAQJsonLd } from '@/components/public/JsonLd';

export default function HomePage() {
  return (
    <>
      <FAQJsonLd />
      <HeroSection />
      <div className="particle-site-content relative z-[1]">
        <ServicesSection />
        <EventsSection />
        <ProcessSection />
        <StorySection />
        <FAQSection />
        <CTASection />
      </div>
    </>
  );
}
