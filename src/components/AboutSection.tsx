import useScrollAnimation from "@/hooks/useScrollAnimation";

const stats = [
  { value: "10+", label: "Years Experience" },
  { value: "200+", label: "Projects Completed" },
  { value: "50+", label: "Happy Clients" },
  { value: "15", label: "Team Members" },
];

const AboutSection = () => {
  const { ref: textRef, isVisible: textVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section id="about" className="py-20 md:py-32 px-4 md:px-8" style={{ background: '#0d0d0d' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Left Column - Text */}
          <div
            ref={textRef}
            className="transition-all duration-700"
            style={{
              opacity: textVisible ? 1 : 0,
              transform: textVisible ? 'translateX(0)' : 'translateX(-40px)',
            }}
          >
            <p className="text-white/40 text-xs md:text-sm tracking-widest uppercase mb-2">About Us</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white/90 tracking-tight mb-6">
              We Are Maxora
            </h2>
            <p className="text-white/50 text-sm md:text-base leading-relaxed mb-6">
              A collective of designers, strategists, and creators dedicated to pushing the boundaries of visual storytelling. We believe in the power of design to transform brands and connect with audiences on a deeper level.
            </p>
            <p className="text-white/50 text-sm md:text-base leading-relaxed">
              Founded in 2014, we've had the privilege of working with forward-thinking brands across industries, from emerging startups to established enterprises. Our approach combines strategic thinking with creative excellence.
            </p>
          </div>

          {/* Right Column - Stats */}
          <div 
            ref={statsRef}
            className="grid grid-cols-2 gap-4 md:gap-6"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="p-6 md:p-8 rounded-2xl text-center transition-all duration-500"
                style={{
                  background: 'linear-gradient(135deg, rgba(25,25,25,0.6) 0%, rgba(15,15,15,0.8) 100%)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  opacity: statsVisible ? 1 : 0,
                  transform: statsVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
                  transitionDelay: `${index * 0.1}s`,
                }}
              >
                <div className="text-3xl md:text-4xl font-bold text-white/90 mb-1">
                  {stat.value}
                </div>
                <div className="text-white/40 text-xs md:text-sm tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
