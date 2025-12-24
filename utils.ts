import * as THREE from 'three';
import { TREE_CONFIG } from './constants';

export const generatePositions = (count: number) => {
  const treePositions = new Float32Array(count * 3);
  const scatterPositions = new Float32Array(count * 3);
  const randomSeeds = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    // Tree positions (cone shape)
    const y = (Math.random() - 0.5) * TREE_CONFIG.HEIGHT;
    const heightFactor = (y + TREE_CONFIG.HEIGHT / 2) / TREE_CONFIG.HEIGHT;
    const radius = (1 - heightFactor) * 4 + 0.5;
    const angle = Math.random() * Math.PI * 2;
    
    treePositions[i * 3 + 0] = Math.cos(angle) * radius * (0.5 + Math.random() * 0.5);
    treePositions[i * 3 + 1] = y;
    treePositions[i * 3 + 2] = Math.sin(angle) * radius * (0.5 + Math.random() * 0.5);

    // Scattered positions (sphere)
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    const r = 8 + Math.random() * 4;
    
    scatterPositions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
    scatterPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    scatterPositions[i * 3 + 2] = r * Math.cos(phi);

    randomSeeds[i] = Math.random();
  }

  return { treePositions, scatterPositions, randomSeeds };
};
