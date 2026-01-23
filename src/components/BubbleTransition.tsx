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
}

const BubbleTransition = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Generate many bubbles for the transition effect
  const transitionBubbles = useMemo<TransitionBubble[]>(() => {
    const bubbles: TransitionBubble[] = [];
    const count = isMobile ? 40 : 80;
    
    for (let i = 0; i < count; i++) {
      bubbles.push({
        id: i,
        baseX: Math.random() * 100,
        baseY: Math.random() * 100,
        size: 20 + Math.random() * 180,
        blur: 8 + Math.random() * 20,
        opacity: 0.1 + Math.random() * 0.25,
        delay: Math.random() * 0.5,
        disperseX: (Math.random() - 0.5) * 200,
        disperseY: (Math.random() - 0.5) * 200,
      });
    }
    return bubbles;
  }, [isMobile]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate scroll progress through the transition zone
      // Progress goes from 0 (just entering) to 1 (fully through)
      const startTrigger = windowHeight * 0.8;
      const endTrigger = -rect.height * 0.3;
      
      if (rect.top > startTrigger) {
        setScrollProgress(0);
      } else if (rect.top < endTrigger) {
        setScrollProgress(1);
      } else {
        const progress = (startTrigger - rect.top) / (startTrigger - endTrigger);
        setScrollProgress(Math.max(0, Math.min(1, progress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Phase 1: 0-0.5 = bubbles gather and grow (covering screen)
  // Phase 2: 0.5-1 = bubbles disperse and fade (revealing content)
  const gatherPhase = Math.min(scrollProgress * 2, 1);
  const dispersePhase = Math.max((scrollProgress - 0.5) * 2, 0);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-30 overflow-hidden"
    >
      {transitionBubbles.map((bubble) => {
        // Calculate bubble scale based on phases
        const gatherScale = gatherPhase * (1 + bubble.delay * 0.5);
        const disperseScale = 1 - dispersePhase * 0.8;
        const scale = Math.min(gatherScale, 1) * Math.max(disperseScale, 0.2);
        
        // Calculate opacity
        const gatherOpacity = gatherPhase * bubble.opacity;
        const disperseOpacity = 1 - dispersePhase;
        const opacity = gatherOpacity * disperseOpacity;
        
        // Calculate position (disperse outward in phase 2)
        const disperseOffsetX = dispersePhase * bubble.disperseX;
        const disperseOffsetY = dispersePhase * bubble.disperseY;
        
        // Size scales up during gather, slightly down during disperse
        const dynamicSize = bubble.size * scale * (isMobile ? 0.5 : 1);
        const dynamicBlur = bubble.blur * (1 + gatherPhase * 0.5);

        return (
          <div
            key={bubble.id}
            className="absolute rounded-full"
            style={{
              left: `${bubble.baseX}%`,
              top: `${bubble.baseY}%`,
              width: dynamicSize,
              height: dynamicSize,
              transform: `translate(-50%, -50%) translate(${disperseOffsetX}px, ${disperseOffsetY}px)`,
              backdropFilter: `blur(${dynamicBlur}px)`,
              WebkitBackdropFilter: `blur(${dynamicBlur}px)`,
              background: `radial-gradient(ellipse at 30% 30%, rgba(255,255,255,${opacity * 0.5}) 0%, rgba(139,92,246,${opacity * 0.4}) 40%, transparent 70%)`,
              boxShadow: `inset 0 0 ${dynamicSize * 0.3}px rgba(255,255,255,${opacity * 0.3}), 0 0 ${dynamicSize * 0.4}px rgba(139,92,246,${opacity * 0.2})`,
              border: `1px solid rgba(255,255,255,${opacity * 0.2})`,
              opacity: opacity > 0.01 ? 1 : 0,
              transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
            }}
          />
        );
      })}
      
      {/* Full screen coverage overlay that fades with bubbles */}
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, rgba(139,92,246,${gatherPhase * 0.15 * (1 - dispersePhase)}) 0%, rgba(0,0,0,${gatherPhase * 0.4 * (1 - dispersePhase)}) 100%)`,
          opacity: gatherPhase * (1 - dispersePhase),
          transition: 'opacity 0.1s ease-out',
        }}
      />
    </div>
  );
};

export default BubbleTransition;