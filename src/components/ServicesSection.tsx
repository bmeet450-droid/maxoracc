import { useState, useEffect, useRef } from "react";
import { Palette, Layout, Video, Megaphone, Clapperboard, Camera } from "lucide-react";
import useScrollAnimation from "@/hooks/useScrollAnimation";

const services = [
  {
    id: 1,
    icon: Palette,
    title: "Brand Identity",
    description: "Crafting unique visual identities that resonate with your audience and stand the test of time.",
    video: "/videos/brand-identity.mov",
  },
  {
    id: 2,
    icon: Layout,
    title: "Web Design",
    description: "Creating immersive digital experiences that captivate users and drive engagement.",
    video: null,
  },
  {
    id: 3,
    icon: Video,
    title: "Motion Design",
    description: "Bringing brands to life through compelling animations and video content.",
    video: "/videos/motion-design.mov",
  },
  {
    id: 4,
    icon: Megaphone,
    title: "Marketing",
    description: "Strategic campaigns that amplify your message and connect with your target market.",
    video: null,
  },
  {
    id: 5,
    icon: Clapperboard,
    title: "Videography",
    description: "Capturing cinematic moments with professional video production and storytelling.",
    video: "/videos/videography.mp4",
  },
  {
    id: 6,
    icon: Camera,
    title: "Photography",
    description: "Creating stunning visual narratives through expert photography and artistic composition.",
    video: "/videos/photography.mp4",
  },
];

const ServicesSection = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [headingParallax, setHeadingParallax] = useState(0);
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation({ threshold: 0.1 });
  const headingRef = useRef<HTMLHeadingElement>(null);
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});

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

  const handleCardHover = (serviceId: number, video: string | null) => {
    setHoveredId(serviceId);
    if (video && videoRefs.current[serviceId]) {
      videoRefs.current[serviceId]?.play();
    }
  };

  const handleCardLeave = (serviceId: number, video: string | null) => {
    setHoveredId(null);
    if (video && videoRefs.current[serviceId]) {
      videoRefs.current[serviceId]?.pause();
      if (videoRefs.current[serviceId]) {
        videoRefs.current[serviceId]!.currentTime = 0;
      }
    }
  };

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
            const isHovered = hoveredId === service.id;
            const hasVideo = service.video !== null;
            
            return (
              <div
                key={service.id}
                className="group relative p-6 md:p-8 rounded-2xl cursor-pointer overflow-hidden"
                onMouseEnter={() => handleCardHover(service.id, service.video)}
                onMouseLeave={() => handleCardLeave(service.id, service.video)}
                style={{
                  background: hasVideo && isHovered ? 'transparent' : 'linear-gradient(135deg, rgba(25,25,25,0.4) 0%, rgba(15,15,15,0.6) 100%)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  opacity: gridVisible ? 1 : 0,
                  transform: gridVisible 
                    ? (isHovered ? (hasVideo ? 'scale(1.05)' : 'translateY(-4px)') : 'translateY(0) scale(1)')
                    : 'translateY(40px)',
                  transition: `all 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`,
                  zIndex: isHovered ? 10 : 1,
                }}
              >
                {/* Video Background for Motion Design */}
                {hasVideo && (
                  <>
                    <video
                      ref={(el) => { videoRefs.current[service.id] = el; }}
                      src={service.video}
                      muted
                      loop
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover rounded-2xl transition-opacity duration-700"
                      style={{
                        opacity: isHovered ? 1 : 0,
                      }}
                    />
                    {/* Dark overlay for text readability */}
                    <div 
                      className="absolute inset-0 rounded-2xl transition-opacity duration-700"
                      style={{
                        opacity: isHovered ? 1 : 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.2) 100%)',
                      }}
                    />
                  </>
                )}

                {/* Hover gradient overlay */}
                <div 
                  className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500"
                  style={{
                    opacity: isHovered && !hasVideo ? 1 : 0,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(120,120,255,0.05) 50%, rgba(255,100,150,0.03) 100%)',
                  }}
                />

                {/* Icon */}
                <div 
                  className="relative mb-4 md:mb-6 transition-all duration-500"
                  style={{
                    transform: isHovered ? 'scale(1.08) rotate(3deg)' : 'scale(1) rotate(0deg)',
                  }}
                >
                  <Icon 
                    size={32} 
                    className="transition-all duration-500"
                    style={{
                      color: isHovered ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.6)',
                      filter: isHovered ? 'drop-shadow(0 0 12px rgba(255,255,255,0.5)) drop-shadow(0 0 20px rgba(255,255,255,0.3))' : 'none',
                    }}
                  />
                </div>

                {/* Title */}
                <h3 className="relative text-white/90 text-lg md:text-xl font-semibold mb-2 md:mb-3 transition-colors duration-300 group-hover:text-white">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="relative text-white/50 text-sm leading-relaxed transition-colors duration-300 group-hover:text-white/70">
                  {service.description}
                </p>

                {/* Bottom gradient line */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-[2px] transition-all duration-500"
                  style={{
                    opacity: isHovered ? 1 : 0,
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                    transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
                  }}
                />

                {/* Corner glow */}
                <div 
                  className="absolute -top-20 -right-20 w-40 h-40 rounded-full pointer-events-none transition-opacity duration-500"
                  style={{
                    opacity: isHovered ? 0.6 : 0,
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
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
