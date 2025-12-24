import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { TREE_CONFIG, COLORS } from '../constants';
import { generatePositions } from '../utils';

interface FoliageProps {
  progress: number; // 0 = Scattered, 1 = Tree Shape
}

const Foliage: React.FC<FoliageProps> = ({ progress }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const { treePositions, scatterPositions, randomSeeds } = useMemo(
    () => generatePositions(TREE_CONFIG.FOLIAGE_COUNT),
    []
  );

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uColorDeep: { value: new THREE.Color(COLORS.EMERALD_DEEP) },
    uColorGold: { value: new THREE.Color(COLORS.GOLD_BRIGHT) },
  }), []);

  useFrame((state) => {
    if (pointsRef.current) {
      uniforms.uTime.value = state.clock.elapsedTime;
      uniforms.uProgress.value = THREE.MathUtils.lerp(uniforms.uProgress.value, progress, 0.05);
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={TREE_CONFIG.FOLIAGE_COUNT}
          array={scatterPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-targetPosition"
          count={TREE_CONFIG.FOLIAGE_COUNT}
          array={treePositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aRandom"
          count={TREE_CONFIG.FOLIAGE_COUNT}
          array={randomSeeds}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={`
          uniform float uTime;
          uniform float uProgress;
          attribute vec3 targetPosition;
          attribute float aRandom;
          varying float vRandom;
          varying vec3 vPos;
          varying float vHeightFactor;

          void main() {
            vRandom = aRandom;
            
            vec3 pos = mix(position, targetPosition, uProgress);
            
            // Calculate height factor for stabilizing the top
            float h = (pos.y + ${TREE_CONFIG.HEIGHT.toFixed(1)} / 2.0) / ${TREE_CONFIG.HEIGHT.toFixed(1)};
            vHeightFactor = h;

            // Reduce wave amplitude at the top (h approach 1.0) and when assembled
            float stability = mix(1.0, 1.0 - h * 0.7, uProgress);
            float wave = sin(uTime * 1.5 + aRandom * 20.0) * 0.06 * stability;
            
            pos += vec3(wave, wave * 0.3, wave);
            
            vPos = pos;
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            
            // Perspective sizing - smaller at the top
            float sizeMultiplier = mix(1.0, 0.7, h * uProgress);
            gl_PointSize = (25.0 + aRandom * 15.0) * sizeMultiplier * (1.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          uniform vec3 uColorDeep;
          uniform vec3 uColorGold;
          varying float vRandom;
          varying vec3 vPos;
          varying float vHeightFactor;

          void main() {
            float dist = distance(gl_PointCoord, vec2(0.5));
            if (dist > 0.5) discard;
            
            float alpha = smoothstep(0.5, 0.1, dist);
            vec3 color = mix(uColorDeep, uColorGold, vRandom * 0.4);
            
            // Shimmer effect
            float shimmer = pow(sin(vPos.y * 3.0 + vRandom * 12.0 + vPos.x * 2.0), 4.0);
            color = mix(color, vec3(1.0, 0.95, 0.7), shimmer * 0.6);

            gl_FragColor = vec4(color, alpha * 0.85);
          }
        `}
      />
    </points>
  );
};

export default Foliage;
