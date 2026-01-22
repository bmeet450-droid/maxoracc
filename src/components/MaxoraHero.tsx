import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import PremiumCTA from "./PremiumCTA";
import VideoCollage from "./VideoCollage";

const MaxoraHero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);
  const navLinks = ['Work', 'About', 'Services', 'Contact'];
  return <section id="hero-section" className="relative min-h-screen w-full overflow-hidden flex flex-col" style={{
    background: '#0a0a0a'
  }}>
      {/* Video Collage Background */}
      <VideoCollage />
      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-4 md:px-8 py-4 md:py-6 transition-all duration-500" style={{
      opacity: isLoaded ? 1 : 0,
      transform: isLoaded ? 'translateY(0)' : 'translateY(-20px)'
    }}>
        <div className="text-lg md:text-xl font-bold tracking-wider text-white/90 mx-0 md:mx-[29px] my-0 md:my-[9px]">
          MAXORA
        </div>
        
        {/* Desktop nav */}
        <div className="hidden md:flex gap-8">
          {navLinks.map(link => <a key={link} href={`#${link.toLowerCase()}`} className="text-sm text-white/60 hover:text-white/90 transition-colors duration-300 tracking-wide" data-cursor-hover>
              {link}
            </a>)}
        </div>
        
        {/* Mobile hamburger */}
        <button 
          className="md:hidden text-white/80 hover:text-white transition-colors p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-[#0a0a0a]/95 backdrop-blur-md flex flex-col items-center justify-center gap-8 md:hidden">
          <button 
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
          {navLinks.map(link => (
            <a 
              key={link} 
              href={`#${link.toLowerCase()}`} 
              className="text-2xl text-white/70 hover:text-white transition-colors duration-300 tracking-wide"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link}
            </a>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 -mt-24 md:-mt-32 px-4 md:px-[95px] mx-0 text-primary-foreground">
        {/* Main MAXORA text */}
        <h1 className="text-[16vw] md:text-[18vw] tracking-tighter leading-none transition-all duration-1000 ease-out font-extrabold my-0 relative max-w-full" style={{
        fontFamily: 'Helvetica, Arial, sans-serif',
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? 'scale(1)' : 'scale(0.9)',
        transitionDelay: '200ms'
      }}>
          {/* Glow layer behind text */}
          <span className="absolute inset-0 px-2 md:px-[21px] text-justify blur-2xl opacity-30" style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #c0c0c0 50%, #ffffff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'pulse-glow 3s ease-in-out infinite'
          }}>
            MAXORA
          </span>
          {/* Main text */}
          <span className="relative px-2 md:px-[21px] text-justify" style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #c0c0c0 25%, #ffffff 50%, #a0a0a0 75%, #ffffff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            MAXORA
          </span>
          <style>{`
            @keyframes pulse-glow {
              0%, 100% { opacity: 0.02; filter: blur(20px); }
              50% { opacity: 0.06; filter: blur(30px); }
            }
          `}</style>
        </h1>

        {/* Tagline */}
        <p className="mt-4 md:mt-6 text-white/50 text-sm md:text-lg tracking-wide transition-all duration-700 text-center px-4" style={{
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
        transitionDelay: '400ms'
      }}>Creative Minds Will Rule the Future</p>

        {/* CTA Button */}
        <div className="mt-6 md:mt-10 transition-all duration-700" style={{
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
        transitionDelay: '600ms'
      }}>
          <PremiumCTA text="Get Started" />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-700" style={{
      opacity: isLoaded ? 0.5 : 0,
      transitionDelay: '1000ms'
    }}>
        <span className="text-white/40 text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>;
};
export default MaxoraHero;