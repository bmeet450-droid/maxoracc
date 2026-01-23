import { Suspense } from "react";
import useScrollAnimation from "@/hooks/useScrollAnimation";
import GlassDroplet from "./GlassDroplet";

const textLines = [
  "CRAFTING",
  "PUSHING BEYOND",
  "THE LIMITS",
  "OF CREATIVE",
  "DESIGN VISION"
];

const AboutSection = () => {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section 
      id="about" 
      className="relative py-32 md:py-48 px-4 md:px-8 overflow-hidden min-h-screen flex items-center"
      style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #0d0d0d 50%, #0a0a0a 100%)' }}
    >
      {/* 3D Glass Droplet Effect */}
      <Suspense fallback={null}>
        <GlassDroplet />
      </Suspense>

      {/* Typography Content */}
      <div 
        ref={sectionRef}
        className="relative z-10 max-w-7xl mx-auto w-full"
      >
        <div className="flex flex-col items-center justify-center">
          {textLines.map((line, index) => (
            <h2
              key={index}
              className="text-4xl sm:text-6xl md:text-8xl lg:text-8xl xl:text-9xl font-black tracking-tighter text-center leading-[0.85] transition-all duration-700"
              style={{
                color: 'rgba(255, 255, 255, 0.85)',
                textShadow: '0 0 80px rgba(139, 92, 246, 0.3)',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                transitionDelay: `${index * 0.1}s`,
                fontFamily: 'Helvetica, Arial, sans-serif',
              }}
            >
              {line}
            </h2>
          ))}
        </div>

        {/* Subtle tagline */}
        <p 
          className="text-center text-white/30 text-xs md:text-sm tracking-[0.3em] uppercase mt-16 transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '0.6s',
          }}
        >
          Where creativity meets innovation
        </p>
      </div>

      {/* Vignette overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)',
        }}
      />
    </section>
  );
};

export default AboutSection;
