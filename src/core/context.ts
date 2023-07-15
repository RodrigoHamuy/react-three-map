import { createContext } from "react";
import { FromLngLat } from "./generic-map";
import { StateRef } from "./state-ref";

export type CanvasContextType = { stateRef: StateRef, fromLngLat: FromLngLat };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CanvasContext = createContext<CanvasContextType>(undefined as any);