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
  const bubbles = useMemo(() => [
    // Background bubbles
    { position: [-4, 2, -4] as [number, number, number], scale: 0.2, depth: 'background' as const },
    { position: [4.5, -1.5, -3.5] as [number, number, number], scale: 0.15, depth: 'background' as const },
    { position: [-3, -2, -5] as [number, number, number], scale: 0.25, depth: 'background' as const },
    { position: [5, 2.5, -4] as [number, number, number], scale: 0.12, depth: 'background' as const },
    
    // Midground bubbles
    { position: [3, -1, -1] as [number, number, number], scale: 0.18, depth: 'midground' as const },
    { position: [-3.5, 1, -1.5] as [number, number, number], scale: 0.14, depth: 'midground' as const },
    { position: [2, 2, -2] as [number, number, number], scale: 0.1, depth: 'midground' as const },
  ], []);

  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[8, 10, 5]} intensity={1.2} color="#ffffff" castShadow />
      <directionalLight position={[5, 8, 3]} intensity={0.6} color="#e8e4f0" />
      <pointLight position={[6, 6, 4]} intensity={0.8} color="#d4c8e8" distance={20} decay={2} />
      <pointLight position={[-6, -4, 2]} intensity={0.15} color="#1a1030" distance={15} />
      
      <MainSphere />
      
      {bubbles.map((bubble, index) => (
        <GlassSphere
          key={index}
          position={bubble.position}
          scale={bubble.scale}
          depth={bubble.depth}
        />
      ))}
      
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
      {/* SVG filter for glass distortion */}
      <svg className="absolute" width="0" height="0">
        <defs>
          <filter id="glass-distort" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.015" 
              numOctaves="2" 
              result="noise"
            />
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="noise" 
              scale="12" 
              xChannelSelector="R" 
              yChannelSelector="G"
            />
            <feGaussianBlur stdDeviation="0.5" />
          </filter>
        </defs>
      </svg>
      
      {/* Glass sphere distortion effect */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          backdropFilter: 'blur(1px)',
          WebkitBackdropFilter: 'blur(1px)',
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
    { baseX: 25, baseY: 70, size: 120, blur: 8, parallax: 0.4, opacity: 0.3 },
    { baseX: 80, baseY: 25, size: 90, blur: 6, parallax: 0.35, opacity: 0.25 },
    { baseX: 45, baseY: 15, size: 60, blur: 10, parallax: 0.5, opacity: 0.2 },
    { baseX: 10, baseY: 40, size: 70, blur: 12, parallax: 0.45, opacity: 0.15 },
    { baseX: 90, baseY: 60, size: 50, blur: 14, parallax: 0.55, opacity: 0.2 },
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
