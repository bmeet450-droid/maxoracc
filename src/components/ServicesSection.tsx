import { useState } from "react";
import { Palette, Layout, Video, Megaphone, Smartphone, Sparkles } from "lucide-react";

const services = [
  {
    id: 1,
    icon: Palette,
    title: "Brand Identity",
    description: "Crafting unique visual identities that resonate with your audience and stand the test of time.",
  },
  {
    id: 2,
    icon: Layout,
    title: "Web Design",
    description: "Creating immersive digital experiences that captivate users and drive engagement.",
  },
  {
    id: 3,
    icon: Video,
    title: "Motion Design",
    description: "Bringing brands to life through compelling animations and video content.",
  },
  {
    id: 4,
    icon: Megaphone,
    title: "Marketing",
    description: "Strategic campaigns that amplify your message and connect with your target market.",
  },
  {
    id: 5,
    icon: Smartphone,
    title: "App Design",
    description: "Intuitive mobile experiences designed for seamless user interaction.",
  },
  {
    id: 6,
    icon: Sparkles,
    title: "Creative Direction",
    description: "Guiding creative vision from concept to execution with precision and artistry.",
  },
];

const ServicesSection = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section id="services" className="py-20 md:py-32 px-4 md:px-8" style={{ background: '#0d0d0d' }}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-12 md:mb-20 text-center">
          <p className="text-white/40 text-xs md:text-sm tracking-widest uppercase mb-2">What We Do</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white/90 tracking-tight">
            Our Services
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="group relative p-6 md:p-8 rounded-2xl cursor-pointer transition-all duration-500"
                onMouseEnter={() => setHoveredId(service.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  background: hoveredId === service.id 
                    ? 'linear-gradient(135deg, rgba(40,40,40,0.6) 0%, rgba(25,25,25,0.8) 100%)'
                    : 'linear-gradient(135deg, rgba(25,25,25,0.4) 0%, rgba(15,15,15,0.6) 100%)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  transform: hoveredId === service.id ? 'translateY(-4px)' : 'translateY(0)',
                }}
              >
                {/* Icon */}
                <div 
                  className="mb-4 md:mb-6 transition-all duration-500"
                  style={{
                    transform: hoveredId === service.id ? 'scale(1.1)' : 'scale(1)',
                  }}
                >
                  <Icon 
                    size={32} 
                    className="text-white/60 transition-colors duration-300 group-hover:text-white/90" 
                  />
                </div>

                {/* Title */}
                <h3 className="text-white/90 text-lg md:text-xl font-semibold mb-2 md:mb-3">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-white/50 text-sm leading-relaxed">
                  {service.description}
                </p>

                {/* Hover glow */}
                <div 
                  className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500"
                  style={{
                    opacity: hoveredId === service.id ? 1 : 0,
                    boxShadow: '0 20px 40px -20px rgba(255,255,255,0.05)',
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
