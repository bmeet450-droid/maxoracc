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
  ];

  // Duplicate for seamless infinite scroll
  const allPortrait = [...portraitVideos, ...portraitVideos];
  const allWide = [...wideVideos, ...wideVideos];

  return (
    <div className="absolute inset-0 overflow-hidden z-0 flex flex-col justify-start pt-4 gap-3">
      {/* Row 1: 9:16 Portrait - scroll left */}
      <div 
        className="flex gap-3 animate-scroll-left"
        style={{ width: 'max-content' }}
      >
        {allPortrait.map((video, index) => (
          <div
            key={index}
            className="relative flex-shrink-0 w-[120px] h-[213px] md:w-[160px] md:h-[284px] rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
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
        ))}
      </div>

      {/* Row 2: 2.33:1 Wide - scroll right */}
      <div 
        className="flex gap-3 animate-scroll-right"
        style={{ width: 'max-content' }}
      >
        {allWide.map((video, index) => (
          <div
            key={index}
            className="relative flex-shrink-0 w-[280px] h-[120px] md:w-[350px] md:h-[150px] rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
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
        ))}
      </div>

      {/* Row 3: 9:16 Portrait - scroll left (reversed order) */}
      <div 
        className="flex gap-3 animate-scroll-left-slow"
        style={{ width: 'max-content' }}
      >
        {[...allPortrait].reverse().map((video, index) => (
          <div
            key={index}
            className="relative flex-shrink-0 w-[110px] h-[196px] md:w-[150px] md:h-[267px] rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
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
        ))}
      </div>

      {/* Row 4: 2.33:1 Wide - scroll right (reversed order) */}
      <div 
        className="flex gap-3 animate-scroll-right-slow"
        style={{ width: 'max-content' }}
      >
        {[...allWide].reverse().map((video, index) => (
          <div
            key={index}
            className="relative flex-shrink-0 w-[260px] h-[112px] md:w-[330px] md:h-[142px] rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
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
        ))}
      </div>

      {/* Overlay gradient for text readability */}
      <div className="absolute inset-0 bg-[#0a0a0a]/70" />

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
      `}</style>
    </div>
  );
};

export default VideoCollage;
