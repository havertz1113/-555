import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { COLORS } from '../constants';

const BackgroundStars: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 3000;

  const [positions, sizes, randoms] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const rnd = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Create a large hollow sphere for stars
      const r = 30 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      pos[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      
      sz[i] = 0.5 + Math.random() * 1.5;
      rnd[i] = Math.random();
    }
    return [pos, sz, rnd];
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(COLORS.GOLD_BRIGHT) },
  }), []);

  useFrame((state) => {
    if (pointsRef.current) {
      // Extremely slow rotation for a calm feeling
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.015;
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.005;
      uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={count}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aRandom"
          count={count}
          array={randoms}
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
          attribute float aSize;
          attribute float aRandom;
          varying float vOpacity;

          void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            
            // Subtle twinkling logic
            float twinkle = sin(uTime * 0.5 + aRandom * 10.0) * 0.5 + 0.5;
            vOpacity = (0.1 + twinkle * 0.4) * (1.0 - smoothstep(40.0, 50.0, length(position)));
            
            gl_PointSize = aSize * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          varying float vOpacity;

          void main() {
            float d = distance(gl_PointCoord, vec2(0.5));
            if (d > 0.5) discard;
            
            float alpha = smoothstep(0.5, 0.0, d) * vOpacity;
            gl_FragColor = vec4(uColor, alpha);
          }
        `}
      />
    </points>
  );
};

export default BackgroundStars;
