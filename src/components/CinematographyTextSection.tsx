import { MagneticText } from "@/components/ui/morphing-cursor";
import { useState, useEffect } from "react";

const CinematographyTextSection = () => {
  const [circleSize, setCircleSize] = useState(320);

  useEffect(() => {
    const updateCircleSize = () => {
      const width = window.innerWidth;
      if (width < 768) setCircleSize(180);
      else if (width < 1024) setCircleSize(240);
      else setCircleSize(320);
    };
    updateCircleSize();
    window.addEventListener("resize", updateCircleSize);
    return () => window.removeEventListener("resize", updateCircleSize);
  }, []);

  return (
    <section className="relative py-20 md:py-32" style={{ background: '#000000' }}>
      <div className="flex flex-col items-center">
        <MagneticText
          text="I SPECIALIZE IN CINEMATOGRAPHY"
          hoverText="I KNOW A THING OR TWO ABOUT IT"
          className="h-32 md:h-48 w-full"
          circleSize={circleSize}
        />
      </div>
    </section>
  );
};

export default CinematographyTextSection;
