import { useEffect, useRef, useState } from "react";

interface TimelinePoint {
  id: number;
  offset: number; // percentage from top (0-100)
  side: "left" | "right";
  lineLength: number; // px for desktop
  lineLengthMobile: number; // px for mobile
  content?: React.ReactNode;
}

const youtubeVideos = [
  "mv-g2qryw5U",
  "WaVWVXwI5ZE",
  "u74W5pBo8z4",
  "27f6MRjFOzg",
  "1lJVOyULdrM",
  "EuN9eaezi5E",
];

const timelinePoints: TimelinePoint[] = [
  { id: 1, offset: 10, side: "left", lineLength: 60, lineLengthMobile: 12 },
  { id: 2, offset: 24, side: "right", lineLength: 80, lineLengthMobile: 12 },
  { id: 3, offset: 38, side: "left", lineLength: 70, lineLengthMobile: 12 },
  { id: 4, offset: 52, side: "right", lineLength: 65, lineLengthMobile: 12 },
  { id: 5, offset: 66, side: "left", lineLength: 75, lineLengthMobile: 12 },
  { id: 6, offset: 80, side: "right", lineLength: 60, lineLengthMobile: 12 },
];

// Branch configuration for the top section
const branchSlots = [
  { id: 1, angle: -60, length: 120, lengthMobile: 60 },
  { id: 2, angle: -30, length: 100, lengthMobile: 50 },
  { id: 3, angle: 0, length: 90, lengthMobile: 45 },
  { id: 4, angle: 30, length: 100, lengthMobile: 50 },
  { id: 5, angle: 60, length: 120, lengthMobile: 60 },
];

