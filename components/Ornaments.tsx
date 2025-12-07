import React, { useMemo, useRef, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TreeState } from '../types';
import { generateOrnamentData } from '../utils/math';

interface OrnamentsProps {
  state: TreeState;
  type: 'sphere' | 'box';
  count: number;
  color: string;
}

const Ornaments: React.FC<OrnamentsProps> = ({ state, type, count, color }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const data = useMemo(() => generateOrnamentData(count, type), [count, type]);
  
  // Create temp object for matrix calculations
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Store current animated positions to interpolate smoothly
  const currentPositions = useMemo(() => {
    return data.map(d => d.scatterPos.clone());
  }, [data]);

  const targetMorph = state === TreeState.TREE_SHAPE ? 1.0 : 0.0;
  
  // Metal material for luxury look
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      roughness: 0.15,
      metalness: 0.9,
      emissive: new THREE.Color(color),
      emissiveIntensity: 0.2
    });
  }, [color]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Determine target based on state
    // We manually lerp position vectors here for physics-like control
    const t = targetMorph; 
    
    // Speed of transition
    const lerpFactor = delta * 2.5;

    data.forEach((item, i) => {
      const targetVec = t > 0.5 ? item.treePos : item.scatterPos;
      
      // Interpolate current position towards target
      currentPositions[i].lerp(targetVec, lerpFactor);
      
      // Add subtle floating motion
      const time = state.clock.elapsedTime;
      const floatY = Math.sin(time + item.id) * 0.05;
      
      // Update Dummy Object
      dummy.position.copy(currentPositions[i]);
      dummy.position.y += floatY;
      
      // Rotation logic: Spin faster when scattered
      const rotSpeed = t > 0.5 ? 0.2 : 1.0;
      dummy.rotation.set(
        item.rotation.x + time * rotSpeed * 0.1,
        item.rotation.y + time * rotSpeed * 0.2,
        item.rotation.z
      );
      
      dummy.scale.setScalar(item.scale);
      
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow receiveShadow>
      {type === 'box' ? (
        <boxGeometry args={[1, 1, 1]} />
      ) : (
        <sphereGeometry args={[0.6, 32, 32]} />
      )}
      <primitive object={material} attach="material" />
    </instancedMesh>
  );
};

export default Ornaments;
