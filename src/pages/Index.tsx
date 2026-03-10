import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import VideoHero from "@/components/VideoHero";
import MagneticTextSection from "@/components/MagneticTextSection";
import CinematographyTextSection from "@/components/CinematographyTextSection";
import PortfolioSection from "@/components/PortfolioSection";
import AboutSection from "@/components/AboutSection";
import AboutUsSection from "@/components/AboutUsSection";
import ServicesSection from "@/components/ServicesSection";
import ContactCTASection from "@/components/ContactCTASection";
import Footer from "@/components/Footer";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo) {
      setTimeout(() => {
        const element = document.getElementById(state.scrollTo!);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen" style={{ background: '#000000' }}>
      <VideoHero />
      <MagneticTextSection />
      <PortfolioSection />
      <CinematographyTextSection />
      <AboutSection />
      <AboutUsSection />
      <ServicesSection />
      <ContactCTASection />
      <Footer />
    </div>
  );
};

export default Index;
