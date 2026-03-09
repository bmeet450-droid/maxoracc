import { MagneticText } from "@/components/ui/morphing-cursor";

const MagneticTextSection = () => {
  return (
    <section className="relative py-20 md:py-32" style={{ background: '#000000' }}>
      <div className="flex flex-col items-center gap-12 md:gap-16">
        <MagneticText
          text="CREATIVE"
          hoverText="EXPLORE"
          className="h-32 md:h-48 w-full"
        />
        <MagneticText
          text="STUDIO"
          hoverText="DISCOVER"
          className="h-32 md:h-48 w-full"
        />
      </div>
    </section>
  );
};

export default MagneticTextSection;
