import Spline from '@splinetool/react-spline';

const VideoCollage = () => {
  return (
    <div className="absolute inset-0 z-[1]">
      {/* Spline 3D Background */}
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/CO6AbJxqSVzTKFUS/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
};

export default VideoCollage;
