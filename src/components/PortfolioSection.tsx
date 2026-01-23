import { useState, useEffect, useRef } from "react";
import useScrollAnimation from "@/hooks/useScrollAnimation";
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";
import portfolio4 from "@/assets/portfolio-4.jpg";
import portfolio5 from "@/assets/portfolio-5.jpg";
import portfolio6 from "@/assets/portfolio-6.jpg";

const projects = [
  {
    id: 1,
    title: "Tonal Alchemy",
    number: "01",
    image: portfolio1,
    category: "Enhanced",
    year: "2024",
  },
  {
    id: 2,
    title: "Phytography",
    number: "02",
    image: portfolio2,
    category: "Wildlife",
    year: "2024",
  },
  {
    id: 3,
    title: "Geometric Narratives",
    number: "03",
    image: portfolio3,
    category: "Architecture",
    year: "2023",
  },
  {
    id: 4,
    title: "The Human Frame",
    number: "04",
    image: portfolio4,
    category: "Art Direction",
    year: "2024",
  },
  {
    id: 5,
    title: "Dimensional Narratives",
    number: "05",
    image: portfolio5,
    category: "Interior Design",
    year: "2023",
  },
  {
    id: 6,
    title: "Prism Composition",
    number: "06",
    image: portfolio6,
    category: "Perspective Design",
    year: "2024",
  },
];

interface PortfolioCardProps {
  project: typeof projects[0];
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  isVisible: boolean;
  delay: string;
  aspectRatio?: string;
  className?: string;
}

