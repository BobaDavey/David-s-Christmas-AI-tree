import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TreeState } from '../types';

interface TopStarProps {
  state: TreeState;
}

const TopStar: React.FC<TopStarProps> = ({ state }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  const treePos = new THREE.Vector3(0, 8.5, 0); // Top of the cone
  const scatterPos = new THREE.Vector3(0, 15, -5); // Floating high up
  const currentPos = useRef(scatterPos.clone());
  
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    
    const target = state === TreeState.TREE_SHAPE ? treePos : scatterPos;
    currentPos.current.lerp(target, delta * 2);
    
    groupRef.current.position.copy(currentPos.current);
    
    // Slow luxurious rotation
    groupRef.current.rotation.y += delta * 0.5;
    groupRef.current.rotation.z = Math.sin(Date.now() * 0.001) * 0.1;
  });

  return (
    <group ref={groupRef}>
      {/* Glow Halo */}
      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      
      {/* The Star Shape */}
      <mesh castShadow>
        <octahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial 
          color="#FFD700" 
          emissive="#FFD700" 
          emissiveIntensity={2} 
          roughness={0} 
          metalness={1} 
        />
      </mesh>
      
      {/* Inner sparkle */}
      <mesh scale={0.5} rotation={[0, Math.PI / 4, 0]}>
         <octahedronGeometry args={[0.8, 0]} />
         <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={5} />
      </mesh>
    </group>
  );
};

export default TopStar;
