import { useMemo } from 'react';
import { Matrix4, Matrix4Tuple } from 'three';
import create from 'zustand';

export interface ThreeMapState {
  /** base camera matrix 4 */
  baseCamMx: Matrix4Tuple,
  timestamp: number,
}
export type ThreeMapStore = ReturnType<typeof create<ThreeMapState>>;

export function useStore() {
  const store = useMemo(()=>create<ThreeMapState>(()=>({
    timestamp: 0,
    baseCamMx: new Matrix4().toArray(),
  })), [])
  return store;
}