const PortfolioCard = ({ 
  project, 
  isHovered, 
  onHover, 
  onLeave, 
  isVisible, 
  delay,
  aspectRatio = "4/5",
  className = ""
}: PortfolioCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch device
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // On touch devices, show overlay content by default
  const showOverlay = isTouchDevice || isHovered;

  useEffect(() => {
    const handleScroll = () => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how far the element is from center of viewport (0 = centered)
      const elementCenter = rect.top + rect.height / 2;
      const distanceFromCenter = elementCenter - windowHeight / 2;
      
      // Normalize to -1 to 1 range based on viewport
      const normalizedDistance = distanceFromCenter / (windowHeight / 2);
      
      // Apply parallax with clamping to prevent excessive movement
      const maxOffset = 30; // Maximum pixels of parallax movement
      const offset = Math.max(-maxOffset, Math.min(maxOffset, normalizedDistance * maxOffset));
      
      setParallaxOffset(offset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      ref={cardRef}
      className={`cursor-pointer group ${className}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(60px)',
        transition: `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay}`,
      }}
    >
      <div 
        className="rounded-lg overflow-hidden transition-transform duration-500 relative"
        style={{
          aspectRatio,
          transform: isHovered ? 'scale(1.02)' : 'scale(1)',
        }}
      >
        <div className="absolute inset-[-15%] w-[130%] h-[130%]">
          <img 
            src={project.image} 
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-300 ease-out"
            style={{
              transform: `translateY(${parallaxOffset}px) scale(${isHovered ? 1.05 : 1})`,
            }}
          />
        </div>
        
        {/* Hover Overlay */}
        <div 
          className="absolute inset-0 flex flex-col justify-end p-6 transition-all duration-500"
          style={{
            background: showOverlay 
              ? 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)' 
              : 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)',
            opacity: 1,
          }}
        >
          <div 
            className="transition-all duration-500"
            style={{
              transform: showOverlay ? 'translateY(0)' : 'translateY(20px)',
              opacity: showOverlay ? 1 : 0,
            }}
          >
            <span className="text-white/60 text-xs tracking-widest uppercase mb-2 block">
              {project.category}
            </span>
            <h3 className="text-white text-xl md:text-2xl font-light mb-2">
              {project.title}
            </h3>
            <div className="flex items-center gap-4">
              <span className="text-white/50 text-sm">{project.year}</span>
              <span className="text-white text-sm flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                View Project
                <svg 
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Title below card */}
      <div className="flex justify-between items-center mt-4 px-1">
        <span className="text-white text-sm md:text-base">{project.title}</span>
        <span className="text-white/40 text-sm">({project.number})</span>
      </div>
    </div>
  );
};

const PortfolioSection = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [headingParallax, setHeadingParallax] = useState(0);
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation({ threshold: 0.1 });
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!headingRef.current) return;
      const rect = headingRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate parallax based on scroll position
      const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
      const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
      const offset = (clampedProgress - 0.5) * 80; // -40px to +40px range
      
      setHeadingParallax(offset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      id="work" 
      ref={sectionRef}
      className="py-32 md:py-48 px-6 md:px-12 lg:px-20" 
      style={{ background: '#000000' }}
    >
      <div className="max-w-[1600px] mx-auto">
        {/* Section Header */}
        <div 
          className="mb-16 transition-all duration-700"
          style={{
            opacity: sectionVisible ? 1 : 0,
            transform: sectionVisible ? 'translateY(0)' : 'translateY(30px)',
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
            Frame & Vision
          </h2>
          <div 
            className="w-full bg-white py-1 sm:py-2 flex justify-between px-4 sm:px-8 md:px-16 transition-all duration-700"
            style={{
              opacity: sectionVisible ? 1 : 0,
              transform: sectionVisible ? 'translateY(0) scaleY(1)' : 'translateY(10px) scaleY(0.8)',
              transitionDelay: '0.3s',
            }}
          >
            <span className="text-black text-[10px] sm:text-xs font-bold tracking-wide">Precise</span>
            <span className="text-black text-[10px] sm:text-xs font-bold tracking-wide">Structured</span>
            <span className="text-black text-[10px] sm:text-xs font-bold tracking-wide">Focused</span>
            <span className="text-black text-[10px] sm:text-xs font-bold tracking-wide">Visual Language</span>
          </div>
        </div>

        {/* Collage Grid - Asymmetric Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-4 sm:gap-10 md:gap-20 lg:gap-24">
          {/* Left Column */}
          <div className="col-span-1 sm:col-span-1 md:col-span-6 lg:col-span-5 flex flex-col gap-4 sm:gap-12 md:gap-36 lg:gap-40">
            <PortfolioCard
              project={projects[0]}
              isHovered={hoveredId === 1}
              onHover={() => setHoveredId(1)}
              onLeave={() => setHoveredId(null)}
              isVisible={sectionVisible}
              delay="0.1s"
              aspectRatio="4/5"
            />

            <PortfolioCard
              project={projects[2]}
              isHovered={hoveredId === 3}
              onHover={() => setHoveredId(3)}
              onLeave={() => setHoveredId(null)}
              isVisible={sectionVisible}
              delay="0.3s"
              aspectRatio="4/5"
              className="md:ml-12 lg:ml-20"
            />

            <PortfolioCard
              project={projects[4]}
              isHovered={hoveredId === 5}
              onHover={() => setHoveredId(5)}
              onLeave={() => setHoveredId(null)}
              isVisible={sectionVisible}
              delay="0.5s"
              aspectRatio="16/9"
            />
          </div>

          {/* Right Column (offset down) */}
          <div className="col-span-1 sm:col-span-1 md:col-span-6 lg:col-span-5 md:col-start-7 lg:col-start-8 flex flex-col gap-4 sm:gap-12 md:gap-36 lg:gap-40 md:mt-48 lg:mt-64">
            <PortfolioCard
              project={projects[1]}
              isHovered={hoveredId === 2}
              onHover={() => setHoveredId(2)}
              onLeave={() => setHoveredId(null)}
              isVisible={sectionVisible}
              delay="0.2s"
              aspectRatio="3/4"
            />

            <PortfolioCard
              project={projects[3]}
              isHovered={hoveredId === 4}
              onHover={() => setHoveredId(4)}
              onLeave={() => setHoveredId(null)}
              isVisible={sectionVisible}
              delay="0.4s"
              aspectRatio="4/5"
              className="md:w-3/4 md:-ml-12 lg:-ml-20"
            />

            <PortfolioCard
              project={projects[5]}
              isHovered={hoveredId === 6}
              onHover={() => setHoveredId(6)}
              onLeave={() => setHoveredId(null)}
              isVisible={sectionVisible}
              delay="0.6s"
              aspectRatio="16/9"
              className="md:ml-8"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
