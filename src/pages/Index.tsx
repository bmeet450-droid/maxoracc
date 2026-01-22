import CustomCursor from "@/components/CustomCursor";
import MaxoraHero from "@/components/MaxoraHero";

const Index = () => {
  return (
    <div className="min-h-[200vh]" style={{ background: '#0a0a0a' }}>
      <CustomCursor />
      <MaxoraHero />
      
      {/* Placeholder content for scroll testing */}
      <section className="min-h-screen flex items-center justify-center">
        <p className="text-white/30 text-xl">Scroll content area</p>
      </section>
    </div>
  );
};

export default Index;
