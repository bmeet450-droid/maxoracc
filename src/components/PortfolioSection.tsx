import { useState } from "react";
import useScrollAnimation from "@/hooks/useScrollAnimation";

const projects = [
  {
    id: 1,
    title: "Brand Identity",
    category: "Branding",
    description: "Complete visual identity for a luxury fashion brand",
  },
  {
    id: 2,
    title: "Digital Experience",
    category: "Web Design",
    description: "Immersive web platform for an art gallery",
  },
  {
    id: 3,
    title: "Motion Graphics",
    category: "Animation",
    description: "Promotional video series for tech startup",
  },
  {
    id: 4,
    title: "Product Launch",
    category: "Campaign",
    description: "Multi-channel campaign for consumer electronics",
  },
  {
    id: 5,
    title: "App Design",
    category: "UI/UX",
    description: "Mobile application for wellness platform",
  },
  {
    id: 6,
    title: "Visual System",
    category: "Branding",
    description: "Comprehensive design system for fintech company",
  },
];

const PortfolioSection = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section id="work" className="py-20 md:py-32 px-4 md:px-8" style={{ background: '#0a0a0a' }}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div 
          ref={headerRef}
          className="mb-12 md:mb-20 transition-all duration-700"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(30px)',
          }}
        >
          <p className="text-white/40 text-xs md:text-sm tracking-widest uppercase mb-2">Portfolio</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white/90 tracking-tight">
            Selected Work
          </h2>
        </div>

        {/* Projects Grid */}
        <div 
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.02]"
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                background: 'linear-gradient(135deg, rgba(30,30,30,0.8) 0%, rgba(20,20,20,0.9) 100%)',
                border: '1px solid rgba(255,255,255,0.05)',
                opacity: gridVisible ? 1 : 0,
                transform: gridVisible ? 'translateY(0)' : 'translateY(40px)',
                transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`,
              }}
            >
              {/* Placeholder gradient background */}
              <div 
                className="absolute inset-0 opacity-50 transition-opacity duration-500 group-hover:opacity-70"
                style={{
                  background: `linear-gradient(${135 + project.id * 30}deg, rgba(60,60,60,0.3) 0%, rgba(40,40,40,0.5) 100%)`,
                }}
              />

              {/* Content overlay */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <p 
                  className="text-white/40 text-xs tracking-widest uppercase mb-1 transition-all duration-300"
                  style={{
                    transform: hoveredId === project.id ? 'translateY(0)' : 'translateY(10px)',
                    opacity: hoveredId === project.id ? 1 : 0.6,
                  }}
                >
                  {project.category}
                </p>
                <h3 
                  className="text-white/90 text-xl md:text-2xl font-semibold mb-2 transition-all duration-300"
                  style={{
                    transform: hoveredId === project.id ? 'translateY(0)' : 'translateY(5px)',
                  }}
                >
                  {project.title}
                </h3>
                <p 
                  className="text-white/50 text-sm transition-all duration-500"
                  style={{
                    opacity: hoveredId === project.id ? 1 : 0,
                    transform: hoveredId === project.id ? 'translateY(0)' : 'translateY(10px)',
                  }}
                >
                  {project.description}
                </p>
              </div>

              {/* Hover border glow */}
              <div 
                className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500"
                style={{
                  opacity: hoveredId === project.id ? 1 : 0,
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
