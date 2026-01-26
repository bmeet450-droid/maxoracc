import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
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
    background: '#000000'
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
        <div className="fixed inset-0 z-30 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center gap-8 md:hidden">
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

      {/* Main MAXORA text - Behind Spline (z-0) */}
      <div className="absolute inset-0 flex items-center justify-center z-0 -mt-20 md:-mt-32">
        <h1 className="text-[16vw] md:text-[18vw] tracking-tighter leading-none transition-all duration-1000 ease-out font-extrabold relative max-w-full" style={{
          fontFamily: 'Helvetica, Arial, sans-serif',
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'scale(1)' : 'scale(0.9)',
          transitionDelay: '200ms',
          filter: 'brightness(1.2)'
        }}>
          <span 
            className="relative px-2 md:px-[21px] text-justify text-white"
          >
            MAXORA
          </span>
        </h1>
      </div>

      {/* Bottom gradient to hide Spline watermark */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, #000000 0%, #000000 30%, transparent 100%)'
        }}
      />

      {/* Scroll indicator - on top of gradient */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-700 z-20" style={{
        opacity: isLoaded ? 0.5 : 0,
        transitionDelay: '1000ms'
      }}>
        <span className="text-white/40 text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>;
};
export default MaxoraHero;