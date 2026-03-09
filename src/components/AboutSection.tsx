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
          className="h-32 md:h-44 w-72 md:w-[500px]"
          circleSize={320}
          wrapInnerText
        />
      </div>
    </section>
  );
};

export default AboutSection;