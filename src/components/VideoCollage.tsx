import React, { Suspense, useState } from 'react';

const Spline = React.lazy(() => import('@splinetool/react-spline'));

const VideoCollage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="absolute inset-0 z-0">
      {/* Loading state - elegant gradient while Spline loads */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            background: 'radial-gradient(ellipse at center top, rgba(30,30,35,1) 0%, rgba(15,15,18,1) 40%, rgba(10,10,10,1) 100%)',
          }}
        />
      )}
      
      {/* Spline 3D Scene */}
      <Suspense fallback={null}>
        <Spline
          scene="https://prod.spline.design/JU-Dc-H9DL9ubfgH/scene.splinecode"
          onLoad={() => setIsLoaded(true)}
          style={{
            width: '100%',
            height: '100%',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
          }}
        />
      </Suspense>
      
      {/* Vignette effect overlay */}
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
