import { useEffect, useState, useRef } from "react";
import { Sparkles } from "lucide-react";

interface PremiumCTAProps {
  text?: string;
  onClick?: () => void;
}

const PremiumCTA = ({ text = "Get Started", onClick }: PremiumCTAProps) => {
  const [isFloating, setIsFloating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [originalRect, setOriginalRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (buttonRef.current && !originalRect) {
      setOriginalRect(buttonRef.current.getBoundingClientRect());
    }
  }, [originalRect]);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero-section');
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        // Transform when hero is mostly out of view
        setIsFloating(rect.bottom < window.innerHeight * 0.3);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const baseStyles = `
    relative overflow-hidden
    font-medium tracking-wide
    transition-all duration-500 ease-out
    backdrop-blur-sm
  `;

  const heroStyles = `
    px-5 py-2.5 md:px-7 md:py-3 rounded-full text-sm md:text-base
    ${isHovered ? 'scale-105' : 'scale-100'}
  `;

  const floatingStyles = `
    fixed bottom-8 right-8 z-50
    w-14 h-14 rounded-full
    flex items-center justify-center
    ${isHovered ? 'scale-110' : 'scale-100'}
  `;

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-cursor-hover
      className={`${baseStyles} ${isFloating ? floatingStyles : heroStyles}`}
      style={{
        background: 'linear-gradient(135deg, rgba(30,30,30,0.9) 0%, rgba(20,20,20,0.95) 100%)',
        border: '1px solid transparent',
        backgroundClip: 'padding-box',
        boxShadow: isHovered 
          ? `0 0 30px rgba(255,255,255,0.15), 
             0 0 60px rgba(255,255,255,0.08),
             inset 0 1px 0 rgba(255,255,255,0.2)`
          : `0 0 20px rgba(255,255,255,0.08), 
             0 0 40px rgba(255,255,255,0.04),
             inset 0 1px 0 rgba(255,255,255,0.1)`,
      }}
    >
      {/* Reflective border gradient overlay */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          padding: '1px',
          background: isHovered
            ? 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 30%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.1) 70%, rgba(255,255,255,0.4) 100%)'
            : 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.05) 70%, rgba(255,255,255,0.2) 100%)',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'xor',
          WebkitMaskComposite: 'xor',
          transition: 'all 0.3s ease-out',
        }}
      />
      
      {/* Content */}
      <span 
        className="relative z-10 text-white/90 transition-all duration-300"
        style={{
          opacity: isFloating ? 0 : 1,
          transform: isFloating ? 'scale(0)' : 'scale(1)',
        }}
      >
        {text}
      </span>
      
      {/* Floating icon */}
      <Sparkles 
        className="absolute text-white/90 transition-all duration-300"
        style={{
          opacity: isFloating ? 1 : 0,
          transform: isFloating ? 'scale(1)' : 'scale(0)',
          width: 20,
          height: 20,
        }}
      />
    </button>
  );
};

export default PremiumCTA;
