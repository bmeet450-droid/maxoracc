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
      {/* Branching header section - 5 evenly spaced slots at top */}
      <div className="relative w-full pt-8 md:pt-12 pb-16 md:pb-24">
        {/* Video slots row */}
        <div className="flex justify-center gap-2 md:gap-4 lg:gap-6 px-2 md:px-8">
          {[1, 2, 3, 4, 5].map((slotId) => (
            <div key={slotId} className="flex flex-col items-center">
              {/* Video placeholder rectangle */}
              <div 
                className="w-16 h-10 md:w-28 md:h-16 lg:w-36 lg:h-20 rounded-md md:rounded-lg border-2 border-dashed flex items-center justify-center"
                style={{
                  borderColor: 'rgba(255,255,255,0.4)',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                }}
              >
                <span className="text-[8px] md:text-[10px] lg:text-xs text-neutral-500">
                  Slot {slotId}
                </span>
              </div>
              
              {/* End circle */}
              <div 
                className="w-2 h-2 md:w-3 md:h-3 rounded-full mt-2 md:mt-3"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  boxShadow: '0 0 10px rgba(255,255,255,0.5)',
                }}
              />
              
              {/* Vertical line down to origin */}
              <div 
                className="w-[2px] h-12 md:h-20 lg:h-24"
                style={{
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0.7), rgba(255,255,255,0.3))',
                  boxShadow: '0 0 8px rgba(255,255,255,0.3)',
                }}
              />
            </div>
          ))}
        </div>
        
        {/* Central convergence point */}
        <div className="flex justify-center">
          <div 
            className="w-4 h-4 md:w-5 md:h-5 rounded-full border-2"
            style={{
              borderColor: 'rgba(255,255,255,0.9)',
              backgroundColor: 'rgba(255,255,255,0.3)',
              boxShadow: '0 0 20px rgba(255,255,255,0.6)',
            }}
          />
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
