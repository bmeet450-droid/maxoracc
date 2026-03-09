import { MagneticText } from "@/components/ui/morphing-cursor";
import { useState, useEffect } from "react";

const MagneticTextSection = () => {
  const [circleSize, setCircleSize] = useState(320);

  useEffect(() => {
    const updateCircleSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        // Mobile
        setCircleSize(180);
      } else if (width < 1024) {
        // Tablet
        setCircleSize(240);
      } else {
        // Desktop
        setCircleSize(320);
      }
    };

    updateCircleSize();
    window.addEventListener("resize", updateCircleSize);
    return () => window.removeEventListener("resize", updateCircleSize);
  }, []);

  return (
    <section className="relative py-20 md:py-32" style={{ background: '#000000' }}>
      <div className="flex flex-col items-center gap-12 md:gap-16">
        <MagneticText
          text="CREATIVE"
          hoverText="EXPLORE"
          className="h-32 md:h-48 w-full"
          circleSize={circleSize}
        />
      </div>
    </section>
  );
};

export default MagneticTextSection;
