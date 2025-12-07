import * as THREE from 'three';
import { DualPosition } from '../types';

// Random float between min and max
export const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

// Generate a random position inside a sphere
export const getScatterPosition = (radius: number = 15): THREE.Vector3 => {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const r = Math.cbrt(Math.random()) * radius; // Cubic root for uniform distribution
  
  const sinPhi = Math.sin(phi);
  return new THREE.Vector3(
    r * sinPhi * Math.cos(theta),
    r * sinPhi * Math.sin(theta),
    r * Math.cos(phi)
  );
};

// Generate a position on/in a cone (Christmas Tree shape)
export const getTreePosition = (
  height: number,
  baseRadius: number,
  yOffset: number = -2,
  spiral: boolean = false
): THREE.Vector3 => {
  // Height normalized 0 to 1 (0 is bottom, 1 is top)
  const h = Math.random(); 
  
  // Radius at this height (linear taper)
  const rAtHeight = baseRadius * (1 - h);
  
  // Angle
  const theta = spiral 
    ? h * 20 * Math.PI + Math.random() * 0.5 // Spiral structure
    : Math.random() * Math.PI * 2;
    
  // Distance from center (volume vs surface)
  // Square root for uniform disk distribution at that slice, 
  // or bias towards edge for "surface" look
  const r = Math.sqrt(Math.random()) * rAtHeight;

  const x = r * Math.cos(theta);
  const z = r * Math.sin(theta);
  const y = (h * height) + yOffset;

  return new THREE.Vector3(x, y, z);
};

// Generator for Foliage Points
export const generateFoliageData = (count: number) => {
  const treePositions = new Float32Array(count * 3);
  const scatterPositions = new Float32Array(count * 3);
  const randoms = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    // Tree Shape
    const treePos = getTreePosition(12, 4.5, -4, true);
    treePositions[i * 3] = treePos.x;
    treePositions[i * 3 + 1] = treePos.y;
    treePositions[i * 3 + 2] = treePos.z;

    // Scatter Shape
    const scatterPos = getScatterPosition(18);
    scatterPositions[i * 3] = scatterPos.x;
    scatterPositions[i * 3 + 1] = scatterPos.y;
    scatterPositions[i * 3 + 2] = scatterPos.z;
    
    randoms[i] = Math.random();
  }

  return { treePositions, scatterPositions, randoms };
};

// Generator for Ornaments
export const generateOrnamentData = (count: number, type: 'sphere' | 'box'): DualPosition[] => {
  const data: DualPosition[] = [];
  for (let i = 0; i < count; i++) {
    data.push({
      id: i,
      scatterPos: getScatterPosition(20),
      treePos: getTreePosition(11, 4.2, -4, false), // Slightly smaller cone than foliage
      rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, 0),
      scale: randomRange(0.2, 0.4),
      type
    });
  }
  return data;
};
