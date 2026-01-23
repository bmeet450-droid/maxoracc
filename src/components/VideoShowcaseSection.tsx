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
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const handleVideoEnd = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % wideVideos.length);
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
    // Start text animation earlier and complete by 60% scroll
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
      {/* Video Container */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          transform: `translateY(${parallaxY}px) scale(${scale})`,
          transition: "transform 0.1s ease-out",
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
          style={{
            filter: "brightness(0.7) contrast(1.1)",
          }}
        />
      </div>

      {/* Gradient Overlays */}
      <div
        className="absolute inset-0 pointer-events-none"
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
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 50%, transparent 40%, rgba(0,0,0,0.6) 100%)`,
        }}
      />

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
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
            className="text-[10px] md:text-xs tracking-[0.3em] uppercase"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            Featured Reel
          </span>
        </div>

        {/* Center Content - Typography inspired by reference */}
        <div className="text-center px-6 flex flex-col items-center">
          {/* Line 1: "the World" style */}
          <div className="mb-2 md:mb-4">
            <AnimatedText
              text="the"
              progress={textRevealProgress}
              startAt={0}
              endAt={0.3}
              className="text-3xl md:text-5xl lg:text-7xl italic font-light mr-3 md:mr-4"
              style={{ 
                color: "#fff",
                fontFamily: "Georgia, 'Times New Roman', serif",
              }}
            />
            <AnimatedText
              text="World"
              progress={textRevealProgress}
              startAt={0.1}
              endAt={0.4}
              className="text-3xl md:text-5xl lg:text-7xl font-normal tracking-tight"
              style={{ 
                color: "#fff",
                fontFamily: "Georgia, 'Times New Roman', serif",
              }}
            />
          </div>

          {/* Line 2: "of the" style - offset to right */}
          <div className="mb-2 md:mb-4 ml-8 md:ml-16 lg:ml-24">
            <AnimatedText
              text="of the"
              progress={textRevealProgress}
              startAt={0.2}
              endAt={0.5}
              className="text-3xl md:text-5xl lg:text-7xl italic font-light"
              style={{ 
                color: "#fff",
                fontFamily: "Georgia, 'Times New Roman', serif",
              }}
            />
            <AnimatedText
              text=" Frame"
              progress={textRevealProgress}
              startAt={0.3}
              endAt={0.6}
              className="text-3xl md:text-5xl lg:text-7xl font-medium tracking-wide uppercase"
              style={{ 
                color: "#fff",
                fontFamily: "Georgia, 'Times New Roman', serif",
                letterSpacing: "0.1em",
              }}
            />
          </div>

          {/* Decorative Line */}
          <div
            className="w-24 h-px mx-auto my-6 md:my-8"
            style={{
              background: "rgba(255,255,255,0.3)",
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
              className="text-sm md:text-base max-w-md mx-auto text-center"
              style={{
                color: "rgba(255,255,255,0.7)",
              }}
            >
              Capturing movement and emotion through cinematic storytelling
            </p>
          </div>
        </div>

        {/* Bottom Stats/Details */}
        <div
          className="absolute bottom-12 md:bottom-20 left-0 right-0 px-8"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: `translateY(${isVisible ? 0 : 20}px)`,
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s",
          }}
        >
          <div className="flex justify-between items-end max-w-6xl mx-auto">
            <div className="hidden md:block">
              <span
                className="text-[10px] tracking-[0.2em] uppercase block mb-1"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                Format
              </span>
              <span
                className="text-sm"
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                4K Cinematic
              </span>
            </div>

            {/* Play Indicator - Centered */}
            <div className="flex flex-col items-center gap-3 mx-auto md:mx-0">
              <div
                className="w-12 h-12 md:w-16 md:h-16 rounded-full border flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300"
                style={{ borderColor: "rgba(255,255,255,0.3)" }}
              >
                <div
                  className="w-0 h-0 ml-1"
                  style={{
                    borderLeft: "10px solid rgba(255,255,255,0.9)",
                    borderTop: "6px solid transparent",
                    borderBottom: "6px solid transparent",
                  }}
                />
              </div>
              <span
                className="text-xs tracking-[0.15em] uppercase"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                Watch Reel
              </span>
            </div>

            <div className="hidden md:block text-right">
              <span
                className="text-[10px] tracking-[0.2em] uppercase block mb-1"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                Clip
              </span>
              <span
                className="text-sm"
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                {currentVideoIndex + 1} / {wideVideos.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Corner Accents */}
      <div
        className="absolute top-8 left-8 w-16 h-16 pointer-events-none hidden md:block"
        style={{
          borderLeft: "1px solid rgba(255,255,255,0.2)",
          borderTop: "1px solid rgba(255,255,255,0.2)",
          opacity: isVisible ? 1 : 0,
          transition: "opacity 1s ease 0.3s",
        }}
      />
      <div
        className="absolute top-8 right-8 w-16 h-16 pointer-events-none hidden md:block"
        style={{
          borderRight: "1px solid rgba(255,255,255,0.2)",
          borderTop: "1px solid rgba(255,255,255,0.2)",
          opacity: isVisible ? 1 : 0,
          transition: "opacity 1s ease 0.3s",
        }}
      />
      <div
        className="absolute bottom-8 left-8 w-16 h-16 pointer-events-none hidden md:block"
        style={{
          borderLeft: "1px solid rgba(255,255,255,0.2)",
          borderBottom: "1px solid rgba(255,255,255,0.2)",
          opacity: isVisible ? 1 : 0,
          transition: "opacity 1s ease 0.3s",
        }}
      />
      <div
        className="absolute bottom-8 right-8 w-16 h-16 pointer-events-none hidden md:block"
        style={{
          borderRight: "1px solid rgba(255,255,255,0.2)",
          borderBottom: "1px solid rgba(255,255,255,0.2)",
          opacity: isVisible ? 1 : 0,
          transition: "opacity 1s ease 0.3s",
        }}
      />
    </section>
  );
};

export default VideoShowcaseSection;
