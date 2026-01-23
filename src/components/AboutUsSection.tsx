import useScrollProgress from "@/hooks/useScrollProgress";
import aboutPhoto from "@/assets/about-photo.jpg";
import FilmGrain from "./FilmGrain";

const AboutUsSection = () => {
  const { ref: sectionRef, progress } = useScrollProgress({ start: 0.1, end: 0.6 });

  // Photo starts at 60% size and scales to fill viewport
  const photoScale = 0.6 + progress * 0.4;
  
  // Rounded corners go from rounded to none
  const borderRadius = (1 - progress) * 24;
  
  // Text fades in during the animation
  const textOpacity = Math.max(0, (progress - 0.3) / 0.7);
  const textTranslate = (1 - textOpacity) * 30;

  return (
    <section
      id="about-us"
      ref={sectionRef}
      className="relative min-h-[200vh]"
      style={{ background: '#0a0a0a' }}
    >
      {/* Sticky container for the reveal effect */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Text content - positioned over left side of photo */}
        <div
          className="absolute z-10 left-[5%] md:left-[8%] lg:left-[10%] top-1/2 -translate-y-1/2 max-w-[30%] md:max-w-[25%] backdrop-blur-sm rounded-lg p-4 md:p-6"
          style={{
            opacity: textOpacity,
            transform: `translateY(calc(-50% + ${textTranslate}px))`,
            transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
            backgroundColor: 'rgba(0, 0, 0, 0.15)',
          }}
        >
          <p
            className="text-[8px] md:text-[10px] tracking-[0.4em] uppercase mb-3"
            style={{ color: 'rgba(255, 255, 255, 0.6)' }}
          >
            About
          </p>
          
          <h2
            className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-light leading-[1.2] tracking-tight"
            style={{
              color: 'rgba(255, 255, 255, 0.95)',
              fontFamily: 'Helvetica, Arial, sans-serif',
            }}
          >
            We are a creative studio obsessed with the craft of design.
          </h2>
          
          <p
            className="mt-3 md:mt-4 text-[10px] md:text-xs lg:text-sm leading-relaxed"
            style={{ color: 'rgba(255, 255, 255, 0.5)' }}
          >
            Our work lives at the intersection of strategy, aesthetics, and technology.
          </p>
        </div>

        {/* Photo container - centered, fills screen */}
        <div
          className="flex items-center justify-center w-full"
          style={{
            transform: `scale(${photoScale})`,
            transition: 'transform 0.1s ease-out',
          }}
        >
          <div
            className="relative overflow-hidden"
            style={{
              width: '100vw',
              aspectRatio: '2.33 / 1',
              borderRadius: `${borderRadius}px`,
              transition: 'border-radius 0.1s ease-out',
            }}
          >
            <img
              src={aboutPhoto}
              alt="About"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Gradient overlay for text legibility */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to bottom, rgba(0,0,0,${0.6 * progress}) 0%, rgba(0,0,0,${0.2 * progress}) 40%, rgba(0,0,0,${0.1 * progress}) 100%)`,
              }}
            />
            {/* Vignette overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)',
              }}
            />
            {/* Warm color grade */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 183, 77, 0.12) 0%, rgba(255, 138, 101, 0.08) 50%, rgba(181, 101, 167, 0.06) 100%)',
                mixBlendMode: 'overlay',
              }}
            />
            {/* Film grain overlay */}
            <FilmGrain />
          </div>
        </div>
      </div>

      {/* Scroll space below */}
      <div className="h-[50vh]" />
    </section>
  );
};

export default AboutUsSection;
