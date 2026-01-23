import CustomCursor from "@/components/CustomCursor";
import MaxoraHero from "@/components/MaxoraHero";
import PortfolioSection from "@/components/PortfolioSection";
import VideoShowcaseSection from "@/components/VideoShowcaseSection";
import AboutSection from "@/components/AboutSection";
import AboutUsSection from "@/components/AboutUsSection";
import ServicesSection from "@/components/ServicesSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen" style={{ background: '#000000' }}>
      <CustomCursor />
      <MaxoraHero />
      <PortfolioSection />
      <VideoShowcaseSection />
      <AboutSection />
      <AboutUsSection />
      <ServicesSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
