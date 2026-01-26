import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Spline from '@splinetool/react-spline';

const MaxoraHero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const navLinks = ['Work', 'About', 'Services', 'Contact'];

  return (
    <section id="hero-section" className="relative min-h-screen w-full overflow-hidden flex flex-col" style={{ background: '#000000' }}>
      {/* Spline 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Spline
          scene="https://prod.spline.design/CO6AbJxqSVzTKFUS/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

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
          {navLinks.map(link => (
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

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-700 z-10" style={{
        opacity: isLoaded ? 0.5 : 0,
        transitionDelay: '1000ms'
      }}>
        <span className="text-white/40 text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>
  );
};

export default MaxoraHero;