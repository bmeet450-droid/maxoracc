import ScrollTimeline from "./ScrollTimeline";
import { MagneticText } from "./ui/morphing-cursor";

const AboutSection = () => {
  return (
    <section 
      id="about" 
      className="relative"
      style={{ background: '#000000' }}
    >
      <ScrollTimeline />
      
      {/* Full Stack Website Design heading */}
      <div className="flex justify-center py-24 md:py-32">
        <MagneticText
          text="Full Stack Website Design"
          hoverText="I Code with Vibes"
          className="h-28 sm:h-36 md:h-56 w-full"
          circleSize={400}
          circleSizeTablet={280}
          circleSizeMobile={180}
        />
      </div>
    </section>
  );
};

export default AboutSection;