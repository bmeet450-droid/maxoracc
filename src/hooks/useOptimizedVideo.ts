import { useEffect, useRef, useState, useCallback } from "react";

interface UseOptimizedVideoOptions {
  threshold?: number;
  rootMargin?: string;
  staggerDelay?: number;
  disableOnMobile?: boolean;
}

export function useOptimizedVideo(options: UseOptimizedVideoOptions = {}) {
  const {
    threshold = 0.5,
    rootMargin = "0px",
    staggerDelay = 0,
    disableOnMobile = true,
  } = options;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Intersection Observer for visibility-based playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold, rootMargin }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  // Play/pause based on visibility and mobile state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const shouldPlay = isVisible && !(disableOnMobile && isMobile);

    if (shouldPlay && !isPlaying) {
      // Stagger playback to prevent simultaneous starts
      const timer = setTimeout(() => {
        video.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // Autoplay was prevented, this is expected on some browsers
          setIsPlaying(false);
        });
      }, staggerDelay);
      
      return () => clearTimeout(timer);
    } else if (!shouldPlay && isPlaying) {
      video.pause();
      setIsPlaying(false);
    }
  }, [isVisible, isMobile, disableOnMobile, staggerDelay, isPlaying]);

  const showPoster = isMobile && disableOnMobile;

  return {
    videoRef,
    isVisible,
    isMobile,
    isPlaying,
    showPoster,
  };
}

// Generate a simple poster placeholder color based on video path
export function getVideoPoster(videoPath: string): string {
  // Return a simple gradient data URL as fallback poster
  // In production, you'd generate actual thumbnail images
  const hash = videoPath.split("").reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const hue = Math.abs(hash) % 360;
  
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
      <rect width="100" height="100" fill="hsl(${hue}, 10%, 8%)"/>
    </svg>
  `)}`;
}
