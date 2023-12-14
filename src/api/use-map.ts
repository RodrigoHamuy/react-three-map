import { useThree } from "@react-three/fiber";
import { MapInstance } from "../core/generic-map";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useMap = <T extends MapInstance = MapInstance>(): T => useThree((s) => (s as any as { r3m: {map: T}}).r3m.map);