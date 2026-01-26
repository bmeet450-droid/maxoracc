import { useEffect, useRef, useState, memo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface OptimizedVideoCardProps {
  video: string;
  className: string;
  staggerDelay: number;
  isHeroSection?: boolean;
}

const OptimizedVideoCard = memo(({ video, className, staggerDelay, isHeroSection = false }: OptimizedVideoCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Intersection Observer - 50% visibility threshold
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Play/pause based on visibility - with staggered delay
  useEffect(() => {
    const video = videoRef.current;
    if (!video || isMobile) return;

    // On mobile: never autoplay, always show poster
    if (isMobile) {
      video.pause();
      setIsPlaying(false);
      return;
    }

    if (isVisible && !isPlaying) {
      const timer = setTimeout(() => {
        video.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // Autoplay blocked - graceful fallback
          setIsPlaying(false);
        });
      }, staggerDelay);
      return () => clearTimeout(timer);
    } else if (!isVisible && isPlaying) {
      video.pause();
      setIsPlaying(false);
    }
  }, [isVisible, isMobile, staggerDelay, isPlaying]);

  // Generate a dark poster placeholder
  const posterUrl = `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
      <rect width="100" height="100" fill="#0a0a0a"/>
    </svg>
  `)}`;

  return (
    <div
      ref={containerRef}
      className={`${className} transition-all duration-300`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        boxShadow: isHovered 
          ? '0 0 40px rgba(255,255,255,0.3), 0 0 80px rgba(255,255,255,0.15), 0 20px 60px rgba(0,0,0,0.5)' 
          : '0 20px 60px rgba(0,0,0,0.5)',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        zIndex: isHovered ? 10 : 1,
      }}
    >
      {isMobile ? (
        // Mobile: Show poster image only, no video
        <div 
          className="w-full h-full"
          style={{ 
            background: '#0a0a0a',
          }}
        />
      ) : (
        <video
          ref={videoRef}
          src={video}
          loop
          muted
          playsInline
          preload="none"
          poster={posterUrl}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
});

OptimizedVideoCard.displayName = "OptimizedVideoCard";

const VideoCollage = () => {
  const isMobile = useIsMobile();

  // On mobile: show a lightweight static gradient background instead of videos
  if (isMobile) {
    return (
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(ellipse at center top, rgba(30,30,35,1) 0%, rgba(15,15,18,1) 40%, rgba(10,10,10,1) 100%)',
        }}
      />
    );
  }

  const portraitVideos = [
    '/videos/video1.mp4',
    '/videos/video2.mp4',
    '/videos/video3.mp4',
    '/videos/video4.mp4',
    '/videos/video5.mp4',
  ];

  const wideVideos = [
    '/videos/wide1.mov',
    '/videos/wide2.mp4',
    '/videos/wide3.mp4',
    '/videos/wide4.mp4',
    '/videos/wide5.mp4',
    '/videos/wide6.mp4',
    '/videos/wide7.mov',
    '/videos/wide8.mov',
    '/videos/wide9.mov',
    '/videos/wide10.mp4',
    '/videos/wide11.mp4',
    '/videos/wide12.mp4',
    '/videos/wide13.mp4',
  ];

  // Reduce video count for better performance
  // Only show first 3 portrait and 5 wide videos, duplicated once
  const limitedPortrait = portraitVideos.slice(0, 3);
  const limitedWide = wideVideos.slice(0, 5);
  const allPortrait = [...limitedPortrait, ...limitedPortrait];
  const allWide = [...limitedWide, ...limitedWide];

  // Calculate stagger delays
  const getStaggerDelay = (rowIndex: number, videoIndex: number) => {
    return (rowIndex * 100) + (videoIndex * 50);
  };

  return (
    <div className="absolute inset-0 overflow-hidden z-0 flex flex-col justify-start pt-2 md:pt-4 gap-2 md:gap-3">
      {/* Row 1: 9:16 Portrait - scroll left */}
      <div 
        className="flex gap-2 md:gap-3 animate-scroll-left"
        style={{ width: 'max-content' }}
      >
        {allPortrait.map((video, index) => (
          <OptimizedVideoCard
            key={`row1-${index}`}
            video={video}
            staggerDelay={getStaggerDelay(0, index)}
            className="relative flex-shrink-0 w-[80px] h-[142px] md:w-[160px] md:h-[284px] rounded-xl md:rounded-2xl overflow-hidden"
          />
        ))}
      </div>

      {/* Row 2: 2.33:1 Wide - scroll left */}
      <div 
        className="flex gap-2 md:gap-3 animate-scroll-left-wide"
        style={{ width: 'max-content' }}
      >
        {allWide.map((video, index) => (
          <OptimizedVideoCard
            key={`row2-${index}`}
            video={video}
            staggerDelay={getStaggerDelay(1, index)}
            className="relative flex-shrink-0 w-[180px] h-[77px] md:w-[350px] md:h-[150px] rounded-xl md:rounded-2xl overflow-hidden"
          />
        ))}
      </div>

      {/* Row 3: 9:16 Portrait - scroll left (reversed order) */}
      <div 
        className="flex gap-2 md:gap-3 animate-scroll-left-slow"
        style={{ width: 'max-content' }}
      >
        {[...allPortrait].reverse().map((video, index) => (
          <OptimizedVideoCard
            key={`row3-${index}`}
            video={video}
            staggerDelay={getStaggerDelay(2, index)}
            className="relative flex-shrink-0 w-[70px] h-[124px] md:w-[150px] md:h-[267px] rounded-xl md:rounded-2xl overflow-hidden"
          />
        ))}
      </div>

      {/* Row 4: 2.33:1 Wide - scroll right */}
      <div 
        className="flex gap-2 md:gap-3 animate-scroll-right-wide"
        style={{ width: 'max-content' }}
      >
        {[...allWide].reverse().map((video, index) => (
          <OptimizedVideoCard
            key={`row4-${index}`}
            video={video}
            staggerDelay={getStaggerDelay(3, index)}
            className="relative flex-shrink-0 w-[160px] h-[69px] md:w-[330px] md:h-[142px] rounded-xl md:rounded-2xl overflow-hidden"
          />
        ))}
      </div>

      {/* Row 5: 9:16 Portrait - scroll left */}
      <div 
        className="flex gap-2 md:gap-3 animate-scroll-left"
        style={{ width: 'max-content' }}
      >
        {allPortrait.map((video, index) => (
          <OptimizedVideoCard
            key={`row5-${index}`}
            video={video}
            staggerDelay={getStaggerDelay(4, index)}
            className="relative flex-shrink-0 w-[65px] h-[116px] md:w-[140px] md:h-[249px] rounded-xl md:rounded-2xl overflow-hidden"
          />
        ))}
      </div>

      {/* Vertical fade overlay - darker at bottom */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.5) 20%, rgba(10,10,10,0.7) 40%, rgba(10,10,10,0.85) 60%, rgba(10,10,10,0.95) 80%, rgba(10,10,10,1) 100%)'
        }}
      />

      {/* Vignette effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,10,10,0.4) 70%, rgba(10,10,10,0.8) 100%)'
        }}
      />

      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-left {
          animation: scroll-left 35s linear infinite;
        }
        .animate-scroll-right {
          animation: scroll-right 40s linear infinite;
        }
        .animate-scroll-left-slow {
          animation: scroll-left 45s linear infinite;
        }
        .animate-scroll-right-slow {
          animation: scroll-right 50s linear infinite;
        }
        .animate-scroll-left-wide {
          animation: scroll-left 80s linear infinite;
        }
        .animate-scroll-right-wide {
          animation: scroll-right 90s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default VideoCollage;
