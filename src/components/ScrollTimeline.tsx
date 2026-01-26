import { useEffect, useRef, useState } from "react";

interface TimelinePoint {
  id: number;
  offset: number; // percentage from top (0-100)
  side: "left" | "right";
  lineLength: number; // px
  content?: React.ReactNode;
}

const youtubeVideos = [
  "mv-g2qryw5U",
  "WaVWVXwI5ZE",
  "u74W5pBo8z4",
  "27f6MRjFOzg",
  "1lJVOyULdrM",
  null, // placeholder for slot 6
];

const timelinePoints: TimelinePoint[] = [
  { id: 1, offset: 8, side: "left", lineLength: 80 },
  { id: 2, offset: 25, side: "right", lineLength: 120 },
  { id: 3, offset: 42, side: "left", lineLength: 100 },
  { id: 4, offset: 58, side: "right", lineLength: 90 },
  { id: 5, offset: 75, side: "left", lineLength: 110 },
  { id: 6, offset: 92, side: "right", lineLength: 85 },
];

const ScrollTimeline = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const containerHeight = container.offsetHeight;

      // Calculate progress: 0 when container top hits viewport bottom, 1 when container bottom leaves viewport top
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
      className="relative w-full min-h-[300vh] flex justify-center"
      style={{ background: '#000000' }}
    >
      {/* Central vertical line */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px]">
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
        

        return (
          <div
            key={point.id}
            className="absolute left-1/2 -translate-x-1/2 flex items-center"
            style={{ top: `${point.offset}%` }}
          >
            {/* Perpendicular line and circle - positioned based on side */}
            <div 
              className={`flex items-center ${point.side === 'left' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Circle at center */}
              <div 
                className="w-4 h-4 rounded-full border-2 transition-all duration-300"
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
                  width: `${point.lineLength}px`,
                  background: isActive 
                    ? 'linear-gradient(to right, rgba(255,255,255,0.9), rgba(255,255,255,0.5))' 
                    : 'rgba(115,115,115,1)',
                  boxShadow: isActive ? '0 0 10px rgba(255,255,255,0.4)' : 'none',
                }}
              />
              
              {/* Small circle at end */}
              <div 
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: isActive ? 'rgba(255,255,255,0.8)' : 'rgba(115,115,115,1)',
                  boxShadow: isActive ? '0 0 10px rgba(255,255,255,0.5)' : 'none',
                }}
              />
            </div>

            {/* Content slot - positioned to align circle with video center */}
            <div 
              className={`absolute ${point.side === 'left' ? 'right-full' : 'left-full'}`}
              style={{ 
                top: '50%',
                transform: 'translateY(-50%)',
                [point.side === 'right' ? 'marginLeft' : 'marginRight']: `${point.lineLength + 16}px`,
              }}
            >
              {youtubeVideos[index] ? (
                /* YouTube embed */
                <div 
                  className="w-64 md:w-80 aspect-video rounded-2xl overflow-hidden transition-all duration-500"
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
                  className="w-64 md:w-80 aspect-video rounded-2xl border-2 border-dashed transition-all duration-500 flex items-center justify-center"
                  style={{
                    borderColor: isActive ? 'rgba(255,255,255,0.4)' : 'rgba(115,115,115,0.5)',
                    backgroundColor: isActive ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                    opacity: isActive ? 1 : 0.5,
                  }}
                >
                  <span 
                    className="text-sm transition-colors duration-300"
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
