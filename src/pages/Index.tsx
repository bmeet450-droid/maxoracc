import CustomCursor from "@/components/CustomCursor";
import MaxoraHero from "@/components/MaxoraHero";
import PortfolioSection from "@/components/PortfolioSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      <CustomCursor />
      <MaxoraHero />
      <PortfolioSection />
      <AboutSection />
      <ServicesSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
