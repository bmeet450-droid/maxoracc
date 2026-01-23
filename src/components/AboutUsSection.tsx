import useScrollProgress from "@/hooks/useScrollProgress";
import aboutPhoto from "@/assets/about-photo.jpg";

const AboutUsSection = () => {
  const { ref: sectionRef, progress } = useScrollProgress({ start: 0.1, end: 0.6 });

  // Photo starts at 30% size and scales to 100%
  const photoScale = 0.3 + progress * 0.7;
  
  // Rounded corners go from very rounded to none
  const borderRadius = (1 - progress) * 48;
  
  // Text fades in during the second half of the animation
  const textOpacity = Math.max(0, (progress - 0.4) / 0.6);
  const textTranslate = (1 - textOpacity) * 40;

  return (
    <section
      id="about-us"
      ref={sectionRef}
      className="relative min-h-[200vh]"
      style={{ background: '#0a0a0a' }}
    >
      {/* Sticky container for the reveal effect */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Photo container */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            padding: `${(1 - progress) * 15}%`,
            transition: 'padding 0.1s ease-out',
          }}
        >
          <div
            className="relative w-full h-full overflow-hidden"
            style={{
              borderRadius: `${borderRadius}px`,
              transform: `scale(${photoScale})`,
              transition: 'transform 0.1s ease-out, border-radius 0.1s ease-out',
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
                background: `linear-gradient(to top, rgba(0,0,0,${0.7 * progress}) 0%, rgba(0,0,0,${0.3 * progress}) 50%, rgba(0,0,0,${0.2 * progress}) 100%)`,
              }}
            />
          </div>
        </div>

        {/* Text content */}
        <div
          className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 text-center"
          style={{
            opacity: textOpacity,
            transform: `translateY(${textTranslate}px)`,
            transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
          }}
        >
          <p
            className="text-[10px] md:text-xs tracking-[0.4em] uppercase mb-8"
            style={{ color: 'rgba(255, 255, 255, 0.5)' }}
          >
            About
          </p>
          
          <h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light leading-[1.3] tracking-tight"
            style={{
              color: 'rgba(255, 255, 255, 0.95)',
              fontFamily: 'Helvetica, Arial, sans-serif',
            }}
          >
            We are a creative studio obsessed with the craft of design.
          </h2>
          
          <p
            className="mt-8 md:mt-12 text-sm md:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto"
            style={{ color: 'rgba(255, 255, 255, 0.6)' }}
          >
            Our work lives at the intersection of strategy, aesthetics, and technology — 
            creating experiences that resonate and endure.
          </p>
        </div>
      </div>

      {/* Scroll space below */}
      <div className="h-[50vh]" />
    </section>
  );
};

export default AboutUsSection;
