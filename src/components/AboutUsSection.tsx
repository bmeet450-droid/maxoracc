import { useMemo, useState, useEffect } from "react";
import useScrollProgress from "@/hooks/useScrollProgress";
import FilmGrain from "./FilmGrain";

// Import all slide images
import aboutSlide1 from "@/assets/about-slide-1.jpg";
import aboutSlide2 from "@/assets/about-slide-2.jpg";
import aboutSlide3 from "@/assets/about-slide-3.jpg";
import aboutPhoto from "@/assets/about-photo.jpg";

// Define slides with text, position, and image
const slides = [
  {
    id: 1,
    text: "I'm Meet Bhatt, although some may know me as Max. I'm 20, and I spend my days chasing something elusive: the moment when an image, a frame, or a piece of motion becomes more than just content.",
    position: "left" as const,
    image: aboutPhoto,
    subtitle: "About",
  },
  {
    id: 2,
    text: "Every frame tells a story. Every shadow holds a secret. I find beauty in the spaces between moments, where light meets darkness and stillness meets motion.",
    position: "right" as const,
    image: aboutSlide1,
    subtitle: "Vision",
  },
  {
    id: 3,
    text: "Architecture speaks in whispers. In the curves of a dome, the fall of light through ancient windows, I discover conversations that have lasted centuries.",
    position: "left" as const,
    image: aboutSlide2,
    subtitle: "Perspective",
  },
  {
    id: 4,
    text: "The city breathes. Between the chaos and the calm, I capture fleeting moments of humanity—stories written in footsteps, shadows, and golden light.",
    position: "right" as const,
    image: aboutSlide3,
    subtitle: "Journey",
  },
];

