import React, { Suspense } from 'react';
// Fix: Import THREE to resolve reference error in the scene components
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import Foliage from './Foliage';
import Ornaments from './Ornaments';
import BackgroundStars from './BackgroundStars';
import { TreeState, COLORS, TREE_CONFIG } from '../constants';

interface SceneProps {
  state: TreeState;
}

const Scene: React.FC<SceneProps> = ({ state }) => {
  const progress = state === TreeState.TREE_SHAPE ? 1 : 0;

  return (
    <Canvas shadows dpr={[1, 2]}>
      <color attach="background" args={['#000805']} />
      <fog attach="fog" args={['#000805', 5, 60]} />

      <PerspectiveCamera makeDefault position={[0, 1, 18]} fov={35} />
      <OrbitControls 
        enablePan={false} 
        minDistance={6} 
        maxDistance={30} 
        autoRotate 
        autoRotateSpeed={0.6} 
        makeDefault
        target={[0, 0, 0]}
      />

      <Suspense fallback={null}>
        <Environment preset="night" />
        
        {/* Lights - Balanced for wide spectrum of saturated colors */}
        <ambientLight intensity={0.5} />
        <pointLight position={[15, 15, 15]} intensity={3.5} color={COLORS.GOLD_BRIGHT} />
        <pointLight position={[-15, -10, -15]} intensity={2.0} color={COLORS.EMERALD_BRIGHT} />
        <pointLight position={[0, 5, 10]} intensity={1.5} color={COLORS.WHITE_GLOW} />
        
        <spotLight
          position={[0, 20, 5]}
          intensity={5}
          angle={0.5}
          penumbra={1}
          castShadow
          color={COLORS.WHITE_GLOW}
        />

        {/* Static Background Layer */}
        <BackgroundStars />

        {/* Tree Elements - Shifted up from -4 to -1 to center vertically */}
        <group position={[0, -1, 0]}>
          <Foliage progress={progress} />
          <Ornaments progress={progress} />
          
          {/* Ground Glow - Moved to tree base (Half height is 6) */}
          <ContactShadows 
            position={[0, -6.1, 0]}
            opacity={0.8} 
            scale={30} 
            blur={2.5} 
            far={10} 
            resolution={512} 
            color={COLORS.EMERALD_DEEP} 
          />
        </group>

        {/* Cinematic Effects */}
        <EffectComposer disableNormalPass>
          <Bloom 
            luminanceThreshold={0.1} 
            mipmapBlur 
            intensity={2.2} 
            radius={0.6} 
          />
          <ChromaticAberration offset={new THREE.Vector2(0.001, 0.001)} />
          <Noise opacity={0.04} />
          <Vignette eskil={false} offset={0.2} darkness={1.3} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
};

export default Scene;
