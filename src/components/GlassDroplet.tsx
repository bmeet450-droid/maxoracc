import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshTransmissionMaterial, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

// Mouse position hook
const useMousePosition = () => {
  const mouse = useRef({ x: 0, y: 0 });
  
  if (typeof window !== 'undefined') {
    window.addEventListener('mousemove', (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });
  }
  
  return mouse;
};

interface SphereProps {
  position: [number, number, number];
  scale: number;
  depth: 'foreground' | 'midground' | 'background';
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}

const GlassSphere = ({ position, scale, depth, mouse }: SphereProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialPosition = useMemo(() => new THREE.Vector3(...position), [position]);
  
  // Depth-based settings
  const depthConfig = useMemo(() => {
    switch (depth) {
      case 'foreground':
        return { 
          parallaxStrength: 0.8, 
          mouseInfluence: 0.4,
          blur: true,
          floatSpeed: 3,
          floatIntensity: 1.2,
          opacity: 0.6
        };
      case 'midground':
        return { 
          parallaxStrength: 0.4, 
          mouseInfluence: 0.25,
          blur: false,
          floatSpeed: 2,
          floatIntensity: 0.6,
          opacity: 0.8
        };
      case 'background':
        return { 
          parallaxStrength: 0.15, 
          mouseInfluence: 0.1,
          blur: false,
          floatSpeed: 1,
          floatIntensity: 0.3,
          opacity: 0.9
        };
    }
  }, [depth]);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Mouse following with depth-based influence
    const targetX = initialPosition.x + mouse.current.x * depthConfig.mouseInfluence * 2;
    const targetY = initialPosition.y + mouse.current.y * depthConfig.mouseInfluence * 2;
    
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.05);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.05);
    
    // Rotation
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
      <mesh 
        ref={meshRef} 
        position={position} 
        scale={scale}
      >
        <sphereGeometry args={[1, depth === 'foreground' ? 32 : 64, depth === 'foreground' ? 32 : 64]} />
        <MeshTransmissionMaterial {...materialProps} />
      </mesh>
    </Float>
  );
};

// Main sphere with enhanced mouse reactivity
const MainSphere = ({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Smooth mouse following
    const targetX = mouse.current.x * 0.3;
    const targetY = mouse.current.y * 0.3;
    
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.03);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.03);
    
    // Rotation influenced by mouse
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.1 + mouse.current.x * 0.2;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.1 + mouse.current.y * 0.1;
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

// Foreground blur overlay for depth-of-field effect
const ForegroundBlur = () => {
  return (
    <div 
      className="absolute inset-0 pointer-events-none z-10"
      style={{
        background: 'transparent',
      }}
    />
  );
};

const Scene = () => {
  const mouse = useMousePosition();
  
  // Bubble configurations with depth layers
  const bubbles = useMemo(() => [
    // Background bubbles (far, slow, sharp)
    { position: [-4, 2, -4] as [number, number, number], scale: 0.2, depth: 'background' as const },
    { position: [4.5, -1.5, -3.5] as [number, number, number], scale: 0.15, depth: 'background' as const },
    { position: [-3, -2, -5] as [number, number, number], scale: 0.25, depth: 'background' as const },
    { position: [5, 2.5, -4] as [number, number, number], scale: 0.12, depth: 'background' as const },
    
    // Midground bubbles (medium distance)
    { position: [3, -1, -1] as [number, number, number], scale: 0.18, depth: 'midground' as const },
    { position: [-3.5, 1, -1.5] as [number, number, number], scale: 0.14, depth: 'midground' as const },
    { position: [2, 2, -2] as [number, number, number], scale: 0.1, depth: 'midground' as const },
    
    // Foreground bubbles (close, fast, blurry)
    { position: [-2, -1.5, 2] as [number, number, number], scale: 0.35, depth: 'foreground' as const },
    { position: [3.5, 1.5, 2.5] as [number, number, number], scale: 0.25, depth: 'foreground' as const },
    { position: [-1, 2.5, 3] as [number, number, number], scale: 0.18, depth: 'foreground' as const },
  ], []);

  return (
    <>
      {/* Lighting from top-right */}
      <ambientLight intensity={0.15} />
      <directionalLight 
        position={[8, 10, 5]} 
        intensity={1.2} 
        color="#ffffff"
        castShadow
      />
      <directionalLight 
        position={[5, 8, 3]} 
        intensity={0.6} 
        color="#e8e4f0"
      />
      <pointLight 
        position={[6, 6, 4]} 
        intensity={0.8} 
        color="#d4c8e8" 
        distance={20}
        decay={2}
      />
      {/* Subtle fill light from opposite side */}
      <pointLight 
        position={[-6, -4, 2]} 
        intensity={0.15} 
        color="#1a1030" 
        distance={15}
      />
      
      {/* Main central sphere */}
      <MainSphere mouse={mouse} />
      
      {/* Parallax bubbles at different depths */}
      {bubbles.map((bubble, index) => (
        <GlassSphere
          key={index}
          position={bubble.position}
          scale={bubble.scale}
          depth={bubble.depth}
          mouse={mouse}
        />
      ))}
      
      <Environment preset="night" />
    </>
  );
};

const GlassDroplet = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Foreground blur overlay for depth effect */}
      <ForegroundBlur />
      
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>
    </div>
  );
};

export default GlassDroplet;
