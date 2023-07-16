import { useThree } from "@react-three/fiber";
import { FromLngLat, MapInstance } from "./generic-map";
import { StateRef } from "./state-ref";

/** react-three-map store */
export interface R3mStore {
  fromLngLat: FromLngLat,
  map: MapInstance;
  state: StateRef;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useR3M = () : R3mStore => useThree((s: any)=>s.r3m);