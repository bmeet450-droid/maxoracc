import { useEffect, useRef, useState, useMemo } from "react";

const wideVideos = [
  "/videos/wide2.mp4",
  "/videos/wide3.mp4",
  "/videos/wide4.mp4",
  "/videos/wide5.mp4",
  "/videos/wide6.mp4",
  "/videos/wide10.mp4",
  "/videos/wide11.mp4",
  "/videos/wide12.mp4",
  "/videos/wide13.mp4",
];

interface AnimatedTextProps {
  text: string;
  progress: number;
  startAt: number;
  endAt: number;
  className?: string;
  style?: React.CSSProperties;
}

const AnimatedText = ({ text, progress, startAt, endAt, className = "", style = {} }: AnimatedTextProps) => {
  const letters = text.split("");
  const range = endAt - startAt;
  
  return (
    <span className={className} style={style}>
      {letters.map((letter, index) => {
        const letterStart = startAt + (index / letters.length) * range;
        const letterEnd = letterStart + (range / letters.length) * 2;
        const letterProgress = Math.max(0, Math.min(1, (progress - letterStart) / (letterEnd - letterStart)));
        
        return (
          <span
            key={index}
            style={{
              display: "inline-block",
              opacity: letterProgress,
              transform: `translateY(${(1 - letterProgress) * 30}px)`,
              transition: "none",
              whiteSpace: letter === " " ? "pre" : "normal",
            }}
          >
            {letter === " " ? "\u00A0" : letter}
          </span>
        );
      })}
    </span>
  );
};

const VideoShowcaseSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const prevVideoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [prevVideoIndex, setPrevVideoIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  const switchVideo = (newIndex: number) => {
    if (newIndex === currentVideoIndex || isTransitioning) return;
    
    setPrevVideoIndex(currentVideoIndex);
    setIsTransitioning(true);
    setCurrentVideoIndex(newIndex);
    setVideoProgress(0);
    
    setTimeout(() => {
      setIsTransitioning(false);
      setPrevVideoIndex(null);
    }, 800);
  };

  const handleVideoEnd = () => {
    const nextIndex = (currentVideoIndex + 1) % wideVideos.length;
    switchVideo(nextIndex);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = videoRef.current.currentTime / videoRef.current.duration;
      setVideoProgress(isNaN(progress) ? 0 : progress);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play();
    }
  }, [currentVideoIndex]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting && videoRef.current) {
          videoRef.current.play();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight + rect.height)));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const textRevealProgress = useMemo(() => {
    return Math.max(0, Math.min(1, scrollProgress * 2.5));
  }, [scrollProgress]);

  const parallaxY = scrollProgress * 50 - 25;
  const scale = 1 + scrollProgress * 0.1;

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ background: "#000" }}
    >
      {/* Previous Video (for crossfade) */}
      {prevVideoIndex !== null && (
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            transform: `translateY(${parallaxY}px) scale(${scale})`,
            opacity: isTransitioning ? 0 : 1,
            transition: "opacity 0.8s ease-in-out",
            zIndex: 1,
          }}
        >
          <video
            ref={prevVideoRef}
            src={wideVideos[prevVideoIndex]}
            className="w-full h-full object-cover"
            muted
            playsInline
            style={{
              filter: "brightness(0.7) contrast(1.1)",
            }}
          />
        </div>
      )}

      {/* Current Video Container */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          transform: `translateY(${parallaxY}px) scale(${scale})`,
          opacity: isTransitioning ? 1 : 1,
          transition: "opacity 0.8s ease-in-out",
          zIndex: 2,
        }}
      >
        <video
          ref={videoRef}
          key={currentVideoIndex}
          src={wideVideos[currentVideoIndex]}
          className="w-full h-full object-cover"
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnd}
          onTimeUpdate={handleTimeUpdate}
          style={{
            filter: "brightness(0.7) contrast(1.1)",
            opacity: isTransitioning ? 1 : 1,
          }}
        />
      </div>

      {/* Gradient Overlays */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `linear-gradient(to bottom, 
            rgba(0,0,0,0.8) 0%, 
            rgba(0,0,0,0.2) 30%, 
            rgba(0,0,0,0.2) 70%, 
            rgba(0,0,0,0.9) 100%
          )`,
        }}
      />

      {/* Side Vignettes */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 50%, transparent 40%, rgba(0,0,0,0.6) 100%)`,
        }}
      />

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        {/* Top Label */}
        <div
          className="absolute top-12 md:top-20 left-1/2 -translate-x-1/2 text-center"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: `translateY(${isVisible ? 0 : 20}px)`,
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <span
            className="text-[10px] md:text-xs tracking-[0.3em] uppercase font-extralight"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            Featured Reel
          </span>
        </div>

        {/* Center Content - Thin premium typography */}
        <div className="text-center px-6 flex flex-col items-center">
          {/* Line 1: "the World" style - extra thin */}
          <div className="mb-2 md:mb-4">
            <AnimatedText
              text="the"
              progress={textRevealProgress}
              startAt={0}
              endAt={0.3}
              className="text-3xl md:text-5xl lg:text-7xl italic mr-3 md:mr-4"
              style={{ 
                color: "#fff",
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontWeight: 200,
              }}
            />
            <AnimatedText
              text="World"
              progress={textRevealProgress}
              startAt={0.1}
              endAt={0.4}
              className="text-3xl md:text-5xl lg:text-7xl tracking-tight"
              style={{ 
                color: "#fff",
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontWeight: 300,
              }}
            />
          </div>

          {/* Line 2: "of the" style - offset to right, thin */}
          <div className="mb-2 md:mb-4 ml-8 md:ml-16 lg:ml-24">
            <AnimatedText
              text="of the"
              progress={textRevealProgress}
              startAt={0.2}
              endAt={0.5}
              className="text-3xl md:text-5xl lg:text-7xl italic"
              style={{ 
                color: "#fff",
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontWeight: 200,
              }}
            />
            <AnimatedText
              text=" Frame"
              progress={textRevealProgress}
              startAt={0.3}
              endAt={0.6}
              className="text-3xl md:text-5xl lg:text-7xl tracking-wide uppercase"
              style={{ 
                color: "#fff",
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontWeight: 300,
                letterSpacing: "0.15em",
              }}
            />
          </div>

          {/* Decorative Line */}
          <div
            className="w-24 h-px mx-auto my-6 md:my-8"
            style={{
              background: "rgba(255,255,255,0.25)",
              transform: `scaleX(${textRevealProgress > 0.5 ? 1 : 0})`,
              transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />

          {/* Subtitle */}
          <div
            style={{
              opacity: textRevealProgress > 0.6 ? 1 : 0,
              transform: `translateY(${textRevealProgress > 0.6 ? 0 : 20}px)`,
              transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <p
              className="text-sm md:text-base max-w-md mx-auto text-center font-extralight tracking-wide"
              style={{
                color: "rgba(255,255,255,0.6)",
              }}
            >
              Capturing movement and emotion through cinematic storytelling
            </p>
          </div>
        </div>

        {/* Video Progress Bar */}
        <div
          className="absolute bottom-32 md:bottom-36 left-1/2 -translate-x-1/2 w-48 md:w-64"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        >
          <div
            className="h-[1px] w-full rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${videoProgress * 100}%`,
                background: "rgba(255,255,255,0.6)",
                transition: "width 0.1s linear",
              }}
            />
          </div>
        </div>

        {/* Navigation Dots */}
        <div
          className="absolute bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: "opacity 0.5s ease 0.2s",
          }}
        >
          {wideVideos.map((_, index) => (
            <button
              key={index}
              onClick={() => switchVideo(index)}
              className="group relative p-1"
              aria-label={`Go to video ${index + 1}`}
            >
              <div
                className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300"
                style={{
                  background: currentVideoIndex === index 
                    ? "rgba(255,255,255,0.9)" 
                    : "rgba(255,255,255,0.25)",
                  transform: currentVideoIndex === index ? "scale(1.2)" : "scale(1)",
                  boxShadow: currentVideoIndex === index 
                    ? "0 0 10px rgba(255,255,255,0.4)" 
                    : "none",
                }}
              />
              <div
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  transform: "scale(2)",
                }}
              />
            </button>
          ))}
        </div>

        {/* Bottom Stats/Details */}
        <div
          className="absolute bottom-8 md:bottom-12 left-0 right-0 px-8"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: `translateY(${isVisible ? 0 : 20}px)`,
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s",
          }}
        >
          <div className="flex justify-between items-end max-w-6xl mx-auto">
            <div className="hidden md:block">
              <span
                className="text-[10px] tracking-[0.2em] uppercase block mb-1 font-extralight"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                Format
              </span>
              <span
                className="text-sm font-light"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                4K Cinematic
              </span>
            </div>

            {/* Play Indicator - Centered */}
            <div className="flex flex-col items-center gap-3 mx-auto md:mx-0">
              <div
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300"
                style={{ borderColor: "rgba(255,255,255,0.25)" }}
              >
                <div
                  className="w-0 h-0 ml-0.5"
                  style={{
                    borderLeft: "8px solid rgba(255,255,255,0.8)",
                    borderTop: "5px solid transparent",
                    borderBottom: "5px solid transparent",
                  }}
                />
              </div>
              <span
                className="text-[10px] tracking-[0.2em] uppercase font-extralight"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Watch Reel
              </span>
            </div>

            <div className="hidden md:block text-right">
              <span
                className="text-[10px] tracking-[0.2em] uppercase block mb-1 font-extralight"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                Clip
              </span>
              <span
                className="text-sm font-light"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                {currentVideoIndex + 1} / {wideVideos.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Corner Accents */}
      <div
        className="absolute top-8 left-8 w-12 h-12 pointer-events-none hidden md:block z-20"
        style={{
          borderLeft: "1px solid rgba(255,255,255,0.15)",
          borderTop: "1px solid rgba(255,255,255,0.15)",
          opacity: isVisible ? 1 : 0,
          transition: "opacity 1s ease 0.3s",
        }}
      />
      <div
        className="absolute top-8 right-8 w-12 h-12 pointer-events-none hidden md:block z-20"
        style={{
          borderRight: "1px solid rgba(255,255,255,0.15)",
          borderTop: "1px solid rgba(255,255,255,0.15)",
          opacity: isVisible ? 1 : 0,
          transition: "opacity 1s ease 0.3s",
        }}
      />
      <div
        className="absolute bottom-8 left-8 w-12 h-12 pointer-events-none hidden md:block z-20"
        style={{
          borderLeft: "1px solid rgba(255,255,255,0.15)",
          borderBottom: "1px solid rgba(255,255,255,0.15)",
          opacity: isVisible ? 1 : 0,
          transition: "opacity 1s ease 0.3s",
        }}
      />
      <div
        className="absolute bottom-8 right-8 w-12 h-12 pointer-events-none hidden md:block z-20"
        style={{
          borderRight: "1px solid rgba(255,255,255,0.15)",
          borderBottom: "1px solid rgba(255,255,255,0.15)",
          opacity: isVisible ? 1 : 0,
          transition: "opacity 1s ease 0.3s",
        }}
      />
    </section>
  );
};

export default VideoShowcaseSection;
