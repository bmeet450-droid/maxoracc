import { useState, useEffect, useRef } from "react";
import { Palette, Layout, Video, Megaphone, Smartphone, Sparkles } from "lucide-react";
import useScrollAnimation from "@/hooks/useScrollAnimation";

const services = [
  {
    id: 1,
    icon: Palette,
    title: "Brand Identity",
    description: "Crafting unique visual identities that resonate with your audience and stand the test of time.",
  },
  {
    id: 2,
    icon: Layout,
    title: "Web Design",
    description: "Creating immersive digital experiences that captivate users and drive engagement.",
  },
  {
    id: 3,
    icon: Video,
    title: "Motion Design",
    description: "Bringing brands to life through compelling animations and video content.",
  },
  {
    id: 4,
    icon: Megaphone,
    title: "Marketing",
    description: "Strategic campaigns that amplify your message and connect with your target market.",
  },
  {
    id: 5,
    icon: Smartphone,
    title: "App Design",
    description: "Intuitive mobile experiences designed for seamless user interaction.",
  },
  {
    id: 6,
    icon: Sparkles,
    title: "Creative Direction",
    description: "Guiding creative vision from concept to execution with precision and artistry.",
  },
];

const ServicesSection = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [headingParallax, setHeadingParallax] = useState(0);
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation({ threshold: 0.1 });
  const headingRef = useRef<HTMLHeadingElement>(null);

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

  return (
    <section id="services" className="py-32 md:py-48 px-6 md:px-12 lg:px-20" style={{ background: '#000000' }}>
      <div className="max-w-[1600px] mx-auto">
        {/* Section Header */}
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
            Our Services
          </h2>
          <div 
            className="w-full bg-white py-1 sm:py-2 flex justify-between px-4 sm:px-8 md:px-16 transition-all duration-700"
            style={{
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? 'translateY(0) scaleY(1)' : 'translateY(10px) scaleY(0.8)',
              transitionDelay: '0.3s',
            }}
          >
            <span className="text-black text-[10px] sm:text-xs font-bold tracking-wide">Creative</span>
            <span className="text-black text-[10px] sm:text-xs font-bold tracking-wide">Strategic</span>
            <span className="text-black text-[10px] sm:text-xs font-bold tracking-wide">Innovative</span>
            <span className="text-black text-[10px] sm:text-xs font-bold tracking-wide">Impactful</span>
          </div>
        </div>

        {/* Services Grid */}
        <div 
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="group relative p-6 md:p-8 rounded-2xl cursor-pointer"
                onMouseEnter={() => setHoveredId(service.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  background: hoveredId === service.id 
                    ? 'linear-gradient(135deg, rgba(40,40,40,0.6) 0%, rgba(25,25,25,0.8) 100%)'
                    : 'linear-gradient(135deg, rgba(25,25,25,0.4) 0%, rgba(15,15,15,0.6) 100%)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  opacity: gridVisible ? 1 : 0,
                  transform: gridVisible 
                    ? (hoveredId === service.id ? 'translateY(-4px)' : 'translateY(0)')
                    : 'translateY(40px)',
                  transition: `all 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`,
                }}
              >
                {/* Icon */}
                <div 
                  className="mb-4 md:mb-6 transition-all duration-500"
                  style={{
                    transform: hoveredId === service.id ? 'scale(1.1)' : 'scale(1)',
                  }}
                >
                  <Icon 
                    size={32} 
                    className="text-white/60 transition-colors duration-300 group-hover:text-white/90" 
                  />
                </div>

                {/* Title */}
                <h3 className="text-white/90 text-lg md:text-xl font-semibold mb-2 md:mb-3">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-white/50 text-sm leading-relaxed">
                  {service.description}
                </p>

                {/* Hover glow */}
                <div 
                  className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500"
                  style={{
                    opacity: hoveredId === service.id ? 1 : 0,
                    boxShadow: '0 20px 40px -20px rgba(255,255,255,0.05)',
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
