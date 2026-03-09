import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import VideoHero from "@/components/VideoHero";
import MagneticTextSection from "@/components/MagneticTextSection";
import ZoomParallaxSection from "@/components/ZoomParallaxSection";
import PortfolioSection from "@/components/PortfolioSection";
import AboutSection from "@/components/AboutSection";
import AboutUsSection from "@/components/AboutUsSection";
import ServicesSection from "@/components/ServicesSection";
import ContactCTASection from "@/components/ContactCTASection";
import Footer from "@/components/Footer";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    // Handle scroll restoration from contact page
    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const element = document.getElementById(state.scrollTo!);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      // Clear state to prevent re-scrolling on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen" style={{ background: '#000000' }}>
      <VideoHero />
      <MagneticTextSection />
      <ZoomParallaxSection />
      <PortfolioSection />
      <section className="relative py-20 md:py-32" style={{ background: '#000000' }}>
        <div className="flex flex-col items-center">
          <MagneticText
            text="I specialize in Cinematography"
            hoverText="I know a thing or two about it"
            className="h-32 md:h-48 w-full"
            circleSize={typeof window !== 'undefined' && window.innerWidth < 768 ? 180 : typeof window !== 'undefined' && window.innerWidth < 1024 ? 240 : 320}
          />
        </div>
      </section>
      <AboutSection />
      <AboutUsSection />
      <ServicesSection />
      <ContactCTASection />
      <Footer />
    </div>
  );
};

export default Index;
