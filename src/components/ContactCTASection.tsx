import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import useScrollAnimation from "@/hooks/useScrollAnimation";

const ContactCTASection = () => {
  const navigate = useNavigate();
  const [isExpanding, setIsExpanding] = useState(false);
  const [headingParallax, setHeadingParallax] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation({ threshold: 0.2 });

  useEffect(() => {
    const handleScroll = () => {
      if (!headingRef.current) return;
      const rect = headingRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
      const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
      const offset = (clampedProgress - 0.5) * 80;
      
      setHeadingParallax(offset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    setIsExpanding(true);
    
    // Navigate after the expansion animation completes
    setTimeout(() => {
      navigate('/contact');
    }, 800);
  };

  return (
    <>
      {/* Expanding overlay */}
      <div
        className="fixed inset-0 z-[100] pointer-events-none"
        style={{
          background: '#000000',
          opacity: isExpanding ? 1 : 0,
          transform: isExpanding ? 'scale(1)' : 'scale(0)',
          transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          transformOrigin: 'center center',
        }}
      />

      <section id="contact" className="py-32 md:py-48 px-6 md:px-12 lg:px-20" style={{ background: '#000000' }}>
        <div className="max-w-[1600px] mx-auto">
          {/* Section Header - matching "Our Services" style */}
          <div 
            ref={headerRef}
            className="mb-16 transition-all duration-700"
            style={{
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? 'translateY(0)' : 'translateY(30px)',
            }}
          >
            <h2 
              ref={headingRef}
              className="text-white text-3xl sm:text-6xl md:text-8xl lg:text-9xl xl:text-[10rem] font-bold tracking-tighter mb-8 whitespace-nowrap"
              style={{
                transform: `translateY(${headingParallax}px)`,
                transition: 'transform 0.1s ease-out',
              }}
            >
              Let's Create
            </h2>
            <div 
              className="w-full bg-white py-1 sm:py-2 flex justify-between px-4 sm:px-8 md:px-16 transition-all duration-700"
              style={{
                opacity: headerVisible ? 1 : 0,
                transform: headerVisible ? 'translateY(0) scaleY(1)' : 'translateY(10px) scaleY(0.8)',
                transitionDelay: '0.3s',
              }}
            >
              <span className="text-black text-[10px] sm:text-xs font-bold tracking-wide">Vision</span>
              <span className="text-black text-[10px] sm:text-xs font-bold tracking-wide">Collaboration</span>
              <span className="text-black text-[10px] sm:text-xs font-bold tracking-wide">Excellence</span>
              <span className="text-black text-[10px] sm:text-xs font-bold tracking-wide">Together</span>
            </div>
          </div>

          {/* CTA Content */}
          <div 
            className="flex flex-col items-center text-center transition-all duration-700"
            style={{
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? 'translateY(0)' : 'translateY(40px)',
              transitionDelay: '0.4s',
            }}
          >
            <p className="text-white/50 text-sm md:text-base lg:text-lg leading-relaxed mb-12 max-w-2xl">
              Ready to bring your vision to life? We'd love to hear about your project and explore how we can create something extraordinary together.
            </p>

            {/* Expanding Button */}
            <button
              ref={buttonRef}
              onClick={handleClick}
              disabled={isExpanding}
              className="group relative flex items-center gap-3 px-10 py-5 md:px-14 md:py-6 rounded-full text-base md:text-lg font-medium transition-all duration-500 hover:scale-105 disabled:cursor-default"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)',
                border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: '0 0 30px rgba(255,255,255,0.05), inset 0 0 20px rgba(255,255,255,0.03)',
                transform: isExpanding ? 'scale(50)' : 'scale(1)',
                opacity: isExpanding ? 0 : 1,
              }}
            >
              {/* Glow effect */}
              <div 
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)',
                  filter: 'blur(15px)',
                }}
              />
              
              <span className="relative z-10 text-white/90">Get In Touch</span>
              <ArrowRight 
                size={20} 
                className="relative z-10 text-white/60 transition-transform duration-300 group-hover:translate-x-2" 
              />
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactCTASection;
