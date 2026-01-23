import { useEffect, useRef, useState } from "react";

const VideoShowcaseSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

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
          src="/videos/wide2.mp4"
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
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
          className="absolute top-12 md:top-20 left-1/2 -translate-x-1/2"
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

        {/* Center Content */}
        <div className="text-center px-6">
          <h2
            className="text-4xl md:text-6xl lg:text-8xl font-light tracking-tight mb-6"
            style={{
              color: "#fff",
              opacity: isVisible ? 1 : 0,
              transform: `translateY(${isVisible ? 0 : 40}px)`,
              transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
            }}
          >
            Motion
            <span
              className="block italic font-serif"
              style={{ fontWeight: 300 }}
            >
              in Frame
            </span>
          </h2>

          {/* Decorative Line */}
          <div
            className="w-24 h-px mx-auto mb-6"
            style={{
              background: "rgba(255,255,255,0.3)",
              transform: `scaleX(${isVisible ? 1 : 0})`,
              transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
            }}
          />

          <p
            className="text-sm md:text-base max-w-md mx-auto"
            style={{
              color: "rgba(255,255,255,0.7)",
              opacity: isVisible ? 1 : 0,
              transform: `translateY(${isVisible ? 0 : 20}px)`,
              transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s",
            }}
          >
            Capturing movement and emotion through cinematic storytelling
          </p>
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

            {/* Play Indicator */}
            <div className="flex items-center gap-3 mx-auto md:mx-0">
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
                className="text-xs tracking-[0.15em] uppercase hidden md:block"
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
                Duration
              </span>
              <span
                className="text-sm"
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                02:45
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
