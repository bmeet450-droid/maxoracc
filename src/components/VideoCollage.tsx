import { useState } from 'react';

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
      
      {/* Spline 3D Scene via iframe */}
      <iframe
        src="https://my.spline.design/JU-Dc-H9DL9ubfgH/"
        frameBorder="0"
        width="100%"
        height="100%"
        onLoad={() => setIsLoaded(true)}
        className="absolute inset-0"
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
        }}
        title="3D Hero Scene"
        allow="autoplay"
      />
      
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
