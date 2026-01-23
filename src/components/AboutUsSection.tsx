import useScrollAnimation from "@/hooks/useScrollAnimation";

const AboutUsSection = () => {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      id="about-us"
      ref={sectionRef}
      className="relative py-32 md:py-48 lg:py-64 px-6 md:px-12"
      style={{ background: '#0a0a0a' }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Label */}
        <p
          className="text-[10px] md:text-xs tracking-[0.4em] uppercase mb-12 md:mb-16 transition-all duration-1000"
          style={{
            color: 'rgba(255, 255, 255, 0.3)',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          About
        </p>

        {/* Main Statement */}
        <h2
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light leading-[1.3] md:leading-[1.4] tracking-tight transition-all duration-1000"
          style={{
            color: 'rgba(255, 255, 255, 0.9)',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            transitionDelay: '0.15s',
            fontFamily: 'Helvetica, Arial, sans-serif',
          }}
        >
          We are a creative studio obsessed with the craft of design.{' '}
          <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
            Our work lives at the intersection of strategy, aesthetics, and technology — 
            creating experiences that resonate and endure.
          </span>
        </h2>

        {/* Secondary Text */}
        <p
          className="mt-16 md:mt-24 text-sm md:text-base leading-relaxed max-w-2xl transition-all duration-1000"
          style={{
            color: 'rgba(255, 255, 255, 0.35)',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transitionDelay: '0.3s',
          }}
        >
          Every project begins with listening. We believe the best design emerges from 
          understanding — of your vision, your audience, and the space between.
        </p>
      </div>
    </section>
  );
};

export default AboutUsSection;
