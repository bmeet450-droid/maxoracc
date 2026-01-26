import Spline from '@splinetool/react-spline';
import { useIsMobile } from '@/hooks/use-mobile';

const VideoCollage = () => {
  const isMobile = useIsMobile();

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

  // Desktop: Spline 3D scene
  return (
    <div className="absolute inset-0 z-0">
      <Spline
        scene="https://prod.spline.design/JU-Dc-H9DL9ubfgH/scene.splinecode"
        style={{
          width: '100%',
          height: '100%',
        }}
      />
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 80%, rgba(0,0,0,0.7) 100%)'
        }}
      />
    </div>
  );
};

export default VideoCollage;
