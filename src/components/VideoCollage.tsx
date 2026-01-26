import Spline from '@splinetool/react-spline';

const VideoCollage = () => {
  return (
    <div className="absolute inset-0 z-0">
      {/* Spline 3D Background */}
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/CO6AbJxqSVzTKFUS/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      
      {/* Vignette effect - reduced opacity for brighter background */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0.5) 100%)'
        }}
      />
    </div>
  );
};

export default VideoCollage;
