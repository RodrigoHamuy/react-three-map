import { ReconcilerRoot, RootState, useThree } from "@react-three/fiber";
import { Matrix4Tuple } from "three";
import { FromLngLat, MapInstance } from "./generic-map";

/** react-three-map store */
export interface R3mStore {
  fromLngLat: FromLngLat,
  map?: MapInstance;
  mapCamMx?: Matrix4Tuple;
  state?: RootState
  root?: ReconcilerRoot<HTMLCanvasElement>;
  projByView?: Matrix4Tuple;
  projByViewInv?: Matrix4Tuple;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useR3M = (): R3mStore => useThree((s: any) => s.r3m);