import { useEffect, useRef, useState } from "react";
import { MagneticText } from "./ui/morphing-cursor";

interface TimelinePoint {
  id: number;
  offset: number;
  offsetMobile?: number;
  side: "left" | "right";
  lineLength: number;
  lineLengthMobile: number;
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

const magneticTexts = [
  { text: "An Existential hike in Cold Spring NY", hoverText: "Almost fell off a cliff making this" },
  { text: "Historic Spectacle", hoverText: "Got CapCut premium for this" },
  { text: "Ending of a Great Movie", hoverText: "Historic Spectacle Part 2" },
  { text: "The Art in Harlem", hoverText: "Met the Artist There" },
  { text: "A Deal with Mind", hoverText: "The Sun Stole the Show" },
  { text: "How Did the Chinese Get here", hoverText: "Asian Invasion" },
];

const timelinePoints: TimelinePoint[] = [
  { id: 1, offset: 10, side: "left", lineLength: 60, lineLengthMobile: 12, offsetMobile: 6 },
  { id: 2, offset: 24, side: "right", lineLength: 80, lineLengthMobile: 12, offsetMobile: 20 },
  { id: 3, offset: 38, side: "left", lineLength: 70, lineLengthMobile: 12, offsetMobile: 34 },
  { id: 4, offset: 52, side: "right", lineLength: 65, lineLengthMobile: 12, offsetMobile: 48 },
  { id: 5, offset: 66, side: "left", lineLength: 75, lineLengthMobile: 12, offsetMobile: 62 },
  { id: 6, offset: 80, side: "right", lineLength: 60, lineLengthMobile: 12, offsetMobile: 76 },
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
      className="relative w-full min-h-[280vh] md:min-h-[200vh] lg:min-h-[250vh]"
      style={{ background: '#000000' }}
    >
      {/* Central vertical line */}
      <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px]">
        <div className="absolute inset-0 bg-neutral-700" />
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
        const effectiveSide = isMobile ? 'right' : point.side;
        const oppositeSide = effectiveSide === 'left' ? 'right' : 'left';

        return (
          <div
            key={point.id}
            className="absolute left-6 md:left-1/2 md:-translate-x-1/2 flex items-center"
            style={{ top: `${isMobile && point.offsetMobile !== undefined ? point.offsetMobile : point.offset}%` }}
          >
            {/* Perpendicular line and circle */}
            <div 
              className={`flex items-center ${effectiveSide === 'left' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div 
                className="w-3 h-3 md:w-4 md:h-4 rounded-full border-2 transition-all duration-300"
                style={{
                  borderColor: isActive ? 'rgba(255,255,255,0.9)' : 'rgba(115,115,115,1)',
                  backgroundColor: isActive ? 'rgba(255,255,255,0.3)' : 'transparent',
                  boxShadow: isActive ? '0 0 15px rgba(255,255,255,0.6)' : 'none',
                }}
              />
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
              <div 
                className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: isActive ? 'rgba(255,255,255,0.8)' : 'rgba(115,115,115,1)',
                  boxShadow: isActive ? '0 0 10px rgba(255,255,255,0.5)' : 'none',
                }}
              />
            </div>

            {/* Video content */}
            <div 
              className={`absolute ${effectiveSide === 'left' ? 'right-full' : 'left-full'}`}
              style={{ 
                top: '50%',
                transform: 'translateY(-50%)',
                [effectiveSide === 'right' ? 'marginLeft' : 'marginRight']: `${lineLength + (isMobile ? 8 : 12)}px`,
              }}
            >
              {youtubeVideos[index] ? (
                <div className="flex flex-col gap-3">
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
                  {/* Mobile: show magnetic text below video */}
                  {isMobile && magneticTexts[index] && (
                    <MagneticText
                      text={magneticTexts[index].text}
                      hoverText={magneticTexts[index].hoverText}
                      className="h-16 w-[calc(100vw-120px)]"
                      circleSize={240}
                      circleSizeMobile={160}
                      wrapInnerText
                    />
                  )}
                </div>
              ) : (
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

            {/* Desktop/Tablet: Magnetic text on opposite side */}
            {!isMobile && magneticTexts[index] && (
              <div 
                className={`absolute ${oppositeSide === 'left' ? 'right-full' : 'left-full'}`}
                style={{ 
                  top: '50%',
                  transform: 'translateY(-50%)',
                  [oppositeSide === 'right' ? 'marginLeft' : 'marginRight']: `${(oppositeSide === 'left' ? timelinePoints[0].lineLength : point.lineLength) + 12}px`,
                }}
              >
                <MagneticText
                  text={magneticTexts[index].text}
                  hoverText={magneticTexts[index].hoverText}
                  className="h-24 md:h-32 w-44 md:w-56 lg:w-80"
                  circleSize={240}
                  circleSizeTablet={180}
                  wrapInnerText
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ScrollTimeline;
