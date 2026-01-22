import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface CardProps {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  isColorful?: boolean;
  colorIndex?: number;
}

const Card = ({ position, rotation, color, isColorful, colorIndex = 0 }: CardProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create gradient texture for colorful cards
  const gradientTexture = useMemo(() => {
    if (!isColorful) return null;
    
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    const gradients = [
      ['#ff6b35', '#f7931e', '#ffcc00'], // Orange/Yellow
      ['#00bfff', '#1e90ff', '#4169e1'], // Blue
      ['#ff4500', '#ff6347', '#ffd700'], // Fire
    ];
    
    const colors = gradients[colorIndex % gradients.length];
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 180);
    gradient.addColorStop(0, colors[2]);
    gradient.addColorStop(0.5, colors[1]);
    gradient.addColorStop(1, colors[0]);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, [isColorful, colorIndex]);

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <RoundedBox args={[1.2, 1.6, 0.05]} radius={0.6} smoothness={8}>
        {isColorful && gradientTexture ? (
          <meshStandardMaterial 
            map={gradientTexture}
            metalness={0.3}
            roughness={0.4}
          />
        ) : (
          <meshStandardMaterial 
            color={color}
            metalness={0.6}
            roughness={0.3}
            transparent
            opacity={0.85}
          />
        )}
      </RoundedBox>
    </mesh>
  );
};

const CardGroup = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Subtle floating animation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  // Generate cards in a fan/spiral arrangement
  const cards = useMemo(() => {
    const cardData: CardProps[] = [];
    const totalCards = 12;
    
    for (let i = 0; i < totalCards; i++) {
      const angle = (i / totalCards) * Math.PI * 1.5 - Math.PI * 0.3;
      const radius = 2.5 + Math.sin(i * 0.5) * 0.5;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius * 0.5;
      const y = (i - totalCards / 2) * 0.15;
      
      // Determine if this card should be colorful
      const isColorful = i === 2 || i === 5 || i === 8;
      
      cardData.push({
        position: [x, y, z] as [number, number, number],
        rotation: [0.1, -angle + Math.PI * 0.5, 0.05 * (i - totalCards / 2)] as [number, number, number],
        color: '#2a2a2a',
        isColorful,
        colorIndex: isColorful ? Math.floor(i / 3) : 0,
      });
    }
    
    return cardData;
  }, []);

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[0.2, 0.3, 0]}>
      {cards.map((card, index) => (
        <Card key={index} {...card} />
      ))}
    </group>
  );
};

const CircularCards3D = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-5, -5, -5]} intensity={0.3} />
        <pointLight position={[0, 2, 4]} intensity={0.5} color="#ffffff" />
        <CardGroup />
      </Canvas>
    </div>
  );
};

export default CircularCards3D;
