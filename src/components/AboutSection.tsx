import FilmGrain from "./FilmGrain";

const AboutSection = () => {
  return (
    <section 
      id="about" 
      className="relative min-h-screen overflow-hidden"
      style={{ background: '#000000' }}
    >
      {/* Subtle radial gradient for depth */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.02) 0%, transparent 60%)',
        }}
      />
      
      {/* Very subtle film grain texture */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }}>
        <FilmGrain />
      </div>
      
      {/* Vignette overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
        }}
      />
    </section>
  );
};

export default AboutSection;
