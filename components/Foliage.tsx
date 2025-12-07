import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { generateFoliageData } from '../utils/math';
import { TreeState } from '../types';

const FoliageVertexShader = `
  uniform float uTime;
  uniform float uMorphProgress;
  
  attribute vec3 aTreePosition;
  attribute vec3 aScatterPosition;
  attribute float aRandom;
  
  varying float vAlpha;
  varying vec2 vUv;

  // Simple noise function
  float hash(float n) { return fract(sin(n) * 43758.5453123); }

  void main() {
    vUv = uv;
    
    // Smooth ease-in-out mixing
    float t = uMorphProgress;
    // Add some per-particle delay based on aRandom for organic feel
    float delay = aRandom * 0.2;
    float smoothT = smoothstep(0.0 + delay, 1.0, t);
    
    vec3 targetPos = mix(aScatterPosition, aTreePosition, smoothT);
    
    // Add "breathing" animation
    float breathe = sin(uTime * 2.0 + aRandom * 10.0) * 0.05;
    targetPos += normalize(targetPos) * breathe;

    // Add wind/float effect when scattered
    if (t < 0.5) {
       targetPos.y += sin(uTime + aRandom * 10.0) * 0.2 * (1.0 - t);
    }

    vec4 mvPosition = modelViewMatrix * vec4(targetPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Size attenuation
    gl_PointSize = (12.0 * aRandom + 5.0) * (10.0 / -mvPosition.z);
    
    // Opacity varies with breathing
    vAlpha = 0.6 + 0.4 * sin(uTime * 3.0 + aRandom * 20.0);
  }
`;

const FoliageFragmentShader = `
  uniform vec3 uColor;
  varying float vAlpha;
  varying vec2 vUv;

  void main() {
    // Circular particle
    vec2 coord = gl_PointCoord - vec2(0.5);
    float r = length(coord);
    if (r > 0.5) discard;

    // Soft glow edge
    float glow = 1.0 - (r * 2.0);
    glow = pow(glow, 1.5);

    vec3 finalColor = uColor;
    // Add a bit of gold shimmer to the center
    finalColor = mix(uColor, vec3(1.0, 0.9, 0.5), glow * 0.3);

    gl_FragColor = vec4(finalColor, vAlpha * glow);
  }
`;

interface FoliageProps {
  state: TreeState;
}

const Foliage: React.FC<FoliageProps> = ({ state }) => {
  const shaderRef = useRef<THREE.ShaderMaterial>(null);
  const COUNT = 15000;
  
  const { treePositions, scatterPositions, randoms } = useMemo(() => generateFoliageData(COUNT), []);
  
  const targetMorph = state === TreeState.TREE_SHAPE ? 1.0 : 0.0;
  const currentMorph = useRef(0);

  useFrame((state, delta) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      
      // Smooth interpolation for the morph uniform
      const speed = 2.0;
      currentMorph.current = THREE.MathUtils.lerp(currentMorph.current, targetMorph, delta * speed);
      shaderRef.current.uniforms.uMorphProgress.value = currentMorph.current;
    }
  });

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMorphProgress: { value: 0 },
    uColor: { value: new THREE.Color('#0b4f32') }, // Deep emerald
  }), []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position" // Placeholder, used for bounding sphere mostly
          count={COUNT}
          array={treePositions} // Initialize with tree positions so bounds are correct
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aTreePosition"
          count={COUNT}
          array={treePositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aScatterPosition"
          count={COUNT}
          array={scatterPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aRandom"
          count={COUNT}
          array={randoms}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={shaderRef}
        vertexShader={FoliageVertexShader}
        fragmentShader={FoliageFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default Foliage;