const ScrollTimeline = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const containerHeight = container.offsetHeight;

      const scrollStart = windowHeight;
      const scrollEnd = -containerHeight;
      const totalDistance = scrollStart - scrollEnd;
      const currentPosition = rect.top;
      const progress = (scrollStart - currentPosition) / totalDistance;

      setScrollProgress(Math.max(0, Math.min(1, progress)));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const glowHeight = scrollProgress * 100;

  return (
    <div 
      ref={containerRef}
      className="relative w-full min-h-[220vh] md:min-h-[260vh] lg:min-h-[320vh]"
      style={{ background: '#000000' }}
    >
      {/* Branching header section */}
      <div className="relative w-full h-[40vh] md:h-[50vh] flex items-end justify-center pb-8">
        {/* Central origin point */}
        <div className="relative">
          {/* Origin circle */}
          <div 
            className="w-4 h-4 md:w-5 md:h-5 rounded-full border-2 z-10 relative"
            style={{
              borderColor: 'rgba(255,255,255,0.9)',
              backgroundColor: 'rgba(255,255,255,0.3)',
              boxShadow: '0 0 20px rgba(255,255,255,0.6)',
            }}
          />
          
          {/* Branch lines with video slots */}
          {branchSlots.map((branch) => {
            const length = isMobile ? branch.lengthMobile : branch.length;
            const angleRad = (branch.angle * Math.PI) / 180;
            const endX = Math.sin(angleRad) * length;
            const endY = -Math.cos(angleRad) * length;
            
            return (
              <div key={branch.id} className="absolute top-1/2 left-1/2">
                {/* SVG curved line */}
                <svg
                  className="absolute overflow-visible"
                  style={{
                    left: 0,
                    top: 0,
                    transform: 'translate(-50%, -50%)',
                  }}
                  width={Math.abs(endX) * 2 + 20}
                  height={Math.abs(endY) + 20}
                >
                  <path
                    d={`M 0,0 Q ${endX * 0.5},${endY * 0.3} ${endX},${endY}`}
                    fill="none"
                    stroke="rgba(255,255,255,0.7)"
                    strokeWidth="2"
                    style={{
                      filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.4))',
                    }}
                  />
                </svg>
                
                {/* End circle */}
                <div 
                  className="absolute w-2 h-2 md:w-3 md:h-3 rounded-full"
                  style={{
                    left: endX,
                    top: endY,
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    boxShadow: '0 0 10px rgba(255,255,255,0.5)',
                  }}
                />
                
                {/* Video placeholder rectangle */}
                <div 
                  className="absolute w-24 h-14 md:w-32 md:h-20 lg:w-40 lg:h-24 rounded-lg md:rounded-xl border-2 border-dashed flex items-center justify-center"
                  style={{
                    left: endX + (branch.angle < 0 ? -60 : branch.angle > 0 ? 10 : -48) + (isMobile ? (branch.angle < 0 ? 20 : branch.angle > 0 ? -10 : 0) : 0),
                    top: endY - (isMobile ? 50 : 70),
                    borderColor: 'rgba(255,255,255,0.4)',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                  }}
                >
                  <span className="text-[10px] md:text-xs text-neutral-500">
                    Slot {branch.id}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Central vertical line - positioned left on mobile, center on desktop */}
      <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px]">
        {/* Base gray line */}
        <div className="absolute inset-0 bg-neutral-700" />
        
        {/* Glowing white fill */}
        <div 
          className="absolute top-0 left-0 right-0 transition-none"
          style={{ 
            height: `${glowHeight}%`,
            background: 'linear-gradient(to bottom, rgba(255,255,255,1), rgba(255,255,255,0.95))',
            boxShadow: '0 0 30px rgba(255,255,255,0.9), 0 0 60px rgba(255,255,255,0.7), 0 0 100px rgba(255,255,255,0.5), 0 0 150px rgba(255,255,255,0.3)',
          }}
        />
      </div>

      {/* Timeline points */}
      {timelinePoints.map((point, index) => {
        const pointProgress = point.offset / 100;
        const isActive = scrollProgress >= pointProgress;
        const lineLength = isMobile ? point.lineLengthMobile : point.lineLength;
        // On mobile, all videos go to the right
        const effectiveSide = isMobile ? 'right' : point.side;

        return (
          <div
            key={point.id}
            className="absolute left-6 md:left-1/2 md:-translate-x-1/2 flex items-center"
            style={{ top: `${point.offset}%` }}
          >
            {/* Perpendicular line and circle - positioned based on side */}
            <div 
              className={`flex items-center ${effectiveSide === 'left' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Circle at center */}
              <div 
                className="w-3 h-3 md:w-4 md:h-4 rounded-full border-2 transition-all duration-300"
                style={{
                  borderColor: isActive ? 'rgba(255,255,255,0.9)' : 'rgba(115,115,115,1)',
                  backgroundColor: isActive ? 'rgba(255,255,255,0.3)' : 'transparent',
                  boxShadow: isActive ? '0 0 15px rgba(255,255,255,0.6)' : 'none',
                }}
              />
              
              {/* Perpendicular line */}
              <div 
                className="h-[2px] transition-all duration-300"
                style={{
                  width: `${lineLength}px`,
                  background: isActive 
                    ? 'linear-gradient(to right, rgba(255,255,255,0.9), rgba(255,255,255,0.5))' 
                    : 'rgba(115,115,115,1)',
                  boxShadow: isActive ? '0 0 10px rgba(255,255,255,0.4)' : 'none',
                }}
              />
              
              {/* Small circle at end */}
              <div 
                className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: isActive ? 'rgba(255,255,255,0.8)' : 'rgba(115,115,115,1)',
                  boxShadow: isActive ? '0 0 10px rgba(255,255,255,0.5)' : 'none',
                }}
              />
            </div>

            {/* Content slot - positioned to align circle with video center */}
            <div 
              className={`absolute ${effectiveSide === 'left' ? 'right-full' : 'left-full'}`}
              style={{ 
                top: '50%',
                transform: 'translateY(-50%)',
                [effectiveSide === 'right' ? 'marginLeft' : 'marginRight']: `${lineLength + (isMobile ? 8 : 12)}px`,
              }}
            >
              {youtubeVideos[index] ? (
                /* YouTube embed */
                <div 
                  className="w-[calc(100vw-120px)] sm:w-56 md:w-56 lg:w-80 aspect-video rounded-xl md:rounded-2xl overflow-hidden transition-all duration-500"
                  style={{
                    opacity: isActive ? 1 : 0.3,
                    boxShadow: isActive 
                      ? '0 0 30px rgba(255,255,255,0.2), 0 10px 40px rgba(0,0,0,0.5)' 
                      : '0 5px 20px rgba(0,0,0,0.3)',
                  }}
                >
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeVideos[index]}`}
                    title={`YouTube video ${point.id}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              ) : (
                /* Empty placeholder slot */
                <div 
                  className="w-[calc(100vw-120px)] sm:w-56 md:w-56 lg:w-80 aspect-video rounded-xl md:rounded-2xl border-2 border-dashed transition-all duration-500 flex items-center justify-center"
                  style={{
                    borderColor: isActive ? 'rgba(255,255,255,0.4)' : 'rgba(115,115,115,0.5)',
                    backgroundColor: isActive ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                    opacity: isActive ? 1 : 0.5,
                  }}
                >
                  <span 
                    className="text-xs md:text-sm transition-colors duration-300"
                    style={{ color: isActive ? 'rgba(255,255,255,0.5)' : 'rgba(115,115,115,0.5)' }}
                  >
                    Video Slot {point.id}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ScrollTimeline;
