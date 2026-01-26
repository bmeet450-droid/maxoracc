import Spline from '@splinetool/react-spline';

const VideoCollage = () => {
  return (
    <div className="absolute inset-0 z-0">
      {/* Spline 3D Scene */}
      <Spline
        scene="https://prod.spline.design/JU-Dc-H9DL9ubfgH/scene.splinecode"
        style={{
          width: '100%',
          height: '100%',
        }}
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
