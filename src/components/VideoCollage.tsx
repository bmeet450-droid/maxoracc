import { useState } from "react";

interface VideoCardProps {
  video: string;
  className: string;
}

const VideoCard = ({ video, className }: VideoCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
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
      <video
        src={video}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      />
    </div>
  );
};

const VideoCollage = () => {
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

  // Duplicate for seamless infinite scroll
  const allPortrait = [...portraitVideos, ...portraitVideos];
  const allWide = [...wideVideos, ...wideVideos];

  return (
    <div className="absolute inset-0 overflow-hidden z-0 flex flex-col justify-start pt-2 md:pt-4 gap-2 md:gap-3">
      {/* Row 1: 9:16 Portrait - scroll left */}
      <div 
        className="flex gap-2 md:gap-3 animate-scroll-left"
        style={{ width: 'max-content' }}
      >
        {allPortrait.map((video, index) => (
          <VideoCard
            key={index}
            video={video}
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
          <VideoCard
            key={index}
            video={video}
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
          <VideoCard
            key={index}
            video={video}
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
          <VideoCard
            key={index}
            video={video}
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
          <VideoCard
            key={index}
            video={video}
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
