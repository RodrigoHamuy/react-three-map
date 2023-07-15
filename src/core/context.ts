import { createContext } from "react";
import { StateRef } from "./state-ref";
import { FromLngLat } from "./generic-map";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const canvasContext = createContext<{stateRef: StateRef, fromLngLat: FromLngLat}>(undefined as any);