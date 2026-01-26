import Spline from '@splinetool/react-spline';

const VideoCollage = () => {
  return (
    <div className="absolute inset-0 z-20">
      {/* Spline 3D Background with drop shadow */}
      <div 
        className="absolute inset-0"
        style={{
          filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.8)) drop-shadow(0 40px 80px rgba(0,0,0,0.6))',
        }}
      >
        <Spline
          scene="https://prod.spline.design/CO6AbJxqSVzTKFUS/scene.splinecode"
          style={{ width: '100%', height: '100%', background: 'transparent' }}
        />
      </div>
      
      {/* Bottom gradient to hide watermark */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-30"
        style={{
          background: 'linear-gradient(to top, #000000 0%, #000000 40%, transparent 100%)',
        }}
      />
    </div>
  );
};

export default VideoCollage;
