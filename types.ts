import * as THREE from 'three';

export enum TreeState {
  SCATTERED = 'SCATTERED',
  TREE_SHAPE = 'TREE_SHAPE'
}

export interface DualPosition {
  id: number;
  scatterPos: THREE.Vector3;
  treePos: THREE.Vector3;
  rotation: THREE.Euler;
  scale: number;
  color?: THREE.Color;
  type?: 'box' | 'sphere' | 'star';
}

export interface Uniforms {
  uTime: { value: number };
  uMorphProgress: { value: number };
  uColor: { value: THREE.Color };
}
