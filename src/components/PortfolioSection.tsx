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
      className="py-32 md:py-48 px-6 md:px-12 lg:px-20 min-h-screen" 
      style={{ background: '#0a0a0a' }}
    >
      <div className="max-w-[1800px] mx-auto">
        {/* Section Header */}
        <div 
          className="mb-8 transition-all duration-700"
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

        {/* Collage Grid */}
        <div className="relative mt-24 md:mt-32">
          {/* Project 1 - Large, Left */}
          <div 
            className="relative mb-16 md:mb-0 md:absolute md:left-0 md:top-0 w-full md:w-[45%] lg:w-[40%] cursor-pointer group"
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
                  transform: hoveredId === 1 ? 'scale(1.05)' : 'scale(1)',
                }}
              />
            </div>
            <div className="flex justify-between items-center mt-4 px-1">
              <span className="text-white text-sm md:text-base">{projects[0].title}</span>
              <span className="text-white/40 text-sm">({projects[0].number})</span>
            </div>
          </div>

          {/* Project 2 - Medium, Right Top */}
          <div 
            className="relative mb-16 md:mb-0 md:absolute md:right-0 md:top-8 w-full md:w-[35%] lg:w-[30%] cursor-pointer group"
            onMouseEnter={() => setHoveredId(2)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              opacity: sectionVisible ? 1 : 0,
              transform: sectionVisible ? 'translateY(0)' : 'translateY(60px)',
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s',
            }}
          >
            <div 
              className="aspect-[4/3] rounded-lg overflow-hidden transition-transform duration-500"
              style={{
                transform: hoveredId === 2 ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              <img 
                src={projects[1].image} 
                alt={projects[1].title}
                className="w-full h-full object-cover transition-transform duration-700"
                style={{
                  transform: hoveredId === 2 ? 'scale(1.05)' : 'scale(1)',
                }}
              />
            </div>
            <div className="flex justify-between items-center mt-4 px-1">
              <span className="text-white text-sm md:text-base">{projects[1].title}</span>
              <span className="text-white/40 text-sm">({projects[1].number})</span>
            </div>
          </div>

          {/* Project 3 - Medium, Center Bottom */}
          <div 
            className="relative mb-16 md:mb-0 md:absolute md:left-1/2 md:-translate-x-1/2 md:top-[500px] lg:top-[550px] w-full md:w-[30%] lg:w-[28%] cursor-pointer group"
            onMouseEnter={() => setHoveredId(3)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              opacity: sectionVisible ? 1 : 0,
              transform: sectionVisible ? 'translateY(0)' : 'translateY(60px)',
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s',
            }}
          >
            <div 
              className="aspect-[3/4] rounded-lg overflow-hidden transition-transform duration-500"
              style={{
                transform: hoveredId === 3 ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              <img 
                src={projects[2].image} 
                alt={projects[2].title}
                className="w-full h-full object-cover transition-transform duration-700"
                style={{
                  transform: hoveredId === 3 ? 'scale(1.05)' : 'scale(1)',
                }}
              />
            </div>
            <div className="flex justify-between items-center mt-4 px-1">
              <span className="text-white text-sm md:text-base">{projects[2].title}</span>
              <span className="text-white/40 text-sm">({projects[2].number})</span>
            </div>
          </div>

          {/* Project 4 - Small, Right Bottom */}
          <div 
            className="relative mb-16 md:mb-0 md:absolute md:right-[5%] md:top-[420px] lg:top-[450px] w-full md:w-[25%] lg:w-[22%] cursor-pointer group"
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
                  transform: hoveredId === 4 ? 'scale(1.05)' : 'scale(1)',
                }}
              />
            </div>
            <div className="flex justify-between items-center mt-4 px-1">
              <span className="text-white text-sm md:text-base">{projects[3].title}</span>
              <span className="text-white/40 text-sm">({projects[3].number})</span>
            </div>
          </div>

          {/* Spacer for mobile layout */}
          <div className="md:hidden h-8" />
          
          {/* Desktop spacer to account for absolute positioning */}
          <div className="hidden md:block h-[900px] lg:h-[950px]" />
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
