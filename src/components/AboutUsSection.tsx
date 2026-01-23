import useScrollProgress from "@/hooks/useScrollProgress";
import aboutPhoto from "@/assets/about-photo.jpg";

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
        {/* Text content - positioned above photo, left aligned */}
        <div
          className="absolute top-[15%] left-0 z-10 w-full px-6 md:px-12 lg:px-20"
          style={{
            opacity: textOpacity,
            transform: `translateY(${textTranslate}px)`,
            transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
          }}
        >
          <p
            className="text-[10px] md:text-xs tracking-[0.4em] uppercase mb-4"
            style={{ color: 'rgba(255, 255, 255, 0.5)' }}
          >
            About
          </p>
          
          <h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light leading-[1.2] tracking-tight max-w-3xl"
            style={{
              color: 'rgba(255, 255, 255, 0.95)',
              fontFamily: 'Helvetica, Arial, sans-serif',
            }}
          >
            We are a creative studio obsessed with the craft of design.
          </h2>
          
          <p
            className="mt-6 md:mt-8 text-sm md:text-base lg:text-lg leading-relaxed max-w-xl"
            style={{ color: 'rgba(255, 255, 255, 0.6)' }}
          >
            Our work lives at the intersection of strategy, aesthetics, and technology — 
            creating experiences that resonate and endure.
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
          </div>
        </div>
      </div>

      {/* Scroll space below */}
      <div className="h-[50vh]" />
    </section>
  );
};

export default AboutUsSection;
