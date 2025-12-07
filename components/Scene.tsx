import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, ContactShadows, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { TreeState } from '../types';
import Foliage from './Foliage';
import Ornaments from './Ornaments';
import TopStar from './TopStar';

interface SceneProps {
  state: TreeState;
}

const Scene: React.FC<SceneProps> = ({ state }) => {
  return (
    <Canvas shadows dpr={[1, 2]} gl={{ antialias: false, toneMapping: 3 /** Reinhard-ish */ }}>
      <PerspectiveCamera makeDefault position={[0, 2, 22]} fov={45} />
      
      <color attach="background" args={['#000502']} />
      
      {/* Lighting - Cinematic & Dramatic */}
      <ambientLight intensity={0.2} color="#043927" />
      <spotLight 
        position={[10, 20, 10]} 
        angle={0.25} 
        penumbra={1} 
        intensity={500} 
        color="#fff5b6" 
        castShadow 
      />
      <pointLight position={[-10, 5, -10]} intensity={100} color="#00ff88" />
      
      {/* Environment Reflections */}
      <Environment preset="city" environmentIntensity={0.5} />
      
      {/* The Tree Components */}
      <group position={[0, -4, 0]}>
        <Foliage state={state} />
        
        {/* Red/Gold Gift Boxes */}
        <Ornaments state={state} type="box" count={150} color="#8b0000" />
        
        {/* Gold Spheres */}
        <Ornaments state={state} type="sphere" count={200} color="#FFD700" />
        
        {/* Silver Spheres */}
        <Ornaments state={state} type="sphere" count={100} color="#C0C0C0" />
        
        <TopStar state={state} />
        
        {/* Ambient Sparkles */}
        <Sparkles 
          count={200} 
          scale={20} 
          size={4} 
          speed={0.4} 
          opacity={0.5} 
          color="#FFD700" 
        />
      </group>

      {/* Floor Shadows */}
      <ContactShadows 
        resolution={1024} 
        scale={50} 
        blur={2} 
        opacity={0.5} 
        far={10} 
        color="#000000" 
      />

      {/* Post Processing for the "Glamour" look */}
      <EffectComposer disableNormalPass>
        {/* High intensity bloom for the glowing ornaments */}
        <Bloom 
          luminanceThreshold={0.8} 
          mipmapBlur 
          intensity={1.5} 
          radius={0.6} 
        />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
        <Noise opacity={0.02} />
      </EffectComposer>

      {/* Interaction */}
      <OrbitControls 
        enablePan={false} 
        minPolarAngle={Math.PI / 4} 
        maxPolarAngle={Math.PI / 2} 
        maxDistance={35}
        minDistance={10}
        autoRotate={state === TreeState.TREE_SHAPE}
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
};

export default Scene;
