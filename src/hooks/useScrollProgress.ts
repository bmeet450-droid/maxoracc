import { useEffect, useState, useRef, RefObject } from "react";

interface UseScrollProgressOptions {
  start?: number; // 0-1, when element enters viewport
  end?: number;   // 0-1, when animation completes
}

export const useScrollProgress = (options: UseScrollProgressOptions = {}): {
  ref: RefObject<HTMLDivElement>;
  progress: number;
} => {
  const { start = 0, end = 1 } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementHeight = element.offsetHeight;
      
      // Calculate how far through the element we've scrolled
      const scrollStart = windowHeight; // Element top hits bottom of viewport
      const scrollEnd = -elementHeight; // Element bottom leaves top of viewport
      const totalDistance = scrollStart - scrollEnd;
      
      const currentPosition = rect.top;
      const rawProgress = (scrollStart - currentPosition) / totalDistance;
      
      // Map to start/end range
      const mappedProgress = (rawProgress - start) / (end - start);
      const clampedProgress = Math.max(0, Math.min(1, mappedProgress));
      
      setProgress(clampedProgress);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [start, end]);

  return { ref, progress };
};

export default useScrollProgress;
