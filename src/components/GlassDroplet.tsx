import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

const MainSphere = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={meshRef} scale={1.2}>
        <sphereGeometry args={[1, 128, 128]} />
        <MeshTransmissionMaterial
          backside
          samples={16}
          resolution={512}
          transmission={1}
          roughness={0.1}
          thickness={0.3}
          ior={1.4}
          chromaticAberration={0.2}
          anisotropy={0.2}
          distortion={0.3}
          distortionScale={0.3}
          temporalDistortion={0.1}
          clearcoat={0.5}
          attenuationDistance={0.8}
          attenuationColor="#4c3a8c"
          color="#6b5b95"
        />
      </mesh>
    </Float>
  );
};

const SmallSphere = ({ position, scale }: { position: [number, number, number]; scale: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshTransmissionMaterial
          backside
          samples={8}
          resolution={256}
          transmission={1}
          roughness={0.15}
          thickness={0.2}
          ior={1.3}
          chromaticAberration={0.15}
          distortion={0.2}
          distortionScale={0.2}
          clearcoat={0.3}
          color="#8b7fb0"
        />
      </mesh>
    </Float>
  );
};

const GlassDroplet = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={0.6} />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} color="#4c3a8c" />
        <pointLight position={[0, 0, 5]} intensity={0.3} color="#6b5b95" />
        
        <MainSphere />
        <SmallSphere position={[2.5, -1.2, 0]} scale={0.22} />
        <SmallSphere position={[-2.8, 0.8, -1]} scale={0.14} />
        <SmallSphere position={[3.2, 1.2, -0.5]} scale={0.08} />
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default GlassDroplet;
