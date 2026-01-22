const VideoCollage = () => {
  const videos = [
    '/videos/video1.mp4',
    '/videos/video2.mp4',
    '/videos/video3.mp4',
    '/videos/video4.mp4',
    '/videos/video5.mp4',
  ];

  // Duplicate videos for seamless infinite scroll
  const allVideos = [...videos, ...videos];

  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {/* Scrolling container */}
      <div 
        className="flex gap-4 p-4 animate-scroll-left"
        style={{
          width: 'max-content',
        }}
      >
        {allVideos.map((video, index) => (
          <div
            key={index}
            className="relative flex-shrink-0 w-[150px] h-[267px] md:w-[200px] md:h-[356px] rounded-3xl overflow-hidden"
            style={{
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
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
        ))}
      </div>

      {/* Second row scrolling opposite direction */}
      <div 
        className="flex gap-4 p-4 mt-4 animate-scroll-right"
        style={{
          width: 'max-content',
        }}
      >
        {[...allVideos].reverse().map((video, index) => (
          <div
            key={index}
            className="relative flex-shrink-0 w-[130px] h-[231px] md:w-[180px] md:h-[320px] rounded-3xl overflow-hidden"
            style={{
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
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
          animation: scroll-left 40s linear infinite;
        }
        .animate-scroll-right {
          animation: scroll-right 45s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default VideoCollage;
