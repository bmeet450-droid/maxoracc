import { useState } from "react";
import useScrollAnimation from "@/hooks/useScrollAnimation";

const projects = [
  {
    id: 1,
    title: "Sonder Goods",
    number: "01",
  },
  {
    id: 2,
    title: "Halo Wear",
    number: "02",
  },
  {
    id: 3,
    title: "Lucent Lab",
    number: "03",
  },
  {
    id: 4,
    title: "Nova Studio",
    number: "04",
  },
  {
    id: 5,
    title: "Aether Co",
    number: "05",
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
                background: 'linear-gradient(180deg, rgba(30,35,50,1) 0%, rgba(20,20,30,1) 100%)',
                transform: hoveredId === 1 ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              {/* Inner floating image */}
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] aspect-square rounded-lg transition-transform duration-500"
                style={{
                  background: 'linear-gradient(135deg, rgba(60,80,120,0.8) 0%, rgba(40,50,80,0.9) 100%)',
                  transform: hoveredId === 1 ? 'translate(-50%, -50%) scale(1.05)' : 'translate(-50%, -50%)',
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
                background: 'linear-gradient(180deg, rgba(40,40,40,1) 0%, rgba(25,25,25,1) 100%)',
                transform: hoveredId === 2 ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              {/* Inner floating image with warm glow */}
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55%] aspect-[3/4] rounded-lg transition-transform duration-500"
                style={{
                  background: 'linear-gradient(180deg, rgba(200,120,60,0.9) 0%, rgba(180,100,40,0.8) 100%)',
                  boxShadow: hoveredId === 2 ? '0 0 60px rgba(200,120,60,0.4)' : '0 0 40px rgba(200,120,60,0.2)',
                  transform: hoveredId === 2 ? 'translate(-50%, -50%) scale(1.05)' : 'translate(-50%, -50%)',
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
                background: 'linear-gradient(180deg, rgba(50,55,60,1) 0%, rgba(35,38,42,1) 100%)',
                transform: hoveredId === 3 ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              {/* Inner floating image */}
              <div 
                className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] aspect-square rounded-lg transition-transform duration-500"
                style={{
                  background: 'linear-gradient(135deg, rgba(180,180,180,0.9) 0%, rgba(140,140,140,0.8) 100%)',
                  transform: hoveredId === 3 ? 'translate(-50%, -50%) scale(1.05)' : 'translate(-50%, -50%)',
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
            className="relative mb-16 md:mb-0 md:absolute md:right-[5%] md:top-[420px] lg:top-[450px] w-full md:w-[20%] lg:w-[18%] cursor-pointer group"
            onMouseEnter={() => setHoveredId(4)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              opacity: sectionVisible ? 1 : 0,
              transform: sectionVisible ? 'translateY(0)' : 'translateY(60px)',
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s',
            }}
          >
            <div 
              className="aspect-square rounded-lg overflow-hidden transition-transform duration-500 flex items-center justify-center"
              style={{
                background: 'transparent',
                transform: hoveredId === 4 ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              {/* Simple circle indicator */}
              <div 
                className="w-4 h-4 rounded-full border border-white/40 transition-all duration-300"
                style={{
                  borderColor: hoveredId === 4 ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)',
                }}
              />
            </div>
          </div>

          {/* Project 5 - Small accent, Left Bottom */}
          <div 
            className="relative md:absolute md:left-[8%] md:top-[650px] lg:top-[700px] w-full md:w-[22%] lg:w-[20%] cursor-pointer group"
            onMouseEnter={() => setHoveredId(5)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              opacity: sectionVisible ? 1 : 0,
              transform: sectionVisible ? 'translateY(0)' : 'translateY(60px)',
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.5s',
            }}
          >
            <div 
              className="aspect-[4/3] rounded-lg overflow-hidden transition-transform duration-500"
              style={{
                background: 'linear-gradient(180deg, rgba(45,50,55,1) 0%, rgba(30,32,36,1) 100%)',
                transform: hoveredId === 5 ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              {/* Inner element */}
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45%] aspect-[3/4] rounded transition-transform duration-500"
                style={{
                  background: 'linear-gradient(135deg, rgba(100,110,120,0.8) 0%, rgba(70,75,85,0.9) 100%)',
                  transform: hoveredId === 5 ? 'translate(-50%, -50%) scale(1.05)' : 'translate(-50%, -50%)',
                }}
              />
            </div>
            <div className="flex justify-between items-center mt-4 px-1">
              <span className="text-white text-sm md:text-base">{projects[4].title}</span>
              <span className="text-white/40 text-sm">({projects[4].number})</span>
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
