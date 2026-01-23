import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

// Global mouse state
const mouseState = { x: 0, y: 0 };

if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', (e) => {
    mouseState.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseState.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });
}

interface SphereProps {
  position: [number, number, number];
  scale: number;
  depth: 'foreground' | 'midground' | 'background';
}

const GlassSphere = ({ position, scale, depth }: SphereProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialPosition = useMemo(() => new THREE.Vector3(...position), [position]);
  
  const depthConfig = useMemo(() => {
    switch (depth) {
      case 'foreground':
        return { 
          parallaxStrength: 0.8, 
          mouseInfluence: 0.4,
          floatSpeed: 3,
          floatIntensity: 1.2,
        };
      case 'midground':
        return { 
          parallaxStrength: 0.4, 
          mouseInfluence: 0.25,
          floatSpeed: 2,
          floatIntensity: 0.6,
        };
      case 'background':
        return { 
          parallaxStrength: 0.15, 
          mouseInfluence: 0.1,
          floatSpeed: 1,
          floatIntensity: 0.3,
        };
    }
  }, [depth]);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const targetX = initialPosition.x + mouseState.x * depthConfig.mouseInfluence * 2;
    const targetY = initialPosition.y + mouseState.y * depthConfig.mouseInfluence * 2;
    
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.05);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.05);
    
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.15 * depthConfig.floatSpeed * 0.3;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.15;
  });

  const materialProps = useMemo(() => ({
    backside: true,
    samples: depth === 'foreground' ? 8 : 16,
    resolution: depth === 'foreground' ? 256 : 512,
    transmission: 1,
    roughness: depth === 'foreground' ? 0.2 : 0.05,
    thickness: 0.4,
    ior: 1.5,
    chromaticAberration: depth === 'foreground' ? 0.1 : 0.25,
    anisotropy: 0.3,
    distortion: 0.4,
    distortionScale: 0.4,
    temporalDistortion: 0.05,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    attenuationDistance: 0.6,
    attenuationColor: '#2a1f4e',
    color: '#3d2d6b',
  }), [depth]);

  return (
    <Float 
      speed={depthConfig.floatSpeed} 
      rotationIntensity={0.15} 
      floatIntensity={depthConfig.floatIntensity}
    >
      <mesh ref={meshRef} position={position} scale={scale}>
        <sphereGeometry args={[1, depth === 'foreground' ? 32 : 64, depth === 'foreground' ? 32 : 64]} />
        <MeshTransmissionMaterial {...materialProps} />
      </mesh>
    </Float>
  );
};

