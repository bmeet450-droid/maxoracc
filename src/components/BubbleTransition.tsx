import { useState, useEffect, useRef, useMemo } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface TransitionBubble {
  id: number;
  baseX: number;
  baseY: number;
  size: number;
  blur: number;
  opacity: number;
  delay: number;
  disperseX: number;
  disperseY: number;
  glowIntensity: number;
  pulseSpeed: number;
}

const BubbleTransition = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [time, setTime] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Animate glow pulsing
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => t + 0.05);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Generate many bubbles for the transition effect
  const transitionBubbles = useMemo<TransitionBubble[]>(() => {
    const bubbles: TransitionBubble[] = [];
    const count = isMobile ? 50 : 100;
    
    for (let i = 0; i < count; i++) {
      bubbles.push({
        id: i,
        baseX: Math.random() * 100,
        baseY: Math.random() * 100,
        size: 30 + Math.random() * 220,
        blur: 10 + Math.random() * 25,
        opacity: 0.15 + Math.random() * 0.35,
        delay: Math.random() * 0.8,
        disperseX: (Math.random() - 0.5) * 400,
        disperseY: (Math.random() - 0.5) * 400,
        glowIntensity: 0.5 + Math.random() * 1,
        pulseSpeed: 0.5 + Math.random() * 1.5,
      });
    }
    return bubbles;
  }, [isMobile]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Extended scroll zone for slower, more dramatic transition
      const startTrigger = windowHeight * 1.2;
      const endTrigger = -rect.height * 0.5;
      
      if (rect.top > startTrigger) {
        setScrollProgress(0);
      } else if (rect.top < endTrigger) {
        setScrollProgress(1);
      } else {
        const progress = (startTrigger - rect.top) / (startTrigger - endTrigger);
        // Apply easing for smoother feel
        const eased = progress < 0.5 
          ? 2 * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        setScrollProgress(Math.max(0, Math.min(1, eased)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Slower phase transitions for more dramatic effect
  // Phase 1: 0-0.6 = bubbles gather and grow (covering screen)
  // Phase 2: 0.6-1 = bubbles disperse and fade (revealing content)
  const gatherPhase = Math.min(scrollProgress / 0.6, 1);
  const dispersePhase = Math.max((scrollProgress - 0.6) / 0.4, 0);

  // Eased phases for smoother animation
  const easedGather = gatherPhase * gatherPhase * (3 - 2 * gatherPhase);
  const easedDisperse = dispersePhase * dispersePhase;

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-30 overflow-hidden"
    >
      {/* Ambient glow layer */}
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(139,92,246,${easedGather * 0.3 * (1 - easedDisperse)}) 0%, rgba(88,28,135,${easedGather * 0.2 * (1 - easedDisperse)}) 40%, transparent 70%)`,
          filter: `blur(${60 * easedGather}px)`,
          opacity: easedGather * (1 - easedDisperse),
          transition: 'opacity 0.3s ease-out',
        }}
      />

      {transitionBubbles.map((bubble) => {
        // Staggered animation based on delay
        const staggeredGather = Math.max(0, Math.min(1, (easedGather - bubble.delay * 0.3) / (1 - bubble.delay * 0.3)));
        const staggeredDisperse = Math.max(0, Math.min(1, (easedDisperse - bubble.delay * 0.2) / (1 - bubble.delay * 0.2)));
        
        // Calculate bubble scale with dramatic growth
        const gatherScale = staggeredGather * (1.2 + bubble.delay * 0.6);
        const disperseScale = 1 - staggeredDisperse * 0.9;
        const scale = Math.min(gatherScale, 1.2) * Math.max(disperseScale, 0.1);
        
        // Pulsing glow effect
        const pulse = Math.sin(time * bubble.pulseSpeed) * 0.3 + 0.7;
        
        // Calculate opacity with glow enhancement
        const baseOpacity = staggeredGather * bubble.opacity * (1 - staggeredDisperse);
        const glowOpacity = baseOpacity * bubble.glowIntensity * pulse;
        
        // Calculate position (dramatic disperse outward in phase 2)
        const disperseOffsetX = staggeredDisperse * bubble.disperseX * 1.5;
        const disperseOffsetY = staggeredDisperse * bubble.disperseY * 1.5;
        
        // Size scales up during gather
        const dynamicSize = bubble.size * scale * (isMobile ? 0.5 : 1);
        const dynamicBlur = bubble.blur * (1 + staggeredGather * 0.8);
        
        // Enhanced glow size
        const glowSize = dynamicSize * (1 + glowOpacity * 0.5);

        if (baseOpacity < 0.01) return null;

        return (
          <div
            key={bubble.id}
            className="absolute rounded-full"
            style={{
              left: `${bubble.baseX}%`,
              top: `${bubble.baseY}%`,
              width: dynamicSize,
              height: dynamicSize,
              transform: `translate(-50%, -50%) translate(${disperseOffsetX}px, ${disperseOffsetY}px) scale(${1 + pulse * 0.05})`,
              backdropFilter: `blur(${dynamicBlur}px)`,
              WebkitBackdropFilter: `blur(${dynamicBlur}px)`,
              background: `radial-gradient(ellipse at 30% 30%, 
                rgba(255,255,255,${glowOpacity * 0.7}) 0%, 
                rgba(167,139,250,${glowOpacity * 0.5}) 25%,
                rgba(139,92,246,${glowOpacity * 0.4}) 50%, 
                rgba(88,28,135,${glowOpacity * 0.2}) 75%,
                transparent 100%)`,
              boxShadow: `
                inset 0 0 ${dynamicSize * 0.4}px rgba(255,255,255,${glowOpacity * 0.4}),
                inset 0 0 ${dynamicSize * 0.2}px rgba(167,139,250,${glowOpacity * 0.3}),
                0 0 ${glowSize * 0.6}px rgba(139,92,246,${glowOpacity * 0.5}),
                0 0 ${glowSize * 1.2}px rgba(139,92,246,${glowOpacity * 0.3}),
                0 0 ${glowSize * 2}px rgba(88,28,135,${glowOpacity * 0.2})
              `,
              border: `1px solid rgba(255,255,255,${glowOpacity * 0.25})`,
              transition: 'transform 0.3s ease-out',
            }}
          />
        );
      })}
      
      {/* Dramatic vignette overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, 
            rgba(139,92,246,${easedGather * 0.2 * (1 - easedDisperse)}) 0%, 
            rgba(88,28,135,${easedGather * 0.15 * (1 - easedDisperse)}) 30%,
            rgba(0,0,0,${easedGather * 0.5 * (1 - easedDisperse)}) 100%)`,
          opacity: easedGather * (1 - easedDisperse * 0.8),
          transition: 'opacity 0.3s ease-out',
        }}
      />
      
      {/* Center focal glow */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{
          opacity: easedGather * (1 - easedDisperse),
        }}
      >
        <div 
          style={{
            width: `${200 + easedGather * 300}px`,
            height: `${200 + easedGather * 300}px`,
            background: `radial-gradient(circle, 
              rgba(167,139,250,${0.4 * (1 - easedDisperse)}) 0%, 
              rgba(139,92,246,${0.2 * (1 - easedDisperse)}) 40%, 
              transparent 70%)`,
            filter: `blur(${40 + easedGather * 40}px)`,
            transform: `scale(${1 + Math.sin(time) * 0.1})`,
            transition: 'width 0.3s, height 0.3s',
          }}
        />
      </div>
    </div>
  );
};

export default BubbleTransition;