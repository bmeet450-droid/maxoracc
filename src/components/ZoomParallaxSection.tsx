import { ZoomParallax } from "@/components/ui/zoom-parallax";
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";
import portfolio4 from "@/assets/portfolio-4.jpg";
import portfolio5 from "@/assets/portfolio-5.jpg";
import portfolio6 from "@/assets/portfolio-6.jpg";

const images = [
  { src: portfolio1, alt: "Portfolio showcase 1" },
  { src: portfolio2, alt: "Portfolio showcase 2" },
  { src: portfolio3, alt: "Portfolio showcase 3" },
  { src: portfolio4, alt: "Portfolio showcase 4" },
  { src: portfolio5, alt: "Portfolio showcase 5" },
  { src: portfolio6, alt: "Portfolio showcase 6" },
  { src: portfolio1, alt: "Portfolio showcase 7" },
];

const ZoomParallaxSection = () => {
  return (
    <section className="relative" style={{ background: '#000000' }}>
      <ZoomParallax images={images} />
    </section>
  );
};

export default ZoomParallaxSection;
