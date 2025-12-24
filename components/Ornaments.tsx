import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { TREE_CONFIG, COLORS, GIFT_PALETTE } from '../constants';
import { generatePositions } from '../utils';

interface OrnamentsProps {
  progress: number;
}

const Ornaments: React.FC<OrnamentsProps> = ({ progress }) => {
  const sphereRef = useRef<THREE.InstancedMesh>(null);
  const giftRef = useRef<THREE.InstancedMesh>(null);
  const sparkRef = useRef<THREE.InstancedMesh>(null);
  
  // Hero Star Ref
  const starRef = useRef<THREE.Mesh>(null);
  const starGlowRef = useRef<THREE.PointLight>(null);

  const count = TREE_CONFIG.ORNAMENT_COUNT + 100;
  const sphereCount = Math.floor(count * 0.3);
  const giftCount = Math.floor(count * 0.4);
  const sparkCount = Math.floor(count * 0.3);

  const ornamentData = useMemo(() => generatePositions(count), [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const currentProgressRef = useRef(0);

  // Custom Star Geometry
  const starGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const points = 5;
    const outerRadius = 0.8;
    const innerRadius = 0.35;

    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.2,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.1,
      bevelSegments: 3,
    });
  }, []);

  useEffect(() => {
    if (giftRef.current) {
      for (let i = 0; i < giftCount; i++) {
        const seedIdx = i + sphereCount;
        const isNearTop = ornamentData.treePositions[seedIdx * 3 + 1] > TREE_CONFIG.HEIGHT * 0.2;
        const colorHex = isNearTop 
          ? GIFT_PALETTE[Math.floor(ornamentData.randomSeeds[seedIdx] * (GIFT_PALETTE.length))]
          : GIFT_PALETTE[i % GIFT_PALETTE.length];
        giftRef.current.setColorAt(i, new THREE.Color(colorHex));
      }
      giftRef.current.instanceColor!.needsUpdate = true;
    }

    if (sparkRef.current) {
      for (let i = 0; i < sparkCount; i++) {
        const seedIdx = i + sphereCount + giftCount;
        const isGold = ornamentData.randomSeeds[seedIdx] > 0.4;
        sparkRef.current.setColorAt(i, new THREE.Color(isGold ? COLORS.GOLD_BRIGHT : COLORS.WHITE_GLOW));
      }
      sparkRef.current.instanceColor!.needsUpdate = true;
    }
  }, [giftCount, sparkCount, ornamentData, sphereCount]);

  useFrame((state) => {
    currentProgressRef.current = THREE.MathUtils.lerp(currentProgressRef.current, progress, 0.05);
    const time = state.clock.elapsedTime;
    const p = currentProgressRef.current;

    // 1. Update Hero Star at the very top
    if (starRef.current) {
      const topY = TREE_CONFIG.HEIGHT / 2 + 0.6;
      const targetPos = new THREE.Vector3(0, topY, 0);
      const startPos = new THREE.Vector3(0, 12, 0);
      const pos = new THREE.Vector3().lerpVectors(startPos, targetPos, p);
      
      // Elegant hovering and rotation
      pos.y += Math.sin(time * 2.0) * 0.15 * p;
      starRef.current.position.copy(pos);
      starRef.current.rotation.y = time * 0.8;
      // Slight "wobble" for extra character
      starRef.current.rotation.z = Math.sin(time * 0.5) * 0.1;
      starRef.current.scale.setScalar(p * 1.2);

      // Pulse the star's glow color
      if (starRef.current.material instanceof THREE.MeshStandardMaterial) {
        const hue = (time * 0.1) % 1;
        const prismaticColor = new THREE.Color().setHSL(hue, 0.5, 0.6);
        starRef.current.material.emissive.lerp(prismaticColor, 0.05);
        starRef.current.material.emissiveIntensity = 2.0 + Math.sin(time * 3.0) * 1.0;
      }
      
      if (starGlowRef.current) {
        starGlowRef.current.intensity = (5 + Math.sin(time * 4.0) * 2) * p;
      }
    }

    const updateInstance = (mesh: THREE.InstancedMesh, startIdx: number, i: number, baseScale: number, isGift = false) => {
      const idx = startIdx + i;
      const seed = ornamentData.randomSeeds[idx];
      
      const sPos = new THREE.Vector3(ornamentData.scatterPositions[idx*3], ornamentData.scatterPositions[idx*3+1], ornamentData.scatterPositions[idx*3+2]);
      const tPos = new THREE.Vector3(ornamentData.treePositions[idx*3], ornamentData.treePositions[idx*3+1], ornamentData.treePositions[idx*3+2]);
      const pos = new THREE.Vector3().lerpVectors(sPos, tPos, p);
      
      const heightFactor = (pos.y + TREE_CONFIG.HEIGHT / 2) / TREE_CONFIG.HEIGHT;
      const jitterAmp = 0.08 * (1.0 - heightFactor * 0.6); 
      pos.y += Math.sin(time * 1.0 + seed * 15.0) * jitterAmp * p;
      
      dummy.position.copy(pos);
      
      const topScaleReducer = THREE.MathUtils.lerp(1.0, 0.55, Math.pow(heightFactor, 1.5));
      const individualScale = baseScale * (0.8 + seed * 0.5) * topScaleReducer;
      
      if (isGift) {
        const w = 0.9 + (seed * 0.3);
        const h = 0.9 + ((seed * 2.0) % 0.3);
        dummy.scale.set(individualScale * w, individualScale * h, individualScale);
        dummy.rotation.set(time * 0.2 + idx, time * 0.3, time * 0.1);
      } else {
        dummy.scale.setScalar(individualScale);
        dummy.rotation.y = time * 0.5 + seed * 6.28;
      }
      
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    };

    if (sphereRef.current) {
      for (let i = 0; i < sphereCount; i++) updateInstance(sphereRef.current, 0, i, 0.16);
      sphereRef.current.instanceMatrix.needsUpdate = true;
    }

    if (giftRef.current) {
      for (let i = 0; i < giftCount; i++) updateInstance(giftRef.current, sphereCount, i, 0.22, true);
      giftRef.current.instanceMatrix.needsUpdate = true;
    }

    if (sparkRef.current) {
      for (let i = 0; i < sparkCount; i++) {
        const idx = i + sphereCount + giftCount;
        const seed = ornamentData.randomSeeds[idx];
        const sPos = new THREE.Vector3(ornamentData.scatterPositions[idx*3], ornamentData.scatterPositions[idx*3+1], ornamentData.scatterPositions[idx*3+2]);
        const tPos = new THREE.Vector3(ornamentData.treePositions[idx*3], ornamentData.treePositions[idx*3+1], ornamentData.treePositions[idx*3+2]);
        const pos = new THREE.Vector3().lerpVectors(sPos, tPos, p);

        const twinkle = Math.sin(time * 4.0 + seed * 100.0) * 0.5 + 0.5;
        dummy.position.copy(pos);
        const heightFactor = (pos.y + TREE_CONFIG.HEIGHT / 2) / TREE_CONFIG.HEIGHT;
        const sizeBoost = 1.0 + heightFactor * 0.5;
        
        dummy.scale.setScalar((0.05 + twinkle * 0.08) * sizeBoost);
        dummy.rotation.set(time * 3.0, time * 3.0, 0);
        dummy.updateMatrix();
        sparkRef.current.setMatrixAt(i, dummy.matrix);
      }
      sparkRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Hero Star - Prismatic Gold */}
      <mesh ref={starRef} geometry={starGeometry} castShadow>
        <meshStandardMaterial 
          color={COLORS.GOLD_BRIGHT} 
          metalness={1.0} 
          roughness={0.1} 
          emissive={COLORS.GOLD_DEEP}
          emissiveIntensity={2.5}
        />
        <pointLight ref={starGlowRef} color={COLORS.GOLD_BRIGHT} distance={10} />
      </mesh>

      <instancedMesh ref={sphereRef} args={[undefined, undefined, sphereCount]} castShadow>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial 
          color={COLORS.GOLD_METALLIC} 
          metalness={1.0} 
          roughness={0.02} 
          emissive={COLORS.GOLD_DEEP}
          emissiveIntensity={0.8}
        />
      </instancedMesh>

      <instancedMesh ref={giftRef} args={[undefined, undefined, giftCount]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          metalness={0.9} 
          roughness={0.05}
          emissive={new THREE.Color(0.1, 0.1, 0.1)}
          emissiveIntensity={0.4}
        />
      </instancedMesh>

      <instancedMesh ref={sparkRef} args={[undefined, undefined, sparkCount]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial 
          emissiveIntensity={12.0} 
          toneMapped={false} 
        />
      </instancedMesh>
    </group>
  );
};

export default Ornaments;
