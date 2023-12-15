import { useThree } from "@react-three/fiber";
import { MapInstance } from "../core/generic-map";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useMap = <T extends MapInstance = MapInstance>(): T => useThree((s: any) => {
  return s.r3m?.map;
});