const MainSphere = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const targetX = mouseState.x * 0.3;
    const targetY = mouseState.y * 0.3;
    
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.03);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.03);
    
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.1 + mouseState.x * 0.2;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.1 + mouseState.y * 0.1;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.4}>
      <mesh ref={meshRef} scale={1.4}>
        <sphereGeometry args={[1, 128, 128]} />
        <MeshTransmissionMaterial
          backside
          samples={32}
          resolution={1024}
          transmission={1}
          roughness={0.02}
          thickness={0.5}
          ior={1.5}
          chromaticAberration={0.3}
          anisotropy={0.4}
          distortion={0.5}
          distortionScale={0.5}
          temporalDistortion={0.08}
          clearcoat={1}
          clearcoatRoughness={0.05}
          attenuationDistance={0.5}
          attenuationColor="#1a1030"
          color="#2d1f50"
        />
      </mesh>
    </Float>
  );
};

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[8, 10, 5]} intensity={1.2} color="#ffffff" castShadow />
      <directionalLight position={[5, 8, 3]} intensity={0.6} color="#e8e4f0" />
      <pointLight position={[6, 6, 4]} intensity={0.8} color="#d4c8e8" distance={20} decay={2} />
      <pointLight position={[-6, -4, 2]} intensity={0.15} color="#1a1030" distance={15} />
      
      <MainSphere />
      
      <Environment preset="night" />
    </>
  );
};
// Main glass distortion overlay that follows mouse and distorts text
const GlassDistortionOverlay = () => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [floatOffset, setFloatOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setPosition({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Floating animation
  useEffect(() => {
    let animationId: number;
    const animate = () => {
      const time = Date.now() * 0.001;
      setFloatOffset({
        x: Math.sin(time * 0.8) * 8,
        y: Math.cos(time * 0.6) * 6,
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Convert mouse position to center-relative for parallax
  const offsetX = (position.x - 50) * 0.15 + floatOffset.x;
  const offsetY = (position.y - 50) * 0.15 + floatOffset.y;

  return (
    <div 
      className="absolute z-5 pointer-events-none"
      style={{
        left: `calc(50% + ${offsetX}px)`,
        top: `calc(50% + ${offsetY}px)`,
        transform: 'translate(-50%, -50%)',
        width: '280px',
        height: '280px',
        transition: 'left 0.15s ease-out, top 0.15s ease-out',
      }}
    >
      {/* SVG filter for glass distortion with chromatic aberration */}
      <svg className="absolute" width="0" height="0">
        <defs>
          <filter id="glass-distort" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.012" 
              numOctaves="3" 
              result="noise"
            />
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="noise" 
              scale="15" 
              xChannelSelector="R" 
              yChannelSelector="G"
            />
            <feGaussianBlur stdDeviation="0.3" />
          </filter>
          
          {/* Chromatic aberration filter */}
          <filter id="chromatic-aberration" x="-20%" y="-20%" width="140%" height="140%">
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />
            <feOffset in="red" dx="2" dy="0" result="red-shifted" />
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green" />
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />
            <feOffset in="blue" dx="-2" dy="0" result="blue-shifted" />
            <feBlend in="red-shifted" in2="green" mode="screen" result="rg" />
            <feBlend in="rg" in2="blue-shifted" mode="screen" />
          </filter>
        </defs>
      </svg>
      
      {/* Chromatic aberration edge ring */}
      <div
        className="absolute rounded-full"
        style={{
          inset: '-8px',
          background: 'transparent',
          boxShadow: `
            inset 3px 0 12px rgba(255,100,100,0.15),
            inset -3px 0 12px rgba(100,100,255,0.15),
            3px 0 8px rgba(255,100,100,0.1),
            -3px 0 8px rgba(100,100,255,0.1)
          `,
          filter: 'blur(2px)',
        }}
      />
      
      {/* Glass sphere distortion effect */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          backdropFilter: 'blur(1.5px)',
          WebkitBackdropFilter: 'blur(1.5px)',
          filter: 'url(#glass-distort)',
          background: `
            radial-gradient(ellipse 40% 35% at 35% 30%, rgba(255,255,255,0.15) 0%, transparent 50%),
            radial-gradient(ellipse 60% 60% at 50% 50%, rgba(100,80,160,0.08) 0%, transparent 70%),
            radial-gradient(circle at 50% 50%, rgba(139,92,246,0.03) 0%, transparent 60%)
          `,
          boxShadow: `
            inset 0 0 60px rgba(255,255,255,0.05),
            inset 0 0 30px rgba(139,92,246,0.03),
            0 0 40px rgba(139,92,246,0.05)
          `,
          border: '1px solid rgba(255,255,255,0.04)',
        }}
      />
      
      {/* Highlight reflection */}
      <div
        className="absolute rounded-full"
        style={{
          top: '15%',
          left: '20%',
          width: '35%',
          height: '25%',
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.12) 0%, transparent 70%)',
          transform: 'rotate(-20deg)',
        }}
      />
    </div>
  );
};

// Foreground blur bubbles
const ForegroundBlurBubbles = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const foregroundBubbles = [
    // Large prominent bubbles
    { baseX: 20, baseY: 65, size: 160, blur: 10, parallax: 0.45, opacity: 0.28 },
    { baseX: 82, baseY: 30, size: 130, blur: 8, parallax: 0.4, opacity: 0.25 },
    { baseX: 12, baseY: 25, size: 115, blur: 12, parallax: 0.5, opacity: 0.22 },
    { baseX: 75, baseY: 75, size: 105, blur: 9, parallax: 0.42, opacity: 0.2 },
    { baseX: 50, baseY: 50, size: 140, blur: 7, parallax: 0.38, opacity: 0.18 },
    
    // Medium bubbles
    { baseX: 40, baseY: 12, size: 85, blur: 14, parallax: 0.55, opacity: 0.18 },
    { baseX: 8, baseY: 50, size: 95, blur: 11, parallax: 0.48, opacity: 0.2 },
    { baseX: 92, baseY: 45, size: 80, blur: 13, parallax: 0.52, opacity: 0.15 },
    { baseX: 55, baseY: 85, size: 90, blur: 10, parallax: 0.44, opacity: 0.18 },
    { baseX: 35, baseY: 75, size: 75, blur: 12, parallax: 0.46, opacity: 0.16 },
    { baseX: 68, baseY: 55, size: 70, blur: 11, parallax: 0.43, opacity: 0.14 },
    { baseX: 15, baseY: 90, size: 85, blur: 9, parallax: 0.41, opacity: 0.17 },
    
    // Small accent bubbles
    { baseX: 30, baseY: 35, size: 55, blur: 16, parallax: 0.6, opacity: 0.12 },
    { baseX: 65, baseY: 18, size: 50, blur: 18, parallax: 0.65, opacity: 0.1 },
    { baseX: 88, baseY: 88, size: 65, blur: 15, parallax: 0.58, opacity: 0.14 },
    { baseX: 5, baseY: 80, size: 60, blur: 17, parallax: 0.62, opacity: 0.12 },
    { baseX: 95, baseY: 15, size: 45, blur: 19, parallax: 0.68, opacity: 0.1 },
    { baseX: 48, baseY: 28, size: 40, blur: 20, parallax: 0.7, opacity: 0.08 },
    { baseX: 78, baseY: 62, size: 48, blur: 18, parallax: 0.64, opacity: 0.11 },
    { baseX: 22, baseY: 48, size: 52, blur: 16, parallax: 0.59, opacity: 0.13 },
    
    // Extra tiny bubbles for depth
    { baseX: 42, baseY: 68, size: 35, blur: 22, parallax: 0.75, opacity: 0.08 },
    { baseX: 85, baseY: 42, size: 30, blur: 24, parallax: 0.78, opacity: 0.06 },
    { baseX: 18, baseY: 15, size: 38, blur: 21, parallax: 0.72, opacity: 0.09 },
    { baseX: 62, baseY: 92, size: 42, blur: 20, parallax: 0.7, opacity: 0.1 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      {foregroundBubbles.map((bubble, index) => {
        const offsetX = mousePos.x * bubble.parallax * 80;
        const offsetY = -mousePos.y * bubble.parallax * 80;
        
        return (
          <div
            key={index}
            className="absolute rounded-full transition-transform duration-300 ease-out"
            style={{
              left: `${bubble.baseX}%`,
              top: `${bubble.baseY}%`,
              width: bubble.size,
              height: bubble.size,
              transform: `translate(${offsetX}px, ${offsetY}px) translate(-50%, -50%)`,
              backdropFilter: `blur(${bubble.blur}px)`,
              WebkitBackdropFilter: `blur(${bubble.blur}px)`,
              background: `radial-gradient(ellipse at 30% 30%, rgba(255,255,255,${bubble.opacity * 0.5}) 0%, rgba(139,92,246,${bubble.opacity * 0.3}) 30%, transparent 70%)`,
              boxShadow: `inset 0 0 ${bubble.size * 0.3}px rgba(255,255,255,${bubble.opacity * 0.2}), 0 0 ${bubble.size * 0.2}px rgba(139,92,246,${bubble.opacity * 0.1})`,
              border: `1px solid rgba(255,255,255,${bubble.opacity * 0.15})`,
            }}
          />
        );
      })}
    </div>
  );
};

const GlassDroplet = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Glass distortion overlay for text */}
      <GlassDistortionOverlay />
      
      {/* Main 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent', position: 'relative', zIndex: 10 }}
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>
      
      {/* Foreground blur bubbles */}
      <ForegroundBlurBubbles />
    </div>
  );
};

export default GlassDroplet;
