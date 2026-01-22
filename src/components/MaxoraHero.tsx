import { useEffect, useState } from "react";
import BlurBubble from "./BlurBubble";
import PremiumCTA from "./PremiumCTA";

const MaxoraHero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const navLinks = ['Work', 'About', 'Services', 'Contact'];

  return (
    <section 
      id="hero-section"
      className="relative min-h-screen w-full overflow-hidden flex flex-col"
      style={{ background: '#0a0a0a' }}
    >
      {/* Navigation */}
      <nav 
        className="relative z-20 flex items-center justify-between px-8 py-6 transition-all duration-500"
        style={{
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(-20px)',
        }}
      >
        <div className="text-xl font-bold tracking-wider text-white/90">
          MAXORA
        </div>
        <div className="flex gap-8">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-sm text-white/60 hover:text-white/90 transition-colors duration-300 tracking-wide"
              data-cursor-hover
            >
              {link}
            </a>
          ))}
        </div>
      </nav>

      {/* Blur Bubbles */}
      <BlurBubble size={300} initialX={25} initialY={40} trackingStrength={2} delay={600} />
      <BlurBubble size={200} initialX={75} initialY={35} trackingStrength={2} delay={800} />
      <BlurBubble size={250} initialX={60} initialY={70} trackingStrength={2} delay={1000} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-8 -mt-20">
        {/* Main MAXORA text */}
        <h1 
          className="text-[15vw] md:text-[12vw] font-bold tracking-tighter leading-none transition-all duration-1000 ease-out"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #c0c0c0 25%, #ffffff 50%, #a0a0a0 75%, #ffffff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 80px rgba(255,255,255,0.1)',
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'scale(1)' : 'scale(0.9)',
            transitionDelay: '200ms',
          }}
        >
          MAXORA
        </h1>

        {/* Tagline */}
        <p 
          className="mt-6 text-white/50 text-lg tracking-wide transition-all duration-700"
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '400ms',
          }}
        >
          Creative Agency for the Future
        </p>

        {/* CTA Button */}
        <div 
          className="mt-10 transition-all duration-700"
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '600ms',
          }}
        >
          <PremiumCTA text="Get Started" />
        </div>
      </div>

      {/* Scroll indicator */}
      <div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-700"
        style={{
          opacity: isLoaded ? 0.5 : 0,
          transitionDelay: '1000ms',
        }}
      >
        <span className="text-white/40 text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>
  );
};

export default MaxoraHero;
