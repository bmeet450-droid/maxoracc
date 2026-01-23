import { Suspense, useState, useEffect, useRef } from "react";
import useScrollAnimation from "@/hooks/useScrollAnimation";
import GlassDroplet from "./GlassDroplet";
import BubbleTransition from "./BubbleTransition";

const textLines = [
  "CRAFTING",
  "PUSHING BEYOND",
  "THE LIMITS",
  "OF CREATIVE",
  "DESIGN VISION"
];

const AboutSection = () => {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const [contentRevealed, setContentRevealed] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Content reveals when we're about 60% through the section
      const revealPoint = windowHeight * 0.4;
      setContentRevealed(rect.top < revealPoint);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      id="about" 
      ref={containerRef}
      className="relative py-32 md:py-48 px-4 md:px-8 overflow-hidden min-h-screen flex items-center"
      style={{ background: '#0a0a0a' }}
    >
      {/* Top fade gradient */}
      <div 
        className="absolute top-0 left-0 right-0 h-48 pointer-events-none z-0"
        style={{
          background: 'linear-gradient(to bottom, #0a0a0a 0%, transparent 100%)',
        }}
      />
      
      {/* Bottom fade gradient */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none z-0"
        style={{
          background: 'linear-gradient(to top, #0a0a0a 0%, transparent 100%)',
        }}
      />

      {/* Bubble Transition Effect */}
      <BubbleTransition />

      {/* 3D Glass Droplet Effect */}
      <Suspense fallback={null}>
        <GlassDroplet />
      </Suspense>

      {/* Typography Content */}
      <div 
        ref={sectionRef}
        className="relative z-10 max-w-7xl mx-auto w-full transition-all duration-1000"
        style={{
          opacity: contentRevealed ? 1 : 0,
          transform: contentRevealed ? 'scale(1)' : 'scale(0.95)',
        }}
      >
        <div className="flex flex-col items-center justify-center">
          {textLines.map((line, index) => (
            <h2
              key={index}
              className="text-4xl sm:text-6xl md:text-8xl lg:text-8xl xl:text-9xl font-black tracking-tighter text-center leading-[0.85] transition-all duration-700"
              style={{
                color: 'rgba(255, 255, 255, 0.85)',
                textShadow: '0 0 80px rgba(139, 92, 246, 0.3)',
                opacity: isVisible && contentRevealed ? 1 : 0,
                transform: isVisible && contentRevealed ? 'translateY(0)' : 'translateY(40px)',
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
            opacity: isVisible && contentRevealed ? 1 : 0,
            transform: isVisible && contentRevealed ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '0.6s',
          }}
        >
          Where creativity meets innovation
        </p>
      </div>

      {/* Vignette overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-5"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)',
        }}
      />
    </section>
  );
};

export default AboutSection;
