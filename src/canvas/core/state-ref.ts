import { ReconcilerRoot, RootState } from "@react-three/fiber";
import { MutableRefObject } from "react";
import { Map } from "./generic-map";

export type StateRef = MutableRefObject<{
  map: Map;
  root: ReconcilerRoot<HTMLCanvasElement>;
  state?: RootState;
} | undefined>