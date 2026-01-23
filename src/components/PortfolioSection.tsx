import { useState } from "react";
import useScrollAnimation from "@/hooks/useScrollAnimation";
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";
import portfolio4 from "@/assets/portfolio-4.jpg";

const projects = [
  {
    id: 1,
    title: "Sonder Goods",
    number: "01",
    image: portfolio1,
  },
  {
    id: 2,
    title: "Halo Wear",
    number: "02",
    image: portfolio2,
  },
  {
    id: 3,
    title: "Lucent Lab",
    number: "03",
    image: portfolio3,
  },
  {
    id: 4,
    title: "Nova Studio",
    number: "04",
    image: portfolio4,
  },
];

const PortfolioSection = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section 
      id="work" 
      ref={sectionRef}
      className="py-32 md:py-48 px-6 md:px-12 lg:px-20" 
      style={{ background: '#0a0a0a' }}
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
          <p className="text-white/50 text-sm tracking-wide mb-4">
            shaping bold interactive ideas into <span className="text-white">sleek digital realities</span> — built with intent, speed, and visual clarity.
          </p>
          <button className="px-5 py-2.5 text-sm text-white border border-white/30 rounded-full hover:bg-white hover:text-black transition-all duration-300">
            SEE WORKS
          </button>
        </div>

        {/* Collage Grid - Asymmetric Layout */}
        <div className="grid grid-cols-12 gap-12 md:gap-16 lg:gap-24">
          {/* Left Column - Projects 1 & 3 */}
          <div className="col-span-12 md:col-span-5 flex flex-col gap-16 md:gap-24 lg:gap-32">
            {/* Project 1 - Large */}
            <div 
              className="cursor-pointer group"
              onMouseEnter={() => setHoveredId(1)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                opacity: sectionVisible ? 1 : 0,
                transform: sectionVisible ? 'translateY(0)' : 'translateY(60px)',
                transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.1s',
              }}
            >
              <div 
                className="aspect-[4/5] rounded-lg overflow-hidden transition-transform duration-500"
                style={{
                  transform: hoveredId === 1 ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                <img 
                  src={projects[0].image} 
                  alt={projects[0].title}
                  className="w-full h-full object-cover transition-transform duration-700"
                  style={{
                    transform: hoveredId === 1 ? 'scale(1.08)' : 'scale(1)',
                  }}
                />
              </div>
              <div className="flex justify-between items-center mt-4 px-1">
                <span className="text-white text-sm md:text-base">{projects[0].title}</span>
                <span className="text-white/40 text-sm">({projects[0].number})</span>
              </div>
            </div>

            {/* Project 3 - Medium */}
            <div 
              className="cursor-pointer group md:ml-12 lg:ml-20"
              onMouseEnter={() => setHoveredId(3)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                opacity: sectionVisible ? 1 : 0,
                transform: sectionVisible ? 'translateY(0)' : 'translateY(60px)',
                transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s',
              }}
            >
              <div 
                className="aspect-[4/5] rounded-lg overflow-hidden transition-transform duration-500"
                style={{
                  transform: hoveredId === 3 ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                <img 
                  src={projects[2].image} 
                  alt={projects[2].title}
                  className="w-full h-full object-cover transition-transform duration-700"
                  style={{
                    transform: hoveredId === 3 ? 'scale(1.08)' : 'scale(1)',
                  }}
                />
              </div>
              <div className="flex justify-between items-center mt-4 px-1">
                <span className="text-white text-sm md:text-base">{projects[2].title}</span>
                <span className="text-white/40 text-sm">({projects[2].number})</span>
              </div>
            </div>
          </div>

          {/* Right Column - Projects 2 & 4 (offset down) */}
          <div className="col-span-12 md:col-span-5 md:col-start-8 flex flex-col gap-16 md:gap-24 lg:gap-32 md:mt-48 lg:mt-64">
            {/* Project 2 */}
            <div 
              className="cursor-pointer group"
              onMouseEnter={() => setHoveredId(2)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                opacity: sectionVisible ? 1 : 0,
                transform: sectionVisible ? 'translateY(0)' : 'translateY(60px)',
                transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s',
              }}
            >
              <div 
                className="aspect-[3/4] rounded-lg overflow-hidden transition-transform duration-500"
                style={{
                  transform: hoveredId === 2 ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                <img 
                  src={projects[1].image} 
                  alt={projects[1].title}
                  className="w-full h-full object-cover transition-transform duration-700"
                  style={{
                    transform: hoveredId === 2 ? 'scale(1.08)' : 'scale(1)',
                  }}
                />
              </div>
              <div className="flex justify-between items-center mt-4 px-1">
                <span className="text-white text-sm md:text-base">{projects[1].title}</span>
                <span className="text-white/40 text-sm">({projects[1].number})</span>
              </div>
            </div>

            {/* Project 4 - smaller, offset left */}
            <div 
              className="cursor-pointer group md:w-3/4 md:-ml-12 lg:-ml-20"
              onMouseEnter={() => setHoveredId(4)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                opacity: sectionVisible ? 1 : 0,
                transform: sectionVisible ? 'translateY(0)' : 'translateY(60px)',
                transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s',
              }}
            >
              <div 
                className="aspect-[4/5] rounded-lg overflow-hidden transition-transform duration-500"
                style={{
                  transform: hoveredId === 4 ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                <img 
                  src={projects[3].image} 
                  alt={projects[3].title}
                  className="w-full h-full object-cover transition-transform duration-700"
                  style={{
                    transform: hoveredId === 4 ? 'scale(1.08)' : 'scale(1)',
                  }}
                />
              </div>
              <div className="flex justify-between items-center mt-4 px-1">
                <span className="text-white text-sm md:text-base">{projects[3].title}</span>
                <span className="text-white/40 text-sm">({projects[3].number})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
