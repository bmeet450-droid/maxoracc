import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

const ContactParticles = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < 30; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          opacity: Math.random() * 0.4 + 0.1,
          duration: Math.random() * 20 + 15,
          delay: Math.random() * 10,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <style>{`
        @keyframes floatParticle {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: var(--particle-opacity);
          }
          25% {
            transform: translate(20px, -30px) scale(1.2);
            opacity: calc(var(--particle-opacity) * 0.6);
          }
          50% {
            transform: translate(-15px, -50px) scale(0.8);
            opacity: var(--particle-opacity);
          }
          75% {
            transform: translate(25px, -20px) scale(1.1);
            opacity: calc(var(--particle-opacity) * 0.8);
          }
        }
      `}</style>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: particle.id % 3 === 0 
              ? 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 70%, transparent 100%)'
              : particle.id % 3 === 1
                ? 'radial-gradient(circle, rgba(200,200,220,0.6) 0%, rgba(180,180,200,0.15) 70%, transparent 100%)'
                : 'radial-gradient(circle, rgba(220,220,240,0.5) 0%, rgba(200,200,220,0.1) 70%, transparent 100%)',
            boxShadow: particle.id % 3 === 0 
              ? '0 0 8px rgba(255,255,255,0.4)'
              : '0 0 6px rgba(200,200,220,0.3)',
            animation: `floatParticle ${particle.duration}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`,
            '--particle-opacity': particle.opacity,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

export default ContactParticles;
