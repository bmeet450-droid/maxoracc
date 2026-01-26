import { useEffect, useRef, useState, useCallback } from "react";

interface HeroDistortionProps {
  children: React.ReactNode;
}

const HeroDistortion = ({ children }: HeroDistortionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isInHero, setIsInHero] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isNearText, setIsNearText] = useState(false);
  const animationRef = useRef<number>();
  const targetPos = useRef({ x: 0.5, y: 0.5 });
  const textAreaRef = useRef({ 
    top: 0.3, 
    bottom: 0.6, 
    left: 0.1, 
    right: 0.9 
  });

  // Check for mobile/touch devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const checkIfNearText = useCallback((x: number, y: number) => {
    const area = textAreaRef.current;
    // Check if cursor is in the central text area (where MAXORA is)
    const inTextArea = 
      x > area.left && x < area.right && 
      y > area.top && y < area.bottom;
    setIsNearText(inTextArea);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      targetPos.current = { x, y };
      checkIfNearText(x, y);
    };

    const handleMouseEnter = () => setIsInHero(true);
    const handleMouseLeave = () => {
      setIsInHero(false);
      setIsNearText(false);
    };

    // Smooth animation loop
    const animate = () => {
      setMousePos(prev => ({
        x: prev.x + (targetPos.current.x - prev.x) * 0.12,
        y: prev.y + (targetPos.current.y - prev.y) * 0.12,
      }));
      animationRef.current = requestAnimationFrame(animate);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isMobile, checkIfNearText]);

  // Don't apply effect on mobile
  if (isMobile) {
    return <>{children}</>;
  }

  // Dynamic distortion intensity based on position
  const distortionSize = isNearText ? 220 : 160;
  const glowIntensity = isNearText ? 0.15 : 0.08;
  const blurAmount = isNearText ? 2 : 1;

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {/* SVG Filter Definition for text distortion */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="distort-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02"
              numOctaves="4"
              seed="1"
              result="turbulence"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale={isNearText ? 8 : 0}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Primary distortion lens - follows cursor */}
      <div
        className="pointer-events-none absolute rounded-full transition-all duration-300 ease-out"
        style={{
          left: `${mousePos.x * 100}%`,
          top: `${mousePos.y * 100}%`,
          width: `${distortionSize}px`,
          height: `${distortionSize}px`,
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, 
            rgba(255,255,255,${glowIntensity}) 0%, 
            rgba(255,255,255,${glowIntensity * 0.5}) 30%, 
            transparent 70%)`,
          backdropFilter: isInHero ? `blur(${blurAmount}px) saturate(1.2)` : 'none',
          WebkitBackdropFilter: isInHero ? `blur(${blurAmount}px) saturate(1.2)` : 'none',
          opacity: isInHero ? 1 : 0,
          zIndex: 30,
          boxShadow: isInHero && isNearText
            ? `0 0 80px rgba(255,255,255,0.2), 
               0 0 40px rgba(255,255,255,0.1),
               inset 0 0 40px rgba(255,255,255,0.1)` 
            : isInHero 
            ? `0 0 40px rgba(255,255,255,0.08)` 
            : 'none',
        }}
      />

      {/* Secondary ripple effect - larger and subtler */}
      <div
        className="pointer-events-none absolute rounded-full transition-all duration-500 ease-out"
        style={{
          left: `${mousePos.x * 100}%`,
          top: `${mousePos.y * 100}%`,
          width: `${distortionSize * 1.5}px`,
          height: `${distortionSize * 1.5}px`,
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, 
            rgba(255,255,255,0.03) 0%, 
            transparent 60%)`,
          opacity: isInHero && isNearText ? 0.8 : 0,
          zIndex: 29,
        }}
      />

      {/* Chromatic aberration effect near text */}
      {isNearText && isInHero && (
        <>
          <div
            className="pointer-events-none absolute rounded-full transition-all duration-200"
            style={{
              left: `calc(${mousePos.x * 100}% - 3px)`,
              top: `${mousePos.y * 100}%`,
              width: '180px',
              height: '180px',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, rgba(255,100,100,0.04) 0%, transparent 50%)',
              mixBlendMode: 'screen',
              zIndex: 28,
            }}
          />
          <div
            className="pointer-events-none absolute rounded-full transition-all duration-200"
            style={{
              left: `calc(${mousePos.x * 100}% + 3px)`,
              top: `${mousePos.y * 100}%`,
              width: '180px',
              height: '180px',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, rgba(100,100,255,0.04) 0%, transparent 50%)',
              mixBlendMode: 'screen',
              zIndex: 28,
            }}
          />
        </>
      )}

      {/* Content */}
      <div className="relative w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default HeroDistortion;
