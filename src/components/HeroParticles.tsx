import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  isOrange: boolean;
}

const HeroParticles = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate 8-12 particles for subtle effect
    const count = 10;
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2, // 2-6px
        duration: Math.random() * 20 + 15, // 15-35s
        delay: Math.random() * -20, // stagger start
        isOrange: Math.random() > 0.5,
      });
    }
    
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: particle.isOrange
              ? 'radial-gradient(circle, rgba(255,165,80,0.8) 0%, rgba(255,120,50,0.4) 50%, transparent 70%)'
              : 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 50%, transparent 70%)',
            boxShadow: particle.isOrange
              ? '0 0 8px rgba(255,140,50,0.5)'
              : '0 0 8px rgba(255,255,255,0.4)',
            animation: `float-particle ${particle.duration}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
      
      <style>{`
        @keyframes float-particle {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.6;
          }
          25% {
            transform: translate(30px, -40px) scale(1.1);
            opacity: 0.8;
          }
          50% {
            transform: translate(-20px, -60px) scale(0.9);
            opacity: 0.5;
          }
          75% {
            transform: translate(40px, -30px) scale(1.05);
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroParticles;