const AboutUsSection = () => {
  const { ref: sectionRef, progress } = useScrollProgress({ start: 0.05, end: 0.95 });

  // Track if we're on mobile
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate which slide we're on and the progress within that slide
  const totalSlides = slides.length;
  const slideProgress = progress * totalSlides;
  const currentSlideIndex = Math.min(Math.floor(slideProgress), totalSlides - 1);
  const withinSlideProgress = slideProgress - currentSlideIndex;

  // Get current and next slide
  const currentSlide = slides[currentSlideIndex];
  const nextSlide = slides[Math.min(currentSlideIndex + 1, totalSlides - 1)];

  // Calculate text animation phases (0-0.4: fade in, 0.4-0.6: visible, 0.6-1: fade out)
  const getTextOpacity = (slideProgress: number) => {
    if (slideProgress < 0.15) {
      return slideProgress / 0.15; // Fade in
    } else if (slideProgress < 0.7) {
      return 1; // Fully visible
    } else {
      return 1 - (slideProgress - 0.7) / 0.3; // Fade out
    }
  };

  const textOpacity = getTextOpacity(withinSlideProgress);
  
  // Calculate visible words for typing effect
  const getVisibleWordCount = (words: string[], slideProgress: number) => {
    if (slideProgress < 0.15) {
      // Typing in
      return Math.floor((slideProgress / 0.15) * words.length * 1.1);
    } else if (slideProgress < 0.7) {
      // All visible
      return words.length;
    } else {
      // Typing out (reverse)
      const fadeOutProgress = (slideProgress - 0.7) / 0.3;
      return Math.max(0, Math.floor((1 - fadeOutProgress) * words.length));
    }
  };

  // Split current text into words
  const words = useMemo(() => currentSlide.text.split(' '), [currentSlide.text]);
  const visibleWordCount = getVisibleWordCount(words, withinSlideProgress);

  // Image crossfade
  const imageFadeProgress = withinSlideProgress > 0.75 ? (withinSlideProgress - 0.75) / 0.25 : 0;

  // Photo scale animation - starts at 1.05, scales down to 1 during slide, then incoming image starts at 1.08
  const currentPhotoScale = 1.05 - withinSlideProgress * 0.05; // 1.05 -> 1.0
  const nextPhotoScale = 1.08 - imageFadeProgress * 0.03; // 1.08 -> 1.05 (ready for next slide)

  // Text position classes
  const isLeftAligned = currentSlide.position === "left";

  return (
    <section
      id="about-us"
      ref={sectionRef}
      className="relative"
      style={{ 
        background: '#000000',
        height: `${totalSlides * 150}vh`,
      }}
    >
      {/* Top fade gradient */}
      <div 
        className="absolute top-0 left-0 right-0 h-48 pointer-events-none z-20"
        style={{
          background: 'linear-gradient(to bottom, #000000 0%, transparent 100%)',
        }}
      />
      
      {/* Bottom fade gradient */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none z-20"
        style={{
          background: 'linear-gradient(to top, #000000 0%, transparent 100%)',
        }}
      />

      {/* Sticky container for the reveal effect */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Desktop: overlay layout, Mobile: stacked layout */}
        <div className="relative flex flex-col md:block items-center justify-center w-full h-full md:h-auto">
          {/* Background images container */}
          <div className="flex items-center justify-center w-full">
            <div 
              className="relative w-full overflow-hidden rounded-xl md:rounded-2xl"
              style={{
                aspectRatio: '2.33 / 1',
                maxWidth: '95vw',
              }}
            >
              <div
                className="absolute inset-0 w-full h-full"
                style={{
                  opacity: 1 - imageFadeProgress,
                  transform: `scale(${currentPhotoScale})`,
                  transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
                }}
              >
                <img
                  src={currentSlide.image}
                  alt={currentSlide.subtitle}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              
              {/* Next slide image (for crossfade) */}
              {currentSlideIndex < totalSlides - 1 && (
                <div
                  className="absolute inset-0 w-full h-full"
                  style={{
                    opacity: imageFadeProgress,
                    transform: `scale(${nextPhotoScale})`,
                    transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
                  }}
                >
                  <img
                    src={nextSlide.image}
                    alt={nextSlide.subtitle}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Gradient overlay for text legibility - only on desktop */}
              <div
                className="absolute inset-0 hidden md:block"
                style={{
                  background: isLeftAligned 
                    ? 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)'
                    : 'linear-gradient(to left, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)',
                }}
              />
              
              {/* Vignette overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
                }}
              />
              
              {/* Warm color grade */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 183, 77, 0.1) 0%, rgba(255, 138, 101, 0.06) 50%, rgba(181, 101, 167, 0.04) 100%)',
                  mixBlendMode: 'overlay',
                }}
              />
              
              {/* Film grain overlay */}
              <FilmGrain />
            </div>
          </div>

          {/* Text content - below photo on mobile, overlay on desktop */}
          <div
            className={`
              relative md:absolute z-10 
              mt-4 md:mt-0 md:top-1/2 md:-translate-y-1/2
              w-[90%] md:max-w-[40%] lg:max-w-[30%] 
              backdrop-blur-sm rounded-lg 
              p-4 md:p-6 lg:p-8
              ${isLeftAligned 
                ? 'md:left-[6%] lg:left-[8%]' 
                : 'md:right-[6%] lg:right-[8%]'
              }
            `}
            style={{
              opacity: textOpacity > 0.05 ? 1 : 0,
              transform: isMobile 
                ? `translateY(${(1 - textOpacity) * 10}px)`
                : `translateY(calc(-50% + ${(1 - textOpacity) * 20}px))`,
              transition: 'opacity 0.15s ease-out, transform 0.15s ease-out',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            }}
          >
            {/* Subtitle */}
            <p
              className={`text-[8px] md:text-[10px] tracking-[0.3em] md:tracking-[0.4em] uppercase mb-2 md:mb-3 text-center ${
                isLeftAligned ? 'md:text-left' : 'md:text-right'
              }`}
              style={{ 
                color: 'rgba(255, 255, 255, 0.6)',
                opacity: textOpacity,
                transition: 'opacity 0.2s ease-out',
              }}
            >
              {currentSlide.subtitle}
            </p>
            
            {/* Main text with word-by-word animation */}
            <p
              className={`text-xs md:text-sm lg:text-base font-light leading-[1.5] md:leading-[1.6] tracking-tight text-center ${
                isLeftAligned ? 'md:text-left' : 'md:text-right'
              }`}
              style={{
                fontFamily: 'Helvetica, Arial, sans-serif',
              }}
            >
              {words.map((word, index) => (
                <span
                  key={`${currentSlide.id}-${index}`}
                  className="inline-block mr-[0.25em] md:mr-[0.3em] transition-all duration-200 ease-out"
                  style={{
                    opacity: index < visibleWordCount ? 1 : 0,
                    transform: index < visibleWordCount ? 'translateY(0)' : 'translateY(6px)',
                    color: 'rgba(255, 255, 255, 0.95)',
                  }}
                >
                  {word}
                </span>
              ))}
            </p>

            {/* Slide indicator dots */}
            <div className={`flex gap-1.5 md:gap-2 mt-3 md:mt-6 justify-center ${isLeftAligned ? 'md:justify-start' : 'md:justify-end'}`}>
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: index === currentSlideIndex 
                      ? 'rgba(255, 255, 255, 0.9)' 
                      : 'rgba(255, 255, 255, 0.3)',
                    transform: index === currentSlideIndex ? 'scale(1.2)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* "About me." heading with scroll-synced gradient - mobile only, positioned at top */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 md:hidden">
          <h2
            className="text-5xl font-black tracking-[-0.03em] bg-clip-text whitespace-nowrap"
            style={{
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontWeight: 900,
              backgroundImage: `linear-gradient(to right, 
                #ffffff 0%, 
                #ffffff ${Math.max(0, progress * 100 - 5)}%, 
                #cccccc ${progress * 100}%, 
                #505050 ${Math.min(100, progress * 100 + 10)}%, 
                #505050 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
            }}
          >
            About me.
          </h2>
        </div>

        {/* Progress bar at bottom - desktop only */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 w-[40%] lg:w-[30%] hidden md:block">
          <div 
            className="h-[2px] rounded-full overflow-hidden"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
          >
            <div 
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{ 
                width: `${progress * 100}%`,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
