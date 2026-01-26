import Spline from '@splinetool/react-spline';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';

const VideoCollage = () => {
  const isMobile = useIsMobile();
  const [isLoaded, setIsLoaded] = useState(false);

  // Mobile: static gradient for performance
  if (isMobile) {
    return (
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center top, rgba(30,30,35,1) 0%, rgba(15,15,18,1) 40%, rgba(10,10,10,1) 100%)',
          }}
        />
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,10,10,0.6) 80%, rgba(10,10,10,0.9) 100%)'
          }}
        />
      </div>
    );
  }

  // Desktop: Spline 3D scene with loading animation
  return (
    <div className="absolute inset-0 z-0">
      {/* Loading state */}
      <div 
        className="absolute inset-0 flex items-center justify-center transition-opacity duration-1000"
        style={{
          background: 'radial-gradient(ellipse at center top, rgba(30,30,35,1) 0%, rgba(15,15,18,1) 40%, rgba(10,10,10,1) 100%)',
          opacity: isLoaded ? 0 : 1,
          pointerEvents: isLoaded ? 'none' : 'auto',
        }}
      >
        {/* Elegant loading animation */}
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-16 h-16">
            <div 
              className="absolute inset-0 rounded-full border border-white/20"
              style={{
                animation: 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }}
            />
            <div 
              className="absolute inset-2 rounded-full border border-white/30"
              style={{
                animation: 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.3s',
              }}
            />
            <div 
              className="absolute inset-4 rounded-full border border-white/40"
              style={{
                animation: 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.6s',
              }}
            />
          </div>
          <span 
            className="text-white/40 text-xs tracking-[0.3em] uppercase"
            style={{
              animation: 'fade-pulse 2s ease-in-out infinite',
            }}
          >
            Loading
          </span>
        </div>
      </div>

      {/* Spline scene */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          opacity: isLoaded ? 1 : 0,
        }}
      >
        <Spline
          scene="https://prod.spline.design/JU-Dc-H9DL9ubfgH/scene.splinecode"
          onLoad={() => setIsLoaded(true)}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </div>
      
      {/* Top overlay to hide Spline navigation text */}
      <div 
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 40%, rgba(0,0,0,0) 100%)'
        }}
      />
      
      {/* Bottom overlay to hide Spline elements */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 40%, rgba(0,0,0,0) 100%)'
        }}
      />
      
      {/* Vignette overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 80%, rgba(0,0,0,0.7) 100%)'
        }}
      />

      {/* CSS animations */}
      <style>{`
        @keyframes pulse-ring {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
        
        @keyframes fade-pulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
};

export default VideoCollage;
