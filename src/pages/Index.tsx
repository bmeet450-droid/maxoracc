import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import CustomCursor from "@/components/CustomCursor";
import VideoHero from "@/components/VideoHero";
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
      <CustomCursor />
      <VideoHero />
      <PortfolioSection />
      <AboutSection />
      <AboutUsSection />
      <ServicesSection />
      <ContactCTASection />
      <Footer />
    </div>
  );
};

export default Index;
