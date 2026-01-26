import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Spline from '@splinetool/react-spline';

const MaxoraHero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [splineLoaded, setSplineLoaded] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const navLinks = ['Work', 'About', 'Services', 'Contact'];

  return (
    <section id="hero-section" className="relative min-h-screen w-full overflow-hidden flex flex-col" style={{ background: '#000000' }}>
      {/* Spline 3D Scene - Desktop only */}
      {!isMobile ? (
        <div className="absolute inset-0 z-0">
          {/* Loading state */}
          {!splineLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
            </div>
          )}
          <Spline
            scene="https://prod.spline.design/CO6AbJxqSVzTKFUS/scene.splinecode"
            style={{ width: '100%', height: '100%' }}
            onLoad={() => setSplineLoaded(true)}
          />
        </div>
      ) : (
        /* Mobile/Tablet fallback - lightweight gradient background */
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at 50% 30%, rgba(40, 40, 50, 0.8) 0%, rgba(0, 0, 0, 1) 70%)',
            }}
          />
          {/* Subtle animated orbs for visual interest */}
          <div 
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-20 blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(100, 100, 120, 0.5) 0%, transparent 70%)',
              animation: 'pulse 4s ease-in-out infinite',
            }}
          />
          <div 
            className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full opacity-15 blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(80, 80, 100, 0.5) 0%, transparent 70%)',
              animation: 'pulse 5s ease-in-out infinite 1s',
            }}
          />
          {/* Noise texture overlay */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>
      )}

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
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-700 z-10" style={{
        opacity: isLoaded ? 0.5 : 0,
        transitionDelay: '1000ms'
      }}>
        <span className="text-white/40 text-[10px] md:text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-6 md:h-8 bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>
  );
};

export default MaxoraHero;