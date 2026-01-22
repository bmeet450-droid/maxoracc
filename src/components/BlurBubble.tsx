import { useEffect, useState } from "react";

interface BlurBubbleProps {
  size: number;
  initialX: number;
  initialY: number;
  trackingStrength?: number;
  delay?: number;
}

const BlurBubble = ({ 
  size, 
  initialX, 
  initialY, 
  trackingStrength = 2,
  delay = 0 
}: BlurBubbleProps) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const deltaX = (e.clientX - centerX) / centerX;
      const deltaY = (e.clientY - centerY) / centerY;
      
      setPosition({
        x: initialX + deltaX * trackingStrength * 20,
        y: initialY + deltaY * trackingStrength * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [initialX, initialY, trackingStrength]);

  return (
    <div
      className="absolute rounded-full transition-all duration-700 ease-out"
      style={{
        width: size,
        height: size,
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
        background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 50%, transparent 70%)',
        backdropFilter: 'blur(40px)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: 'inset 0 0 60px rgba(255,255,255,0.03)',
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.8,
      }}
    />
  );
};

export default BlurBubble;
