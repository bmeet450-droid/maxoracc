import useScrollAnimation from "@/hooks/useScrollAnimation";

const stats = [
  { value: "150+", label: "Projects Completed" },
  { value: "8+", label: "Years Experience" },
  { value: "50+", label: "Happy Clients" },
  { value: "15", label: "Team Members" },
];

const AboutUsSection = () => {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      id="about-us"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-4 md:px-8"
      style={{ background: '#0a0a0a' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 md:mb-24">
          <p
            className="text-xs md:text-sm tracking-[0.3em] uppercase mb-4 transition-all duration-700"
            style={{
              color: 'rgba(139, 92, 246, 0.8)',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            }}
          >
            About Us
          </p>
          <h2
            className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight transition-all duration-700"
            style={{
              color: 'rgba(255, 255, 255, 0.95)',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transitionDelay: '0.1s',
              fontFamily: 'Helvetica, Arial, sans-serif',
            }}
          >
            We craft digital experiences
            <br />
            <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>that inspire and engage</span>
          </h2>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20">
          {/* Left Column - Main Description */}
          <div
            className="transition-all duration-700"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
              transitionDelay: '0.2s',
            }}
          >
            <p
              className="text-lg md:text-xl leading-relaxed mb-6"
              style={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              Maxora is a creative studio dedicated to pushing the boundaries of digital design. 
              We believe in the power of visual storytelling to transform brands and create 
              meaningful connections with audiences.
            </p>
            <p
              className="text-base md:text-lg leading-relaxed"
              style={{ color: 'rgba(255, 255, 255, 0.5)' }}
            >
              Founded with a passion for innovation, our team combines strategic thinking with 
              artistic excellence to deliver projects that not only look stunning but also 
              drive real results for our clients.
            </p>
          </div>

          {/* Right Column - Mission & Vision */}
          <div
            className="space-y-8 transition-all duration-700"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
              transitionDelay: '0.3s',
            }}
          >
            <div>
              <h3
                className="text-sm tracking-[0.2em] uppercase mb-3"
                style={{ color: 'rgba(139, 92, 246, 0.8)' }}
              >
                Our Mission
              </h3>
              <p
                className="text-base leading-relaxed"
                style={{ color: 'rgba(255, 255, 255, 0.6)' }}
              >
                To empower brands with bold, innovative design solutions that captivate 
                audiences and drive meaningful engagement in the digital age.
              </p>
            </div>
            <div>
              <h3
                className="text-sm tracking-[0.2em] uppercase mb-3"
                style={{ color: 'rgba(139, 92, 246, 0.8)' }}
              >
                Our Vision
              </h3>
              <p
                className="text-base leading-relaxed"
                style={{ color: 'rgba(255, 255, 255, 0.6)' }}
              >
                To be the creative force that shapes the future of digital experiences, 
                setting new standards for design excellence and innovation.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t transition-all duration-700"
          style={{
            borderColor: 'rgba(255, 255, 255, 0.1)',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            transitionDelay: '0.4s',
          }}
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center md:text-left transition-all duration-700"
              style={{
                transitionDelay: `${0.5 + index * 0.1}s`,
              }}
            >
              <p
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2"
                style={{
                  color: 'rgba(255, 255, 255, 0.95)',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                }}
              >
                {stat.value}
              </p>
              <p
                className="text-xs md:text-sm tracking-[0.15em] uppercase"
                style={{ color: 'rgba(255, 255, 255, 0.4)' }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
