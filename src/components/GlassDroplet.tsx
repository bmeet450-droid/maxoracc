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
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} scale={2.2}>
        <sphereGeometry args={[1, 128, 128]} />
        <MeshTransmissionMaterial
          backside
          samples={16}
          resolution={512}
          transmission={1}
          roughness={0.0}
          thickness={0.5}
          ior={1.5}
          chromaticAberration={0.4}
          anisotropy={0.3}
          distortion={0.5}
          distortionScale={0.5}
          temporalDistortion={0.1}
          clearcoat={1}
          attenuationDistance={0.5}
          attenuationColor="#8b5cf6"
          color="#a78bfa"
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
          roughness={0.0}
          thickness={0.3}
          ior={1.4}
          chromaticAberration={0.3}
          distortion={0.3}
          distortionScale={0.3}
          clearcoat={1}
          color="#c4b5fd"
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
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#8b5cf6" />
        <pointLight position={[0, 0, 5]} intensity={0.5} color="#a78bfa" />
        
        <MainSphere />
        <SmallSphere position={[3, -1.5, 0]} scale={0.4} />
        <SmallSphere position={[-3.5, 1, -1]} scale={0.25} />
        <SmallSphere position={[4, 1.5, -0.5]} scale={0.15} />
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default GlassDroplet;
