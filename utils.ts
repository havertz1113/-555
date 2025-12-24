
import { TREE_CONFIG } from './constants';

export const generatePositions = (count: number) => {
  const treePositions = new Float32Array(count * 3);
  const scatterPositions = new Float32Array(count * 3);
  const randomSeeds = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    // 1. Generate Tree Position (Conical Volume Distribution)
    // Modified: Using a slight bias towards higher 'u' values for a portion of the count
    // to populate the top more densely as requested.
    let u = Math.random();
    
    // For 30% of elements, bias them towards the top (higher y)
    if (i > count * 0.7) {
        u = Math.pow(Math.random(), 0.5); // Bias towards 1.0
    }

    const y = TREE_CONFIG.HEIGHT * (1 - Math.pow(1 - u, 1 / 3));
    const progress = y / TREE_CONFIG.HEIGHT;
    const radiusAtHeight = (1 - progress) * TREE_CONFIG.BASE_RADIUS;
    
    const theta = progress * Math.PI * 25 + Math.random() * Math.PI * 2;
    const r = radiusAtHeight * (0.1 + Math.random() * 0.9);
    
    treePositions[i * 3 + 0] = Math.cos(theta) * r;
    treePositions[i * 3 + 1] = y - TREE_CONFIG.HEIGHT / 2;
    treePositions[i * 3 + 2] = Math.sin(theta) * r;

    // 2. Generate Scatter Position (Spherical Volume)
    const sTheta = Math.random() * Math.PI * 2;
    const sPhi = Math.acos(2 * Math.random() - 1);
    const sDist = Math.pow(Math.random(), 0.5) * TREE_CONFIG.SCATTER_RADIUS;

    scatterPositions[i * 3 + 0] = sDist * Math.sin(sPhi) * Math.cos(sTheta);
    scatterPositions[i * 3 + 1] = sDist * Math.sin(sPhi) * Math.sin(sTheta);
    scatterPositions[i * 3 + 2] = sDist * Math.cos(sPhi);

    randomSeeds[i] = Math.random();
  }

  return { treePositions, scatterPositions, randomSeeds };
};
